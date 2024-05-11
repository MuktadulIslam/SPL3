import os
import re
import csv

def identify_loc_without_comm(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()

    comment_pattern = r'//|/\*|\*'  # Regular expression pattern for Java comments

    comment_lines = [line.strip() for line in lines if re.match(comment_pattern, line.strip())]
    
    return [len(lines), len(comment_lines)]

def count_public_methods(java_file_path):
    with open(java_file_path, 'r') as file:
        java_code = file.read()

    # Regular expression to match method signatures
    method_pattern = re.compile(r'public\s+(?!class)(\w*)\s*(\w+(\s*\[*\]*))\s+(\w+)\s*\(')

    # Find all occurrences of public methods
    public_methods = re.findall(method_pattern, java_code)
    return len(public_methods)

def list_java_files_recursive(directory):
    java_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".java"):
                java_files.append(os.path.join(root, file))
    return java_files


def read_csv_data():
    # Replace 'input_file.csv' with the path to your input CSV file
    input_file_path = './data/result.csv'
    file_data = {}

    # Open the input CSV file using 'with' statement to automatically close it when done
    with open(input_file_path, newline='') as csvfile:
        # Create a CSV reader object
        csv_reader = csv.DictReader(csvfile)
    
        # Iterate over each row in the input CSV file
        for row in csv_reader:
            # Extract the last name from the "name" column
            name_parts = row["name"].split('.')
            last_name = name_parts[-1]
            file_data[last_name] = [row["name"], row["loc"], row["npm"]]
                # "file_path": row["name"],
                # "class_name": last_name,
                # "file_loc": row["loc"],
                # "file_npm": row["npm"]
                # last_name: [row["name"], last_name, row["loc"], row["npm"]]
            
            
    
    # for key, value in file_data.items():
    #     print(key, value)
    return file_data

# Main function
def main():
    main_folder_path = "./data/source_code_apache_ant_170/src/main"
    java_files = list_java_files_recursive(main_folder_path)
    csv_data = read_csv_data()
    
    all_extract_data = {}
    for java_file in java_files:
        class_name = os.path.splitext(os.path.basename(java_file))[0]
        # print("Java file:", class_name)
        public_methods = count_public_methods(java_file)
        loc, line_of_comments = identify_loc_without_comm(java_file)
        
        # print("Public methods:", public_methods)
        # print("Line of Code:", loc)
        # print("Line of Comments:", line_of_comments)
        # print("Line of Code (without comment):", loc - line_of_comments)

        all_extract_data[class_name] =  [loc, line_of_comments, public_methods]



    final_comparison_data = []
    for key, value in csv_data.items():
        for key2, value2  in all_extract_data.items():
            if key == key2:
                # print({"file_path": value[0], "class_name": key, "file_npm": value[2], "extract_npm": value2[2], "file_loc": value[1], "extract_loc": value2[0]-value2[1], "extract_loc_with_c": value2[0], "lo_comment": value2[1]})
                final_comparison_data.append({"file_path": value[0], "class_name": key, "file_npm": value[2], "extract_npm": value2[2], "file_loc": value[1], "extract_loc": value2[0]-value2[1], "extract_loc_with_c": value2[0], "lo_comment": value2[1]})
                break
    

    # Writing data in csv
    # Specify the CSV file path
    output_file_path = './data/output.csv'

   # Open the output CSV file in write mode
    with open(output_file_path, mode='w', newline='') as outfile:
        # Define the fieldnames for the output CSV file
        fieldnames = ["file_path", "class_name", "file_npm", "extract_npm", "file_loc", "extract_loc", "extract_loc_with_c", "lo_comment"]
        
        # Create a CSV writer object
        csv_writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        
        # Write headers to the output CSV file
        csv_writer.writeheader()
        
        # Iterate over each row in the input CSV file
        for value in final_comparison_data:
            # Write the row to the output CSV file
            # csv_writer.writerow({"file_path": value[0], "class_name": value[1], "file_npm": value[2], "extract_npm": value[3], "file_loc": value[4], "extract_loc": value[5], "extract_loc_with_c": value[6], "lo_comment": value[7]})
            csv_writer.writerow(value)


if __name__ == "__main__":
    main()
    # read_csv_data()
