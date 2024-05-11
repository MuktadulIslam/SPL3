# from fastapi import FastAPI

# app = FastAPI()


# @app.get("/")
# async def abc():
#     return {"message": "Hello World"}

from classDepth import calculate_class_depth, abc;

print(calculate_class_depth("./data/source_code_apache_ant_170/src/main"))
abc("Muktadul Islam")