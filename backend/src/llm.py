import os
from dotenv import load_dotenv
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.storage.chat_store import SimpleChatStore
from llama_index.core.memory import ChatMemoryBuffer

# Load environment variables from a .env file
load_dotenv()

# Initialize the OpenAI LLM using the API key from environment variables
llm = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize the embeddings for vector search
embeddings = OpenAIEmbedding(api_key=os.getenv("OPENAI_API_KEY"))

# Set up a SimpleChatStore to manage chat history in memory (can be saved to disk if needed)
chat_store = SimpleChatStore()

# Initialize conversation memory with a token limit and associate it with the chat store
memory = ChatMemoryBuffer.from_defaults(
    token_limit=3000,  # Adjust the token limit as needed
    chat_store=chat_store,  # The chat store to use for storing chat history
    chat_store_key="user1",  # Unique key for storing chat history for a particular user or session
)

# # Optionally, save the chat store to disk (for persisting chat history across sessions)
# chat_store.persist(persist_path="chat_store.json")

# # Optionally, load a chat store from disk (for restoring chat history from a previous session)
# # loaded_chat_store = SimpleChatStore.from_persist_path(persist_path="chat_store.json")

# # Optionally, convert chat store to/from a string for storage elsewhere
# # chat_store_string = chat_store.json()
# # loaded_chat_store = SimpleChatStore.parse_raw(chat_store_string)
