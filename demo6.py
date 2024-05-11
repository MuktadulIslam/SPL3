from pyjavaparser.parser import JavaParser
from pyjavaparser.ast.visitor import GenericVisitorAdapter

class SoftwareMetricExtractor(GenericVisitorAdapter):
    def __init__(self):
        self.method_count = 0
        self.class_count = 0
        self.variable_count = 0
        self.line_count = 0

    def visit_ClassOrInterfaceDeclaration(self, node, args):
        self.class_count += 1
        super().visit_ClassOrInterfaceDeclaration(node, args)

    def visit_MethodDeclaration(self, node, args):
        self.method_count += 1
        super().visit_MethodDeclaration(node, args)

    def visit_VariableDeclarationExpr(self, node, args):
        self.variable_count += 1
        super().visit_VariableDeclarationExpr(node, args)

    def visit_Line(self, node, args):
        self.line_count += 1
        super().visit_Line(node, args)

# Load and parse a Java file
with open('./data/source_code_apache_ant_170/src/main/org/apache/tools/zip/ZipShort.java', 'r') as file:
    java_code = file.read()

parsed_ast = JavaParser().parse_string(java_code)

# Instantiate the metric extractor
metric_extractor = SoftwareMetricExtractor()

# Visit the AST to extract metrics
parsed_ast.accept(metric_extractor, None)

# Print the extracted metrics
print("Number of classes:", metric_extractor.class_count)
print("Number of methods:", metric_extractor.method_count)
print("Number of variables:", metric_extractor.variable_count)
print("Number of lines:", metric_extractor.line_count)