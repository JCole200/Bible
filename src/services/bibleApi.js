const BASE_URL = 'https://bible-api.com';

/**
 * Fetches a specific chapter of a book.
 * @param {string} book - The name of the book
 * @param {number} chapter - The chapter number
 * @returns {Promise<object>} The chapter data
 */
export async function getChapter(book, chapter) {
  try {
    const response = await fetch(`${BASE_URL}/${book}+${chapter}`);
    if (!response.ok) throw new Error('Failed to fetch chapter');
    return await response.json();
  } catch (error) {
    console.error("Bible API Error:", error);
    throw error;
  }
}

/**
 * Searches for verses containing a specific keyword.
 * @param {string} query - The search query
 * @returns {Promise<object>} The search results
 */
export async function searchVerses(query) {
  try {
    const response = await fetch(`${BASE_URL}/verses/${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search verses');
    return await response.json();
  } catch (error) {
    console.error("Bible Search Error:", error);
    throw error;
  }
}
