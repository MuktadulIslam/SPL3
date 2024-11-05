from fastapi import APIRouter
from fastapi import File, UploadFile, HTTPException, Depends, status
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score
import zipfile
import io
import os
import shutil
import uuid

from ..services.models.xyz import prediction_by_xyz
from ..middleware.attribute_file_check import validate_attributes_files, validate_attributes_and_source_code_files
from ..services.attribute_extractor import getDefectAttributes

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "Welcome"}

@router.post("/from-source-code")
async def source_code_file(
    files: tuple[pd.DataFrame, pd.DataFrame] = Depends(validate_attributes_and_source_code_files)
):
    source_df, target_file = files
    
    # Drop the "bug" column and "file_name" column if they exist
    source_features = source_df.drop(columns=["bug", "file_name"], errors="ignore").to_numpy()
    source_labels = source_df.get("bug", pd.Series(dtype=float)).to_numpy()
    
    if source_features.size == 0 or source_labels.size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Source feature, source label is empty or missing."
        )
        

    # Define a unique subfolder under "extractedZips"
    base_folder = "extractedZips"
    unique_folder_name = str(uuid.uuid4())
    temp_folder_name = os.path.join(base_folder, unique_folder_name)
    os.makedirs(temp_folder_name, exist_ok=True)    # Create the "extractedZips" folder if it doesn't exist

    # Extract the zip contents to the unique folder
    zip_data = await target_file.read()
    with zipfile.ZipFile(io.BytesIO(zip_data)) as z:
        z.extractall(temp_folder_name)
        


    target_df = pd.DataFrame(getDefectAttributes(temp_folder_name))
    target_features = target_df.drop(columns=['file_name'], errors='ignore').to_numpy()
    
    # print(target_features)
    # print(source_features)
    
    
    # Predict labels for target features
    target_labels = prediction_by_xyz(source_features, source_labels, target_features)
    target_df["bug_prediction"] = target_labels

    # Convert to JSON format
    result_json = {
        "method_name": "xyz",
        "data_header": target_df.columns.tolist(),
        "data": target_df.to_dict(orient="records")
    }
    shutil.rmtree(temp_folder_name)
    return result_json


@router.post("/check-accuracy")
async def check_accuracy(
    files: tuple[pd.DataFrame, pd.DataFrame] = Depends(validate_attributes_files)
):
    source_df, target_df = files
    
    source_features = source_df.drop(columns=["bug", "file_name"], errors="ignore").to_numpy()
    source_labels = source_df.get("bug", pd.Series(dtype=float)).to_numpy()

    target_features = target_df.drop(columns=["bug", "file_name"], errors="ignore").to_numpy()
    target_labels = target_df.get("bug", pd.Series(dtype=float)).to_numpy()
    
    merged_df = target_df
    
    if source_features.size == 0 or source_labels.size == 0 or target_features.size == 0 or target_labels.size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Source feature, source label, or target feature, target label is empty or missing."
        )

    # Predict labels for target features
    target_predicted_labels = prediction_by_xyz(source_features, source_labels, target_features)
    merged_df["bug_prediction"] = target_predicted_labels
    accuracy = accuracy_score(target_labels, target_predicted_labels)

    # Convert to JSON format
    result_json = {
        "method_name": "xyz",
        "accuracy": accuracy,
        "data_header": merged_df.columns.tolist(),
        "data": merged_df.to_dict(orient="records")
    }

    return result_json


@router.post("/from-attributes")
async def attributes_file(
    files: tuple[pd.DataFrame, pd.DataFrame] = Depends(validate_attributes_files)
):
    source_df, target_df = files
    
    # Drop the "bug" column and "file_name" column if they exist
    source_features = source_df.drop(columns=["bug", "file_name"], errors="ignore").to_numpy()
    source_labels = source_df.get("bug", pd.Series(dtype=float)).to_numpy()
    
    # Prepare other data structures for further processing
    target_features = target_df.drop(columns=["bug", "file_name"], errors="ignore").to_numpy()
    merged_df = target_df.drop(columns=["bug"], errors="ignore")
    
    if source_features.size == 0 or source_labels.size == 0 or target_features.size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Source feature, source label, or target feature is empty or missing."
        )

    # Predict labels for target features
    target_labels = prediction_by_xyz(source_features, source_labels, target_features)
    merged_df["bug_prediction"] = target_labels

    # Convert to JSON format
    result_json = {
        "method_name": "xyz",
        "data_header": merged_df.columns.tolist(),
        "data": merged_df.to_dict(orient="records")
    }

    return result_json

