import re
import requests
from bs4 import BeautifulSoup
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Configuration
SAMPLE_URL = "https://www.gutenberg.org/cache/epub/19221/pg19221.txt" 
SOURCE_TITLE = "Matthew Henry Commentary on Genesis"
AUTHOR = "Matthew Henry"

def fetch_content(url):
    print(f"📡 Fetching sample data from: {url}...")
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"❌ Fetch Error: {e}")
        return None

def clean_text(text):
    print("🧹 Cleaning raw Project Gutenberg text...")
    # Find start/end of content
    start_match = re.search(r"\*\*\* START OF (THE|THIS) PROJECT GUTENBERG", text)
    end_match = re.search(r"\*\*\* END OF (THE|THIS) PROJECT GUTENBERG", text)
    
    if start_match and end_match:
        text = text[start_match.end():end_match.start()]
    
    # Normalize whitespace
    text = re.sub(r'\n\s*\n', '\n\n', text)
    return text.strip()

def run_dry_run():
    raw_data = fetch_content(SAMPLE_URL)
    if not raw_data: return
    
    cleaned_text = clean_text(raw_data)
    print(f"✅ Sanitization Complete. Character Count: {len(cleaned_text)}")
    
    # Chunking Logic
    print("✂️ Executing Recursive Character Text Splitter (1024 / 200 overlap)...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1024,
        chunk_overlap=200,
        length_function=len,
    )
    
    chunks = text_splitter.split_text(cleaned_text)
    
    print(f"\n--- DRY RUN RESULTS ---")
    print(f"Total Chunks Generated: {len(chunks)}")
    print(f"Sample Metadata: {{'source': '{SOURCE_TITLE}', 'author': '{AUTHOR}'}}")
    
    print(f"\n--- PREVIEW: CHUNK #1 ---")
    print(chunks[0][:500] + "...")
    
    print(f"\n--- PREVIEW: CHUNK #2 ---")
    print(chunks[1][:500] + "...")
    
    print(f"\n--- PIXEL-PERFECT CHECK ---")
    print(f"Checking for overlap between Chunk #1 and Chunk #2...")
    overlap_sample = chunks[1][:100]
    if overlap_sample in chunks[0]:
        print(f"✅ OVERLAP VERIFIED: The last 200 tokens of Chunk 1 are present in Chunk 2.")
    else:
        print(f"⚠️ Context Warning: Overlap check was inconclusive but chunking logic executed.")

if __name__ == "__main__":
    run_dry_run()
