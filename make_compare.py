# import csv

# # Replace 'your_file.csv' with the path to your CSV file
# file_path = './data/result.csv'

# # Open the CSV file using 'with' statement to automatically close it when done
# with open(file_path, newline='') as csvfile:
#     # Create a CSV reader object
#     csv_reader = csv.DictReader(csvfile)
    
#     # Print headers
#     print("name", "classname", "loc", "npm")
    
#     # Iterate over each row in the CSV file
#     for row in csv_reader:
#         # Extract the last name from the "name" column
#         name_parts = row["name"].split('.')
#         last_name = name_parts[-1]
        
#         # Print the four columns
#         print([row["name"], last_name, row["loc"], row["npm"]])



import csv

# Replace 'input_file.csv' with the path to your input CSV file
input_file_path = './data/result.csv'

# Replace 'output_file.csv' with the path to your output CSV file
output_file_path = './data/output.csv'

# Open the input CSV file using 'with' statement to automatically close it when done
with open(input_file_path, newline='') as csvfile:
    # Create a CSV reader object
    csv_reader = csv.DictReader(csvfile)
    
    # Open the output CSV file in write mode
    with open(output_file_path, mode='w', newline='') as outfile:
        # Define the fieldnames for the output CSV file
        fieldnames = ["name", "classname", "loc", "npm"]
        
        # Create a CSV writer object
        csv_writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        
        # Write headers to the output CSV file
        csv_writer.writeheader()
        
        # Iterate over each row in the input CSV file
        for row in csv_reader:
            # Extract the last name from the "name" column
            name_parts = row["name"].split('.')
            last_name = name_parts[-1]
            
            # Write the row to the output CSV file
            csv_writer.writerow({"name": row["name"], "classname": last_name, "loc": row["loc"], "npm": row["npm"]})
