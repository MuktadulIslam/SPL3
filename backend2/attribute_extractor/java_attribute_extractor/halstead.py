import javalang
import re
import math


class HalsteadMetrics:
    def __init__(self, java_code, java_AST):
        self.__extract_operators_and_operands(java_code, java_AST)

    def __str__(self):
        return f"Classname: Halstead \n Attributes: [get_all_operators_operands, ]"

    def __extract_operators_and_operands(self, java_code, java_AST):
        operators = []
        operands = []

        # Iterate through each character in the Java code
        special_characters = {'{', '(', '[', ',', ';', '<', ':', '?'}
        # pattern = r'//.*?$|/\*.*?\*/'
        pattern = r'(["\']).*?\1|//.*?$|/\*.*?\*/'
        # Remove comments
        cleaned_code = re.sub(pattern, '', java_code, flags=re.DOTALL | re.MULTILINE)
        for char in cleaned_code:
            if char in special_characters:
                operators.append(char)

        # Walk through the AST and collect operators
        for path, node in java_AST:
            try:
                # for package declaration --> package org.example; --> op= ['package', '.' , ';'], opn = ['org', 'example']
                if isinstance(node, javalang.tree.PackageDeclaration):
                    operators.append("package")
                    operands.extend(list(node.name.split('.')))

                # for import declaration --> import java.util.Scanner; --> op= ['import', '.' , ';'], opn = ['java', 'util', 'Scanner']
                elif isinstance(node, javalang.tree.Import):
                    operators.append("import")
                    operands.extend(list(node.path.split('.')))

                # Interface names (interface declaration)
                elif isinstance(node, javalang.tree.InterfaceDeclaration):
                    operands.append(node.name)
                    operators.append("interface")
                    operators.extend(list(node.modifiers))
                    if type(node.extends) != type(None):
                        operators.append('extends')

                # Class names (class declaration)
                elif isinstance(node, javalang.tree.ClassDeclaration):
                    operands.append(node.name)
                    operators.append("class")
                    operators.extend(list(node.modifiers))

                    # Capture 'extends' if the class extends another class
                    if type(node.extends) != type(None):
                        operators.append('extends')
                    # Capture 'implements' if the class implements interfaces
                    if node.implements:
                        operators.append('implements')

                # if a new class is created
                elif isinstance(node, javalang.tree.ClassCreator):
                    operators.append('new')

                # Constructor names (Constructor declaration)
                elif isinstance(node, javalang.tree.ConstructorDeclaration):
                    operands.append(node.name)
                    operators.extend(list(node.modifiers))
                    if type(node.throws) != type(None):
                        operators.append('throws')
                        operands.extend(list(node.throws))

                # Method names (method declaration) and method modifiers (e.g., public, static)
                elif isinstance(node, javalang.tree.MethodDeclaration):
                    operands.append(node.name)
                    operators.extend(list(node.modifiers))

                    if type(node.throws) != type(None):
                        operators.append('throws')
                        operands.extend(list(node.throws))

                    if type(node.return_type) == type(None):
                        operators.append("void")  # Add return type (void)
                    operators.append("return")


                # If any ReferenceType is used as Parameter type or any object creation
                elif isinstance(node, javalang.tree.ReferenceType):
                    operands.append(node.name)

                # if any base datatype is used
                elif isinstance(node, javalang.tree.BasicType):
                    operators.append(node.name)

                # for parameter name
                elif isinstance(node, javalang.tree.FormalParameter):
                    operands.append(node.name)

                # for variable name
                elif isinstance(node, javalang.tree.VariableDeclarator):
                    operands.append(node.name)
                    if type(node.initializer) != type(None):
                        operators.append('=')

                # for attributes & variable modifiers
                elif isinstance(node, javalang.tree.LocalVariableDeclaration) or isinstance(node,
                                                                                            javalang.tree.FieldDeclaration):
                    operators.extend(list(node.modifiers))

                # for value or constant that is passed to a method/constractor or assigned to a variable
                # y = x + 10----> x = MemberReference,  10 = Literal
                elif isinstance(node, javalang.tree.Literal):
                    operands.append(node.value)
                    if type(node.postfix_operators) != type(None):
                        operators.extend(list(node.postfix_operators))
                    if type(node.prefix_operators) != type(None):
                        operators.extend(list(node.prefix_operators))
                elif isinstance(node, javalang.tree.MemberReference):
                    operands.append(node.member)
                    if type(node.postfix_operators) != type(None):
                        operators.extend(list(node.postfix_operators))
                    if type(node.prefix_operators) != type(None):
                        operators.extend(list(node.prefix_operators))

                # Method Invocation : Math.sum(1,2)
                elif isinstance(node, javalang.tree.MethodInvocation):
                    operands.append(node.member)
                    if type(node.qualifier) != type(None):
                        # print(node)
                        parts = node.qualifier.split(".")  # For adding "System.out.println()" to "System", ".", "out"
                        # Use a for loop to add each part to the operators list
                        for part in parts:
                            operands.append(part)
                        operators.extend(['.'] * (len(parts)))

                # Super Invocation
                elif isinstance(node, javalang.tree.SuperMethodInvocation) or isinstance(node,
                                                                                         javalang.tree.SuperMemberReference):
                    operators.append('super')
                    operators.append('.')
                    operands.append(node.member)

                # For Super Constructor Invocation ---->
                elif isinstance(node, javalang.tree.SuperConstructorInvocation):
                    operators.append('super')

                # For class Example<T extends Comparable<? super T>> {}
                elif isinstance(node, javalang.tree.TypeArgument) and node.pattern_type == "super":
                    operators.append('super')

                # This Invocation
                elif isinstance(node, javalang.tree.This):
                    operators.append('this')
                    operators.append('.')

                # Throw Statement
                elif isinstance(node, javalang.tree.ThrowStatement):
                    operators.append('throw')


                # Assignment operators    # e.g., '=', '+=', '-=', '<<=', '>>='
                elif isinstance(node, javalang.tree.Assignment):
                    operators.append(node.type)

                # Arithmetic, Relational, Logical
                elif isinstance(node, javalang.tree.BinaryOperation):
                    operators.append(node.operator)


                # Try-catch statement
                elif isinstance(node, javalang.tree.TryStatement):
                    operators.append('try')
                    if type(node.finally_block) != type(None):
                        operators.append('finally')

                elif isinstance(node, javalang.tree.CatchClauseParameter):
                    operators.append('catch')
                    operands.extend(list(node.types))
                    operands.append(node.name)


                # Control flow: if-else, for, while, do, switch-case
                elif isinstance(node, javalang.tree.IfStatement):
                    operators.append('if')
                    if node.else_statement:
                        operators.append('else')
                elif isinstance(node, javalang.tree.SwitchStatement):
                    operators.append('switch')

                elif isinstance(node, javalang.tree.SwitchStatementCase):  # Case inside switch
                    if node.case == []:
                        # When no specific case is present, append 'default'
                        operators.append('default')
                    else:
                        # When there is a specific case, append 'case'
                        operators.append('case')

                elif isinstance(node, javalang.tree.BreakStatement):  # Case inside switch
                    operators.append('break')
                elif isinstance(node, javalang.tree.ContinueStatement):  # Case inside switch
                    operators.append('continue')
                elif isinstance(node, javalang.tree.ForStatement):
                    operators.append('for')
                elif isinstance(node, javalang.tree.WhileStatement):
                    operators.append('while')
                elif isinstance(node, javalang.tree.DoStatement):
                    operators.append('do')
            finally:
                pass
        # return operators,operands
        self.__unique_operators = len(set(operators))
        self.__total_operators = len(operators)
        self.__unique_operands = len(set(operands))
        self.__total_operands = len(operands)

    def get_unique_operators(self):
        return self.__unique_operators

    def get_total_operators(self):
        return self.__total_operators

    def get_unique_operands(self):
        return self.__unique_operands

    def get_total_operands(self):
        return self.__total_operands

    def get_program_volume(self):
        if (self.__total_operators + self.__total_operands) > 0:
            return round((self.__unique_operators + self.__unique_operands) * math.log2(
                self.__total_operators + self.__total_operands) , 4)
        else:
            return 0.0

    def get_program_length(self):
        return self.__unique_operators + self.__unique_operands

    def get_program_vocabulary(self):
        return self.__total_operators + self.__total_operands

    def get_program_difficulty(self):
        return round((self.__total_operators / 2) * (self.__unique_operands / self.__total_operands) , 4)

    def get_level_estimator(self):
        return round( 1 / self.get_program_difficulty() , 4)

    def get_programming_effort(self):
        return round(self.get_program_volume() * self.get_program_difficulty() , 4)

    def get_intelligent_content(self):
        return round(self.get_level_estimator() * self.get_program_volume() , 4)

    def get_delivered_bug(self):
        return round(math.pow(self.get_programming_effort(),2/3) / 3000 , 4)

    def get_programming_time(self):
        return round(self.get_programming_effort()/18 , 4)

