import itertools
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
import numpy as np
from scipy.linalg import sqrtm

FILES = ['EQ.xlsx', 'JDT.xlsx']

def CORAL(source_data, target_data, feature_number):
    X_s = source_data.values
    X_t = target_data.values

    try:
        # Compute covariance matrices
        C_s = np.cov(X_s, rowvar=False)
        C_t = np.cov(X_t, rowvar=False)

        # Compute the transformation matrix using CORAL
        A = sqrtm(C_t) @ np.linalg.inv(sqrtm(C_s))

        # Transform the source domain features
        X_s_aligned = X_s @ A
        return X_s_aligned[:, :feature_number]
    except np.linalg.LinAlgError as e:
        return X_s[:, :feature_number]
    

def load_data(source_file, target_file):
    source_df = pd.read_excel(source_file)
    target_df = pd.read_excel(target_file)
    return source_df, target_df


# Function to save results to CSV
def save_results_to_csv(results, csv_filename):
    results_df = pd.DataFrame(results, columns=['Source File', 'Target File', 'Feature Number', 'Accuracy'])
    results_df['Accuracy'] = results_df['Accuracy'].apply(lambda x: f'{x:.4f}')  # Format accuracy to 4 decimal places as string
    results_df.to_csv(csv_filename, index=False)

# Values of FEATURE_NUMBER to iterate over
feature_numbers = [2]
results = []

for source_file, target_file in itertools.permutations(FILES, 2):
    # Load data
    source_df, target_df = load_data(source_file, target_file)
    
    for FEATURE_NUMBER in feature_numbers:
        # Apply CORAL alignment
        aligned_source = CORAL(source_df, target_df, FEATURE_NUMBER)
        print(aligned_source.shape , source_df["class"].shape)
        
        # Train a KNN model
        knn = KNeighborsClassifier(n_neighbors=1)
        knn.fit(aligned_source, source_df["class"])
        
        # Prepare target data
        X_target = target_df.iloc[:, :FEATURE_NUMBER].values
        
        # Predict using the trained model
        predictions = knn.predict(X_target)
        
        # Evaluate accuracy
        actual_values = target_df["class"].values
        accuracy = accuracy_score(actual_values, predictions)
        
        # Store results
        results.append((source_file, target_file, FEATURE_NUMBER, accuracy))
        
        # Print results (optional)
        print(f'Source File: "{source_file}"  Target File: "{target_file}"  Feature Number: {FEATURE_NUMBER}  Accuracy: {accuracy:.4f}')

# Save results to CSV file
save_results_to_csv(results, 'coral_results.csv')
