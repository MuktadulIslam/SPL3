from fastapi import APIRouter
from fastapi import File, UploadFile, HTTPException, Depends, status, Form
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score
import zipfile
import io
import os
import shutil
import uuid

from ..services.models.xyz import prediction_by_xyz
from ..services.models.easyTL import EasyTL
from ..middleware.attribute_file_check import validate_source_code_files, validate_source_attributes_file, filter_training_and_testing_df, validate_target_attributes_file
from ..services.attribute_extractor import getDefectAttributes
from ..database.mongobd import MongoDBHandler

router = APIRouter()


def makePrediction(target_df, source_df, user_id, submitted_at, project_name, project_type, project_hash):
    mongoDBHandler = MongoDBHandler()

    # Check if predictions already exist
    existing_prediction = mongoDBHandler.get_prediction_data(project_hash=project_hash)

    if existing_prediction:
        print("Returning existing prediction data.")
        return {
            "method_name": "EasyTL",
            "data_header": list(existing_prediction.get("prediction_data", [])[0].keys()),
            "data": existing_prediction.get("prediction_data")
        }
    

    print("No existing prediction found. Proceeding with new prediction.")
    # Keeping only the matching attributes
    temp_target_df = target_df.drop(columns=["bug"], errors="ignore")
    source_df, target_df = filter_training_and_testing_df(source_df, target_df)

    # Drop unnecessary columns
    source_features = source_df.drop(columns=["bug", "file_name"], errors="ignore").to_numpy()
    source_labels = source_df.get("bug", pd.Series(dtype=float)).to_numpy()
    target_features = target_df.drop(columns=['bug', 'file_name'], errors='ignore').to_numpy()

    if source_features.size == 0 or source_labels.size == 0 or target_features.size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Source feature, source label, or target feature, target label is empty or missing."
        )

    # Predict labels for target features
    easytl = EasyTL()
    target_labels = easytl.fit_predict(source_features, source_labels, target_features)

    # Store project details
    mongoDBHandler.store_project(
        user_id=user_id,
        submitted_at=submitted_at,
        project_hash=project_hash,
        project_name=project_name,
        project_type=project_type
    )

    # Store project metrics if applicable
    if project_type in ["predictionBySourceCode", "predictionBySourceCodeWithTrainingFile"]:
        mongoDBHandler.store_metrics_data(
            project_hash=project_hash,
            metrics=temp_target_df.to_dict(orient="records"),
            system_version="1.2.1"
        )

    # Store new prediction data
    temp_target_df["bug_prediction"] = target_labels
    mongoDBHandler.store_prediction_data(
        model_id="MDL001",
        project_hash=project_hash,
        prediction_data=temp_target_df.to_dict(orient="records")
    )

    # Convert to JSON format
    result_json = {
        "method_name": "EasyTL",
        "data_header": temp_target_df.columns.tolist(),
        "data": temp_target_df.to_dict(orient="records")
    }
    return result_json


@router.get("/")
async def root():
    return {"message": "Welcome"}


@router.post("/from-source-code")
async def source_code_file(
    target_file = Depends(validate_source_code_files),
    user_id: str = Form(...),
    submitted_at: str = Form(...),
    project_name: str = Form(...),
    project_type: str = Form(...),
    project_hash: str = Form(...),
):
    # Read source data from local storage
    try:
        source_df = pd.read_csv("app/routes/source_file.csv")  # Replace with your actual file path
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read source data from local storage: {str(e)}"
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

    result_json = makePrediction(target_df, source_df, user_id, submitted_at, project_name, project_type, project_hash)
    shutil.rmtree(temp_folder_name)
    return result_json


@router.post("/from-source-code-with-training-data")
async def source_code_file(
    target_file = Depends(validate_source_code_files),
    source_df = Depends(validate_source_attributes_file),
    user_id: str = Form(...),
    submitted_at: str = Form(...),
    project_name: str = Form(...),
    project_type: str = Form(...),
    project_hash: str = Form(...),
):  
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

    result_json = makePrediction(target_df, source_df, user_id, submitted_at, project_name, project_type, project_hash)
    shutil.rmtree(temp_folder_name)
    return result_json


@router.post("/from-attributes")
async def attributes_file(
    target_df = Depends(validate_target_attributes_file),
    user_id: str = Form(...),
    submitted_at: str = Form(...),
    project_name: str = Form(...),
    project_type: str = Form(...),
    project_hash: str = Form(...),
):
    # Read source data from local storage
    try:
        source_df = pd.read_csv("app/routes/source_file.csv")  # Replace with your actual file path
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read source data from local storage: {str(e)}"
        )
    
    return makePrediction(target_df, source_df, user_id, submitted_at, project_name, project_type, project_hash)


@router.post("/from-attributes-with-training-data")
async def attributes_file(
    target_df = Depends(validate_target_attributes_file),
    source_df = Depends(validate_source_attributes_file),
    user_id: str = Form(...),
    submitted_at: str = Form(...),
    project_name: str = Form(...),
    project_type: str = Form(...),
    project_hash: str = Form(...),
):  
    return makePrediction(target_df, source_df, user_id, submitted_at, project_name, project_type, project_hash)



@router.post("/check-accuracy")
async def check_accuracy(
    target_df = Depends(validate_target_attributes_file),
    source_df = Depends(validate_source_attributes_file),
    user_id: str = Form(...),
    submitted_at: str = Form(...),
    project_name: str = Form(...),
    project_type: str = Form(...),
    project_hash: str = Form(...),
):
    # Keeping Only the matching attributes
    temp_target_df = target_df
    source_df, target_df = filter_training_and_testing_df(source_df, target_df);    

    # Drop the "bug" column and "file_name" column if they exist
    source_features = source_df.drop(columns=["bug", "file_name"], errors="ignore").to_numpy()
    source_labels = source_df.get("bug", pd.Series(dtype=float)).to_numpy()
    target_features = target_df.drop(columns=['file_name'], errors='ignore').to_numpy()
    
    # Predict labels for target features
    target_labels = prediction_by_xyz(source_features, source_labels, target_features)
    temp_target_df["bug_prediction"] = target_labels




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
    # target_predicted_labels = prediction_by_xyz(source_features, source_labels, target_features)
    easytl = EasyTL()
    target_predicted_labels = easytl.fit_predict(source_features, source_labels, target_features)
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


@router.post("/get-projects")
async def check_accuracy(
    project_hash: str = Form(...),
):
    mongoDBHandler = MongoDBHandler()

    # Check if predictions already exist
    existing_prediction = mongoDBHandler.get_prediction_data(project_hash=project_hash)
    existing_project = mongoDBHandler.get_project(project_hash=project_hash)

    if existing_prediction and existing_project:
        return {
            "method_name": "EasyTL",
            "submitted_at": existing_project.get('submitted_at') if existing_project else None,
            "project_name": existing_project.get('project_name') if existing_project else None,
            "project_type": existing_project.get('project_type') if existing_project else None,
            "data_header": list(existing_prediction.get("prediction_data", [])[0].keys()) if existing_prediction.get("prediction_data") else [],
            "data": existing_prediction.get("prediction_data") if existing_prediction else []
        }

    return {"error": "Prediction or project not found"}



