import os

def list_java_files_recursive(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".java"):
                print(os.path.join(root, file))

main_folder_path = "./data"
list_java_files_recursive(main_folder_path)
