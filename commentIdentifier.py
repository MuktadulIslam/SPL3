import os
import re

def identify_comments(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()
    
    print("lines=",len(lines))

    comment_pattern = r'//|/\*|\*'  # Regular expression pattern for Java comments

    comment_lines = [line.strip() for line in lines if re.match(comment_pattern, line.strip())]
    
    return comment_lines

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


# Main function to list Java files and identify comments
def main():
    main_folder_path = "./data/source_code_apache_ant_170/src/main"
    # main_folder_path = "./data/source_code_apache_ant_170/src/main/org/apache/tools/ant/input"
    java_files = list_java_files_recursive(main_folder_path)
    for java_file in java_files:
        print("Java file:", java_file)
        comments = identify_comments(java_file)
        public_methods = count_public_methods(java_file)
        print("Public methods: ", public_methods)
        if comments:
            print("Comments: ", len(comments))
        #     for comment in comments:
        #         print(comment)

if __name__ == "__main__":
    main()
