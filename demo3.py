import jpype
from jpype import java

def get_inheritance_level(class_name):
    try:
        # Start the JVM
        jpype.startJVM(jpype.getDefaultJVMPath())

        # Get the class object
        java_class = java.lang.Class.forName(class_name)

        # Get the superclass
        superclass = java_class.getSuperclass()

        # Count the inheritance levels
        inheritance_level = 0
        while superclass:
            inheritance_level += 1
            superclass = superclass.getSuperclass()

        return inheritance_level

    finally:
        # Shutdown the JVM
        jpype.shutdownJVM()

# Example usage
class_name = "java.util.ArrayList"
inheritance_level = get_inheritance_level(class_name)
print(f"Inheritance level of {class_name}: {inheritance_level}")
