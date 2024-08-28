import os
from llama_index import SimpleDirectoryReader, VectorStoreIndex, StorageContext

def initialize_query_engines():
    # Directory containing the JSON files (representing university profiles)
    json_directory = os.path.join(os.path.dirname(__file__), 'data', 'university_profiles')

    # List all JSON files in the directory
    json_files = [f for f in os.listdir(json_directory) if f.endswith('.json')]

    # Dictionary to hold the initialized engines
    engines = {}

    # Iterate through each JSON file and create variables for each university
    for json_file in json_files:
        university_name = json_file.replace('_profile.json', '')
        variable_name_vector_store = f"vector_store_{university_name}"
        variable_name_engine = f"{university_name}_engine"

        # Load data and initialize the vector store and storage context
        data = SimpleDirectoryReader(input_files=[os.path.join(json_directory, json_file)]).load_data()
        vector_store = VectorStoreIndex.from_documents(data)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        # Initialize the query engine
        engine = vector_store.as_query_engine(similarity_top_k=3)

        # Store the engine in the dictionary
        engines[university_name] = engine

    return engines
