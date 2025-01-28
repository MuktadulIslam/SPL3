import javalang
import re
import math

from .halstead import HalsteadMetrics
from .loc import LOCMetrics

def getProvidedAttributesForJava():
    return [
        { 'short_names': ['name', 'files', 'file', 'file_name', 'files_name'], 'id_name': 'file_name', 'display_name': 'File Name' },

        { 'short_names': ['uniq_Op', 'total_operators'], 'id_name': 'unique_operators', 'display_name': 'Halstead Unique Operators' },
        { 'short_names': ['uniq_Opnd', 'unique_operands'], 'id_name': 'unique_operands', 'display_name': 'Halstead Unique Operands' },
        { 'short_names': ['total_Op', 'total_operators', 'num_operators'], 'id_name': 'total_operators', 'display_name': 'Halstead Total Operators' },
        { 'short_names': ['total_Opnd', 'total_operands', 'num_operands'], 'id_name': 'total_operands', 'display_name': 'Halstead Total Operands' },
        { 'short_names': ['v','volume', 'halstead_volume', 'halstead_program_volume', 'program_volume'], 'id_name': 'halstead_volume', 'display_name': 'Halstead Program Volume' },
        { 'short_names': ['length', 'program_length', 'halstead_program_length', 'halstead_length'], 'id_name': 'halstead_length', 'display_name': 'Halstead Program Length' },
        { 'short_names': ['n', 'program_vocabulary', 'halstead_program_vocabulary', 'halstead_vocabulary'], 'id_name': 'halstead_vocabulary', 'display_name': 'Halstead Program Vocabulary' },
        { 'short_names': ['d', 'program_difficulty', 'halstead_program_difficulty', 'halstead_difficulty'], 'id_name': 'halstead_difficulty', 'display_name': 'Halstead Program Difficulty' },
        { 'short_names': ['l', 'program_level_estimator', 'halstead_level_estimator', 'level_estimator', 'halstead_level', 'halstead_program_level'], 'id_name': 'halstead_level', 'display_name': 'Halstead Level' },        
        { 'short_names': ['e', 'halstead_effort', 'program_effort', 'halstead_programming_effort', 'halstead_program_effort'], 'id_name': 'halstead_effort', 'display_name': 'Halstead Programming Effort' },
        { 'short_names': ['intelligent_content', 'halstead_intelligent_content'], 'id_name': 'halstead_intelligent_content', 'display_name': 'Halstead Intelligent Content' },        
        { 'short_names': ['delivered_bug', 'halstead_delivered_bug'], 'id_name': 'halstead_delivered_bug', 'display_name': 'Halstead Delivered Bug' },
        { 'short_names': ['halstead_prog_time', 'halstead_time', 'programming_time'], 'id_name': 'halstead_time', 'display_name': 'Halstead Programming Time' },
        
        { 'short_names': ['line_of_code', 'loc', 'num_line', 'number_of_line'], 'id_name': 'number_of_lines', 'display_name': 'Number of Line' },
        { 'short_names': ['loc_executable', 'executable_loc'], 'id_name': 'loc_executable', 'display_name': 'Total Line of executable Code' },
        { 'short_names': ['loc_comment', 'loc_comments', 'comment_loc', 'comments_loc'], 'id_name': 'loc_comments', 'display_name': 'Total Line of Comment' },
        { 'short_names': ['loc_code_and_comments', 'loc_code_and_comment', 'loc_code_with_comment', 'loc_code_with_comments'], 'id_name': 'loc_code_and_comments', 'display_name': 'Total Line of Code with Comment' },
        { 'short_names': ['loc_blank', 'loc_blanks', 'blank_loc', 'blanks_loc'], 'id_name': 'loc_blank', 'display_name': 'Total Blank Line' },
        { 'short_names': ['total_loc', 'loc_total'], 'id_name': 'loc_total', 'display_name': 'Total Line of Code' },
    ]


def getAttributes(java_code, relative_file_path):
    ast = None
    allAttributes = {
        # HalsteadMetrics
        "file_name": relative_file_path.replace("\\", "/"),
        "unique_operators": -1,
        "unique_operands": -1,
        "total_operators": -1,
        "total_operands": -1,
        "halstead_volume": -1,
        "halstead_length": -1,
        "halstead_vocabulary": -1,
        "halstead_difficulty": -1,
        "halstead_level": -1,
        "halstead_effort": -1,
        "halstead_intelligent_content": -1,
        "halstead_delivered_bug": -1,
        "halstead_time": -1,

        # LOCMetrics
        "number_of_lines": -1,
        "loc_executable": -1, 
        "loc_comments": -1,
        "loc_code_and_comments": -1,
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
        allAttributes["halstead_volume"] = halsteadMetrics.get_program_volume()
        allAttributes["halstead_length"] = halsteadMetrics.get_program_length()
        allAttributes["halstead_vocabulary"] = halsteadMetrics.get_program_vocabulary()
        allAttributes["halstead_difficulty"] = halsteadMetrics.get_program_difficulty()
        allAttributes["halstead_level"] = halsteadMetrics.get_level_estimator()
        allAttributes["halstead_effort"] = halsteadMetrics.get_programming_effort()
        allAttributes["halstead_intelligent_content"] = halsteadMetrics.get_intelligent_content()
        allAttributes["halstead_delivered_bug"] = halsteadMetrics.get_delivered_bug()
        allAttributes["halstead_time"] = halsteadMetrics.get_programming_time()
        
        allAttributes["number_of_lines"] = locMetrics.get_number_of_lines()
        allAttributes["loc_executable"] = locMetrics.get_loc_executable()
        allAttributes["loc_comments"] = locMetrics.get_loc_comments()
        allAttributes["loc_code_and_comments"] = locMetrics.get_loc_code_with_comments()
        allAttributes["loc_blank"] = locMetrics.get_loc_blank()
        allAttributes["loc_total"] = locMetrics.get_loc_total()        

    except javalang.parser.JavaSyntaxError as e:
        print("The Java code has a syntax error:", str(e))

    except AttributeError as e:
        print("Attribute error encountered:", str(e))

    except TypeError as e:
        print("Type error encountered:", str(e))

    except KeyError as e:
        print("Key error encountered:", str(e))

    except Exception as e:
        print("An unexpected error occurred:", str(e))

    return allAttributes
