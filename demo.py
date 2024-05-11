import os
import re

# Function to list Java files recursively
def list_java_files_recursive(directory):
    java_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".java"):
                java_files.append(os.path.join(root, file))
    return java_files

# All  and their parent name
class_hierarchy = {}

def extract_class_hierarchy(java_file_path):
    with open(java_file_path, 'r') as file:
        java_code = file.read()

    # Regular expression to match class definitions
    class_pattern = re.compile(r'class\s+(\w+)\s*(?:extends\s+(\w+))')

    # Find all occurrences of class definitions
    classes = re.findall(class_pattern, java_code)


    child_class = os.path.splitext(os.path.basename(java_file_path))[0]
    parent_class = ""
    for class_name, parent_class_name in classes:
        if child_class == class_name:
            parent_class = parent_class_name
    
    if parent_class != "":
        class_hierarchy[child_class] = parent_class
    else:
        class_hierarchy[child_class] = 1


# Main function
def main():
    main_folder_path = "./data/source_code_apache_ant_170/src/main"
    java_files = list_java_files_recursive(main_folder_path)
    
    for java_file in java_files:
        extract_class_hierarchy(java_file)
        
    class_queue = []
    for child_class, parent_class in class_hierarchy.items():
        if parent_class == 1:
            class_queue.append(child_class)

    for class_name in class_queue:
        vlaue = class_hierarchy[class_name]
        for child_class, parent_class in class_hierarchy.items():
            if class_name == parent_class:
                class_hierarchy[child_class] = vlaue+1
                class_queue.append(child_class)

    # print("Parent-Child Class Relationships:")
    for child_class, parent_class in class_hierarchy.items():
        print(child_class, "  ", parent_class)

if __name__ == "__main__":
    main()
