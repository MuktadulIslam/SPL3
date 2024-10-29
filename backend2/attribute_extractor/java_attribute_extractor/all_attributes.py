import javalang
import re
import math

from .halstead import HalsteadMetrics
from .loc import LOCMetrics


def getJavaAttributsName():
    return [
        {'name': 'File Name', 'variable_name': 'file_name'},
        {'name': 'Unique Operators', 'variable_name': 'unique_operators'},
        {'name': 'Unique Operands', 'variable_name': 'unique_operands'},
        {'name': 'Total Operators', 'variable_name': 'total_operators'},
        {'name': 'Total Operands', 'variable_name': 'total_operands'},
        {'name': 'Program Volume', 'variable_name': 'program_volume'},
        {'name': 'Program Length', 'variable_name': 'program_length'},
        {'name': 'Program Vocabulary', 'variable_name': 'program_vocabulary'},
        {'name': 'Program Difficulty', 'variable_name': 'program_difficulty'},
        {'name': 'Level Estimator', 'variable_name': 'level_estimator'},
        {'name': 'Programming Effort', 'variable_name': 'programming_effort'},
        {'name': 'Intelligent Content', 'variable_name': 'intelligent_content'},
        {'name': 'Delivered Bug', 'variable_name': 'delivered_bug'},
        {'name': 'Programming Time', 'variable_name': 'programming_time'},
        {'name': 'Number of Lines', 'variable_name': 'number_of_lines'},
        {'name': 'LOC Executable', 'variable_name': 'loc_executable'},
        {'name': 'LOC Comments', 'variable_name': 'loc_comments'},
        {'name': 'LOC Code with Comments', 'variable_name': 'loc_code_with_comments'},
        {'name': 'LOC Blank', 'variable_name': 'loc_blank'},
        {'name': 'LOC Total', 'variable_name': 'loc_total'}
    ]

def getAttributes(java_code, java_file_path):
    ast = None
    allAttributes = {
        # HalsteadMetrics
        "file_name": java_file_path,
        "unique_operators": -1,
        "unique_operands": -1,
        "total_operators": -1,
        "total_operands": -1,
        "program_volume": -1,
        "program_length": -1,
        "program_vocabulary": -1,
        "program_difficulty": -1,
        "level_estimator": -1,
        "programming_effort": -1,
        "intelligent_content": -1,
        "delivered_bug": -1,
        "programming_time": -1,

        # LOCMetrics
        "number_of_lines": -1,
        "loc_executable": -1, 
        "loc_comments": -1,
        "loc_code_with_comments": -1,
        "loc_blank": -1,
        "loc_total": -1
    }

    try:
        ast = javalang.parse.parse(java_code)
        halsteadMetrics = HalsteadMetrics(java_code, ast)
        locMetrics = LOCMetrics(java_code)

        allAttributes["unique_operators"] = halsteadMetrics.get_unique_operators()
        allAttributes["unique_operands"] = halsteadMetrics.get_unique_operands()
        allAttributes["total_operators"] = halsteadMetrics.get_total_operators()
        allAttributes["total_operands"] = halsteadMetrics.get_total_operands()
        allAttributes["program_volume"] = halsteadMetrics.get_program_volume()
        allAttributes["program_length"] = halsteadMetrics.get_program_length()
        allAttributes["program_vocabulary"] = halsteadMetrics.get_program_vocabulary()
        allAttributes["program_difficulty"] = halsteadMetrics.get_program_difficulty()
        allAttributes["level_estimator"] = halsteadMetrics.get_level_estimator()
        allAttributes["programming_effort"] = halsteadMetrics.get_programming_effort()
        allAttributes["intelligent_content"] = halsteadMetrics.get_intelligent_content()
        allAttributes["delivered_bug"] = halsteadMetrics.get_delivered_bug()
        allAttributes["programming_time"] = halsteadMetrics.get_programming_time()
        
        allAttributes["number_of_lines"] = locMetrics.get_number_of_lines()
        allAttributes["loc_executable"] = locMetrics.get_loc_executable()
        allAttributes["loc_comments"] = locMetrics.get_loc_comments()
        allAttributes["loc_code_with_comments"] = locMetrics.get_loc_code_with_comments()
        allAttributes["loc_blank"] = locMetrics.get_loc_blank()
        allAttributes["loc_total"] = locMetrics.get_loc_total()        

    except javalang.parser.JavaSyntaxError as e:
        # Handle Java syntax errors
        print("The Java code has compiletime error!!!!")

    return allAttributes
