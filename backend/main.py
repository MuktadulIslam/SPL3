from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
import io

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    # print("Hello World")
    return {"message": "Hello World"}

# @app.post("/predict/")
# async def predict(source_file: UploadFile = File(...), target_file: UploadFile = File(...)):
#     # Read the uploaded files
#     source_data = pd.read_csv(io.StringIO(source_file.file.read().decode('utf-8')))
#     target_data = pd.read_csv(io.StringIO(target_file.file.read().decode('utf-8')))
#
#     # Ensure the source file has the 'bug' column
#     if 'bug' not in source_data.columns:
#         return JSONResponse(status_code=400, content={"error": "Source file must contain 'bug' column."})
#
#     # Extract features and target from source data
#     X_train = source_data.drop(columns=['name', 'bug'])
#     y_train = source_data['bug']
#
#     # Extract features from target data
#     X_test = target_data.drop(columns=['name'])
#
#     # Train the KNN model
#     knn = KNeighborsClassifier(n_neighbors=3)
#     knn.fit(X_train, y_train)
#
#     # Make predictions
#     predictions = knn.predict(X_test)
#
#     # Attach predictions to the target data
#     target_data['bug_prediction'] = predictions
#
#     # Convert result to JSON
#     result = target_data[['name', 'bug_prediction']].to_dict(orient='records')
#
#     return JSONResponse(status_code=200, content=result)


