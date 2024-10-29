import numpy as np
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from scipy.linalg import sqrtm
from fastapi.responses import JSONResponse
import zipfile
import mimetypes
import io
import os
import shutil


app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def CORAL(source_file, target_file):
    # Convert dataframes to numpy arrays
    X_s = source_file.drop(columns=['name', 'bug']).values
    X_t = target_file.drop(columns=['name', 'bug']).values

    # Compute covariance matrices
    C_s = np.cov(X_s, rowvar=False)
    C_t = np.cov(X_t, rowvar=False)

    # Compute the transformation matrix using CORAL
    A = sqrtm(C_t) @ np.linalg.inv(sqrtm(C_s))

    # Transform the source domain features
    X_s_aligned = X_s @ A
    return X_s_aligned



@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/predict/")
async def predict(source_file: UploadFile = File(...), target_file: UploadFile = File(...)):
    source_df = pd.read_csv(source_file.file)
    target_df = pd.read_csv(target_file.file)

    aligned_source = CORAL(source_df, target_df)
    
    # Train a KNN model
    knn = KNeighborsClassifier(n_neighbors=1)
    knn.fit(aligned_source, source_df["bug"])
    
    
    X_target = target_df.drop(columns=["name", "bug"])
    print(aligned_source.shape)
    print(source_df["bug"].shape)
    print(X_target.shape)
    
    # Predict the presence of bugs
    predictions = knn.predict(X_target)
    
    # Add predictions to the target DataFrame
    target_df["bug"] = predictions
    
    # Convert the result to a dictionary
    result = target_df[["name", "bug"]].to_dict(orient="records")
    return result



@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    
    if file.content_type not in ['application/zip', 'application/x-zip-compressed']:
        return JSONResponse(status_code=400, content={"message": "File must be a zip."})

    zip_data = await file.read()
    temp_folder_name = 'extractedZips'

    with zipfile.ZipFile(io.BytesIO(zip_data)) as z:
        z.extractall(temp_folder_name) 
        

    from folderExplorer import get_directoris_attributes_data
    result = get_directoris_attributes_data(temp_folder_name)
    print(result)
     
    unzipped_folder_name = os.path.join(temp_folder_name, os.listdir(temp_folder_name)[0])
    shutil.rmtree(unzipped_folder_name)
    
    return result