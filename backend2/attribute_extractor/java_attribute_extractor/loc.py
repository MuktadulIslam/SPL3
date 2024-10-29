import re

class LOCMetrics:
    def __init__(self, java_code):
        self.__extract_all_loc(java_code)
    def __extract_all_loc(self, java_code):
        number_of_lines = 0
        loc_executable = 0
        loc_comments = 0
        loc_code_and_comments = 0
        loc_blank = 0

        # Split the provided Java code into lines
        lines = java_code.split('\n')

        in_multiline_comment = False
        pattern1 = r'(?<!["\'])//(?!["\'])'  # for //
        pattern2 = r'(?<!["\'])/\*.*?\*/(?!["\'])'  # for /*....*/
        pattern3 = r'(?:(?<!")/[*](?![^"]*"))'  # for /*
        pattern4 = r'(?:(?<!")[*]/(?![^"]*"))'  # for */

        for line in lines:
            number_of_lines += 1

            stripped_line = line.strip()

            # Check for blank lines
            if not stripped_line:
                if in_multiline_comment:
                    loc_comments += 1
                else:
                    loc_blank += 1
                continue
            #  Check that is a line not executable or comment (Like: @Override, @BeanProperty)
            if stripped_line.startswith('@'):
                continue

            # Check for single-line comments
            if in_multiline_comment:
                if stripped_line.endswith('*/'):
                    in_multiline_comment = False
                    loc_comments += 1
                elif bool(re.search(pattern4, stripped_line)):
                    in_multiline_comment = False
                    loc_code_and_comments += 1
                else:
                    loc_comments += 1

            else:
                if stripped_line.startswith('//') or stripped_line.startswith('/*') and stripped_line.endswith('*/'):
                    loc_comments += 1
                elif bool(re.search(pattern1, stripped_line)) or bool(re.search(pattern2, stripped_line)):
                    loc_code_and_comments += 1
                elif stripped_line.startswith('/*'):
                    in_multiline_comment = True
                    loc_comments += 1
                elif bool(re.search(pattern3, stripped_line)):
                    in_multiline_comment = True
                    loc_code_and_comments += 1
                else:
                    loc_executable += 1

        self.__number_of_lines = number_of_lines
        self.__loc_executable = loc_executable
        self.__loc_comments = loc_comments
        self.__loc_code_and_comments = loc_code_and_comments
        self.__loc_blank = loc_blank
        self.__loc_total = loc_executable + loc_code_and_comments

    def get_number_of_lines(self):
        return self.__number_of_lines

    def get_loc_executable(self):
        return self.__loc_executable

    def get_loc_comments(self):
        return self.__loc_comments

    def get_loc_code_with_comments(self):
        return self.__loc_code_and_comments

    def get_loc_blank(self):
        return self.__loc_blank

    def get_loc_total(self):
        return self.__loc_total





