import os
import re
import csv

def loc(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()
    return len(lines)


def count_public_methods(file_path):
    with open(file_path, 'r') as file:
        java_code = file.read()

    # Regular expression to match method signatures
    method_pattern = re.compile(r'public\s+(?!class)(\w*)\s*(\w+(\s*\[*\]*))\s+(\w+)\s*\(')

    # Find all occurrences of public methods
    public_methods = re.findall(method_pattern, java_code)
    return len(public_methods)