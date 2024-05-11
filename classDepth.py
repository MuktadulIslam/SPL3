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


def extract_child_parent_pair(java_file_path):
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
            break
    
    if parent_class != "":
        class_hierarchy[child_class] = parent_class
    else:
        class_hierarchy[child_class] = 1


def get_depth(class_name):
    if isinstance(class_hierarchy[class_name], int):
        return class_hierarchy[class_name]
    elif class_hierarchy[class_name] not in class_hierarchy:
        return 1
    else:
        return get_depth(class_hierarchy[class_name]) + 1
    

# Function to calculate Depth of Inheritance Tree (DIT)
def calculate_depth():
    primary_classes = []
    class_depth = {}
    keys_to_remove = []

    for child, parent in class_hierarchy.items():
        if parent == 1:
            # print(child, parent)
            class_depth[child] = 1
        else:
            # print(child, get_depth(child))
            # class_depth(child) = 1
            class_hierarchy[child] = get_depth(child)
    
    for child, parent in class_hierarchy.items():
        print(child, parent)
    


# Main function
def main():
    main_folder_path = "./data/source_code_apache_ant_170/src/main"
    java_files = list_java_files_recursive(main_folder_path)
    
    for java_file in java_files:
        # print("Java file:", java_file)
        extract_child_parent_pair(java_file)
    
    calculate_depth()
    
    # Print parent-child class relationships
    # print("Parent-Child Class Relationships:")
    # for child_class, parent_class in class_hierarchy.items():
    #     print(child_class, "  ", parent_class)

if __name__ == "__main__":
    main()
