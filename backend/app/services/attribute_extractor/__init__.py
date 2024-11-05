import os

from .java_attribute_extractor.all_attributes import getAttributes as getJavaDefectAttributes

def get_acceptable_file_path(directory):
    java_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith((".cpp", '.cc', '.c', '.java', '.py', '.cs', '.js', '.ts', '.jsx', '.tsx' , '.rb', '.php', '.kt', '.kts')):
                java_files.append(os.path.join(root, file))
    return java_files


def getDefectAttributes(directory_path):
    files_path = get_acceptable_file_path(directory_path)
    attributes_data = []
    for file_path in files_path:
        try:
            relative_path = os.path.relpath(file_path, directory_path)
            if file_path.endswith('.java'):
                with open(file_path, 'r') as file:
                    java_code = file.read()
                
                attributes_data.append(getJavaDefectAttributes(java_code, relative_path))
        finally:
            pass
    return attributes_data
    
    
