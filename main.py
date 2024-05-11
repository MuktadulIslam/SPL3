import os
import re

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


# Function to calculate Depth of Inheritance Tree (DIT)
# def calculate_dit(java_file_path):
#     with open(java_file_path, 'r') as file:
#         java_code = file.read()

#     # Regular expression to match class definitions
#     class_pattern = re.compile(r'class\s+(\w+)\s*(?:extends\s+(\w+))?\s*\{')

#     # Find all occurrences of class definitions
#     classes = re.findall(class_pattern, java_code)

#     # Dictionary to store inheritance tree depth for each class
#     dit_map = {}

#     for class_name, parent_class in classes:
#         if parent_class:
#             if parent_class not in dit_map:
#                 dit_map[parent_class] = 0
#             dit_map[class_name] = dit_map[parent_class] + 1
#         else:
#             dit_map[class_name] = 0

#     return dit_map

# Main function
def main():
    main_folder_path = "./data/source_code_apache_ant_170/src/main"
    java_files = list_java_files_recursive(main_folder_path)
    
    for java_file in java_files:
        print("Java file:", java_file)
        public_methods = count_public_methods(java_file)
        loc, line_of_comments = identify_loc_without_comm(java_file)
        
        print("Public methods:", public_methods)
        print("Line of Code:", loc)
        print("Line of Comments:", line_of_comments)
        print("Line of Code (without comment):", loc - line_of_comments)
        # print("Depth of Inheritance Tree (DIT):")
        # for class_name, dit in dit_map.items():
        #     print(f"- {class_name}: {dit}")

if __name__ == "__main__":
    main()
