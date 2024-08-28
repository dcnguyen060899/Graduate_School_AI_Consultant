import os
from llama_index import SimpleDirectoryReader, VectorStoreIndex, StorageContext

# Directory containing the JSON files (representing university profiles)
json_directory = os.path.join(os.path.dirname(__file__), 'data', 'university_profiles')

# List all JSON files in the directory
json_files = [f for f in os.listdir(json_directory) if f.endswith('.json')]

# Iterate through each JSON file and create variables for each university
for json_file in json_files:
    university_name = json_file.replace('_profile.json', '')
    variable_name_data = f"{university_name}_data"
    variable_name_vector_store = f"vector_store_{university_name}"
    variable_name_storage_context = f"storage_context_{university_name}"

    # Dynamically execute code to create variables based on JSON file names
    exec(f"""
{variable_name_data} = SimpleDirectoryReader(input_files=["{os.path.join(json_directory, json_file)}"]).load_data()
{variable_name_vector_store} = VectorStoreIndex.from_documents({variable_name_data})
{variable_name_storage_context} = StorageContext.from_defaults(vector_store={variable_name_vector_store})
""")

# Initialize query engines for each university
for json_file in json_files:
    university_name = json_file.replace('_profile.json', '')
    variable_name_vector_store = f"vector_store_{university_name}"
    variable_name_engine = f"{university_name}_engine"

    # Dynamically execute code to create query engines based on vector store variables
    exec(f"""
{variable_name_engine} = {variable_name_vector_store}.as_query_engine(similarity_top_k=3)
""")
