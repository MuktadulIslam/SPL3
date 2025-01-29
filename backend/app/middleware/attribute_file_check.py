from fastapi import UploadFile, File, HTTPException, Request
import pandas as pd
import io

# Helper function to filter columns with only numeric values
def filter_numeric_columns(df):
    for i, col in enumerate(df.columns):
        # Check if the first column is non-numeric, and if so, rename it to "file_name"
        if i == 0:
            try:
                df[col] = pd.to_numeric(df[col])
            except ValueError:
                df = df.rename(columns={col: "file_name"})
                continue  # Keep the first column as it contains non-numeric values

        # For other columns, try converting to numeric; if it fails, drop the column
        try:
            df[col] = pd.to_numeric(df[col])
        except ValueError:
            df = df.drop(columns=[col])
    return df

def filter_training_and_testing_df(source_df, target_df):
    # Filtering columns that exist in both source and target, keeping last column in source as target
    target_columns = set(target_df.columns)

    # Collect columns to keep, ensuring they exist in target_df
    cols_to_keep = [col for col in source_df.columns[:-1] if col in target_columns]
    cols_to_keep.insert(0, "file_name")
    cols_to_keep.append("bug")
    cols_to_keep = list(dict.fromkeys(cols_to_keep))

    # Filter both DataFrames to keep only the columns in cols_to_keep
    source_df = source_df[[col for col in cols_to_keep if col in source_df.columns]]
    target_df = target_df[[col for col in cols_to_keep if col in target_df.columns]]

    return source_df, target_df

async def validate_source_code_files(request: Request, target_file: UploadFile = File(...)):
    # Check file types
    target_ext = target_file.filename.split('.')[-1].lower()

    if f".{target_ext}" != ".zip":
        raise HTTPException(status_code=400, detail="Invalid file type. Only .zip is allowed for source code.")
    
    return target_file

async def read_file_to_dataframe(file: UploadFile) -> pd.DataFrame:
    """Helper function to read various file types into a pandas DataFrame"""
    try:
        # Read the file content
        contents = await file.read()
        
        # Get file extension
        file_ext = file.filename.split('.')[-1].lower()
        
        # Create a BytesIO object for Excel files, StringIO for CSV
        if file_ext in ['xls', 'xlsx']:
            file_obj = io.BytesIO(contents)
            df = pd.read_excel(file_obj)
        else:  # csv
            file_obj = io.StringIO(contents.decode('utf-8'))
            df = pd.read_csv(file_obj)
        
        # Reset file pointer for potential future reads
        await file.seek(0)
        
        return df
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error reading file {file.filename}: {str(e)}"
        )

async def validate_source_attributes_file(request: Request, source_file: UploadFile = File(...)):
    # Check file types
    valid_extensions = {".csv", ".xls", ".xlsx"}
    source_ext = f".{source_file.filename.split('.')[-1].lower()}"

    if source_ext not in valid_extensions:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Only .csv, .xls, .xlsx are allowed for source attribute file."
        )
    
    try:
        # Read the file into DataFrame
        source_df = await read_file_to_dataframe(source_file)
        
        # Apply numeric filtering
        source_df = filter_numeric_columns(source_df)
        
        return source_df
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error processing source file: {str(e)}"
        )

async def validate_target_attributes_file(request: Request, target_file: UploadFile = File(...)):
    # Check file types
    valid_extensions = {".csv", ".xls", ".xlsx"}
    target_ext = f".{target_file.filename.split('.')[-1].lower()}"

    if target_ext not in valid_extensions:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Only .csv, .xls, .xlsx are allowed for target attribute file."
        )
    
    try:
        # Read the file into DataFrame
        target_df = await read_file_to_dataframe(target_file)
        
        # Apply numeric filtering
        target_df = filter_numeric_columns(target_df)
        
        return target_df
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error processing target file: {str(e)}"
        )