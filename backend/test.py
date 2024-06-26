import pandas as pd

# Read the CSV data from the file
df = pd.read_csv('ant-1.7.csv')

# Convert the 'bug' column values to True if > 0, otherwise False
df['bug'] = df['bug'].apply(lambda x: True if x > 0 else False)

# Output the DataFrame
print(df)

# Optionally, save the modified DataFrame to a new CSV file
df.to_csv('modified_data.csv', index=False)