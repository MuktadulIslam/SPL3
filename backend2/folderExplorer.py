import os
from attribute_extractor import getDefectAttributes
from attribute_extractor.java_attribute_extractor.all_attributes import getJavaAttributsName

# Function to list Java files recursively
def list_files_recursive(directory):
    java_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith((".cpp", '.cc', '.c', '.java', '.py', '.cs', '.js', '.ts', '.jsx', '.tsx' , '.rb', '.php', '.kt', '.kts')):
                java_files.append(os.path.join(root, file))
    return java_files


def get_directoris_attributes_data(directory_path):
    files_path = list_files_recursive(directory_path)
    attributes_data = []
    for file_path in files_path:
        attributes_data.append(getDefectAttributes(file_path))

    return {'dataHeader': getJavaAttributsName(),'data':attributes_data}
