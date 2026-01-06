import os
import re
import requests
import time
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from pinecone import Pinecone, ServerlessSpec
from tqdm import tqdm

# Load environment variables
load_dotenv()

# Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = "bible-pro-index"
EMBEDDING_MODEL = "text-embedding-3-small"

# Initialize Clients
pc = Pinecone(api_key=PINECONE_API_KEY)
embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL, openai_api_key=OPENAI_API_KEY)

# 1. Scraper & Cleaning Module
class ContentScraper:
    @staticmethod
    def fetch_url(url):
        print(f"📡 Fetching: {url}")
        for i in range(3):  # Simple retry logic
            try:
                response = requests.get(url, timeout=15)
                response.raise_for_status()
                return response.text
            except Exception as e:
                print(f"⚠️ Retry {i+1} failed: {e}")
                time.sleep(2 ** i)
        return None

    @staticmethod
    def clean_gutenberg_text(text):
        """Strips Project Gutenberg boilerplate and normalizes text."""
        # Regex to find the start and end of actual content
        start_marker = re.search(r"\*\*\* START OF (THE|THIS) PROJECT GUTENBERG", text)
        end_marker = re.search(r"\*\*\* END OF (THE|THIS) PROJECT GUTENBERG", text)
        
        if start_marker and end_marker:
            text = text[start_marker.end():end_marker.start()]
        
        # Remove extra whitespace/newlines
        text = re.sub(r'\n\s*\n', '\n\n', text)
        return text.strip()

# 2. Ingestion Pipeline
def run_pipeline(source_url, source_title, author):
    # Setup Pinecone Index if not exists
    if PINECONE_INDEX_NAME not in pc.list_indexes().names():
        print(f"🏗️ Creating Index: {PINECONE_INDEX_NAME}")
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=1536,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
    
    index = pc.Index(PINECONE_INDEX_NAME)

    # Scrape and Clean
    raw_text = ContentScraper.fetch_url(source_url)
    if not raw_text: return
    
    clean_text = ContentScraper.clean_gutenberg_text(raw_text)
    print(f"✅ Text Cleaned. Length: {len(clean_text)} chars.")

    # Chunking
    print("✂️ Chunking text...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1024,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False,
    )
    
    chunks = text_splitter.split_text(clean_text)
    print(f"📦 Created {len(chunks)} chunks.")

    # Detect Bible Book (simple heuristic from title)
    book_match = re.search(r'(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Matthew|Mark|Luke|John|Romans|Psalms)', source_title, re.IGNORECASE)
    detected_book = book_match.group(0) if book_match else "General"

    # Embedding & Upsert
    print(f"🧠 Generating Embeddings & Upserting to {PINECONE_INDEX_NAME}...")
    batch_size = 100
    for i in tqdm(range(0, len(chunks), batch_size)):
        batch_chunks = chunks[i : i + batch_size]
        
        # Generate IDs
        ids = [f"{source_title.replace(' ', '_')}_{j}" for j in range(i, i + len(batch_chunks))]
        
        # Generate Embeddings
        embeds = embeddings.embed_documents(batch_chunks)
        
        # Build Metadata
        metadata = [{
            "text": chunk,
            "source_title": source_title,
            "author_name": author,
            "chunk_index": j,
            "bible_book": detected_book
        } for j, chunk in enumerate(batch_chunks, start=i)]
        
        # Upsert
        vectors = list(zip(ids, embeds, metadata))
        index.upsert(vectors=vectors)

    print("✨ Ingestion Complete.")

# 3. Final Verification Step
def verify_pipeline():
    print("\n🔍 Running Verification Query: 'Noah's Ark'...")
    index = pc.Index(PINECONE_INDEX_NAME)
    
    query_text = "Noah's Ark and the covenant"
    query_vector = embeddings.embed_query(query_text)
    
    results = index.query(vector=query_vector, top_k=1, include_metadata=True)
    
    if results['matches']:
        match = results['matches'][0]
        print(f"✅ SUCCESS: Data is retrievable!")
        print(f"   Top Match Source: {match['metadata']['source_title']}")
        print(f"   Snippet: {match['metadata']['text'][:150]}...")
    else:
        print("❌ FAILURE: No data returned from index.")

if __name__ == "__main__":
    # Example Sample: Matthew Henry's Commentary (Part of it)
    # Using a verifiable Project Gutenberg URL for Matthew Henry
    SAMPLE_URL = "https://www.gutenberg.org/cache/epub/19221/pg19221.txt" 
    
    run_pipeline(
        source_url=SAMPLE_URL,
        source_title="Matthew Henry Commentary on Genesis",
        author="Matthew Henry"
    )
    
    verify_pipeline()
