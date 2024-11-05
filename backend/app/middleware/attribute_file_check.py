from fastapi import UploadFile, File, HTTPException, Request
import pandas as pd

# Filter columns by checking for numeric types or boolean-like values
def filter_last_column(df):
    last_col = df.columns[-1]
    boolean_map = {
        'True': 1, 'true': 1, 'T': 1, 't': 1, True: 1,
        'False': 0, 'false': 0, 'F': 0, 'f': 0, False: 0
    }

    df[last_col] = df[last_col].apply(lambda x: boolean_map.get(x, x))

    # Now handle numeric conversion: set >= 1 to 1, and < 1 to 0
    # df[last_col] = pd.to_numeric(df[last_col], errors='coerce').fillna(0)  # Non-numeric to NaN, then fill NaN with 0
        
    if df[last_col].apply(lambda x: isinstance(x, int)).all():
        # Apply the transformation and rename the column
        temp = df[last_col].apply(lambda x: 1 if x >= 1 else 0)
        df = df.drop(columns=[last_col])
        df['bug'] = temp
    
    return df


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


async def validate_attributes_and_source_code_files(request: Request, source_file: UploadFile = File(...), target_file: UploadFile = File(...)):
    # Check file types
    valid_extensions = {".csv", ".xls", ".xlsx"}
    source_ext = source_file.filename.split('.')[-1].lower()
    target_ext = target_file.filename.split('.')[-1].lower()

    if f".{source_ext}" not in valid_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type. Only .csv, .xls, .xlsx are allowed for source attribute file.")
    if f".{target_ext}" != ".zip":
        raise HTTPException(status_code=400, detail="Invalid file type. Only .zip is allowed for source code.")
    
    # If validation passes, read and convert files to DataFrames
    if source_ext == "csv":
        source_df = pd.read_csv(source_file.file)
    else:
        source_df = pd.read_excel(source_file.file)
        
    source_df = filter_numeric_columns(filter_last_column(source_df))
    
    return source_df, target_file




async def validate_attributes_files(request: Request, source_file: UploadFile = File(...), target_file: UploadFile = File(...)):
    # Check file types
    valid_extensions = {".csv", ".xls", ".xlsx"}
    source_ext = source_file.filename.split('.')[-1].lower()
    target_ext = target_file.filename.split('.')[-1].lower()

    if f".{source_ext}" not in valid_extensions or f".{target_ext}" not in valid_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type. Only .csv, .xls, .xlsx are allowed.")
    
    # If validation passes, read and convert files to DataFrames
    if source_ext == "csv":
        source_df = pd.read_csv(source_file.file)
    else:
        source_df = pd.read_excel(source_file.file)

    if target_ext == "csv":
        target_df = pd.read_csv(target_file.file)
    else:
        target_df = pd.read_excel(target_file.file)

    

    # Apply the filter to both DataFrames
    source_df = filter_numeric_columns(filter_last_column(source_df))
    target_df = filter_numeric_columns(filter_last_column(target_df))

    # Filtering columns that exist in both source and target, keeping last column in source as target
    target_columns = set(target_df.columns)

    # Collect columns to keep, ensuring they exist in target_df
    cols_to_keep = [col for col in source_df.columns[:-1] if col in target_columns]
    cols_to_keep.insert(0, "file_name")
    cols_to_keep.append("bug")
    cols_to_keep = list(dict.fromkeys(cols_to_keep))


    # print(cols_to_keep)

    # Filter both DataFrames to keep only the columns in cols_to_keep
    source_df = source_df[[col for col in cols_to_keep if col in source_df.columns]]
    target_df = target_df[[col for col in cols_to_keep if col in target_df.columns]]
    
    # print(source_df)
    # print(target_df)

    return source_df, target_df

