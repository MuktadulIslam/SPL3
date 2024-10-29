
def getDefectAttributes(file_path):
    actualPath = file_path.replace("extractedZips", "").replace("\\", "/").lstrip("/")
    print(file_path)
    try:
        if file_path.endswith('.java'):
            with open(file_path, 'r') as file:
                java_code = file.read()
                from .java_attribute_extractor.all_attributes import getAttributes as getJavaDefectAttributes
                return getJavaDefectAttributes(java_code, actualPath)
    finally:
        pass
    
    return {}
    
