import os
import re

def calculate_efferent_coupling(java_code):
    class_dependencies = {}
    
    # Regular expression patterns to match import statements and class declarations
    import_pattern = re.compile(r'^\s*import\s+([\w.]+)\s*;')
    class_pattern = re.compile(r'^\s*class\s+(\w+)\s*{')
    
    # Find all import statements and extract imported packages
    imports = import_pattern.findall(java_code)
    
    # Find all class declarations and initialize their dependencies count to 0
    class_declarations = class_pattern.findall(java_code)
    for class_name in class_declarations:
        class_dependencies[class_name] = 0
    
    # Iterate over class declarations and count dependencies from imported packages
    for class_name in class_dependencies:
        for package in imports:
            if class_name in package:
                class_dependencies[class_name] += 1
    
    return class_dependencies

# Example Java code
# java_code = """
# package com.example.package1;

# import com.example.package2.ClassB;

# public class ClassA {
#     private ClassB b;
# }
# """

def calculate_coupling(java_file_path):
    with open(java_file_path, 'r') as file:
        java_code = file.read()
    efferent_coupling = calculate_efferent_coupling(java_code)
    print("Efferent Coupling:")
    for class_name, dependencies in efferent_coupling.items():
        print(f"{class_name}: {dependencies}")




def list_java_files_recursive(directory):
    java_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".java"):
                java_files.append(os.path.join(root, file))
    return java_files


# Main function
def main():
    main_folder_path = "./data/source_code_apache_ant_170/src/main"
    java_files = list_java_files_recursive(main_folder_path)
    
    for java_file_path in java_files:
        print("Java file:", java_file_path)
        # calculate_coupling(java_file_path)
        

if __name__ == "__main__":
    main()