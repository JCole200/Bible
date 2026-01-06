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
 * Searches for verses containing a specific keyword using Bolls API.
 * @param {string} query - The search query
 * @param {string} translation - The translation slug (default: KJV)
 * @returns {Promise<object>} The search results
 */
export async function searchVerses(query, translation = 'KJV') {
  try {
    const url = `https://bolls.life/v2/find/${translation}/?search=${encodeURIComponent(query)}&match_case=false&match_whole=true`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to search verses');
    return await response.json();
  } catch (error) {
    console.error("Bible Search Error:", error);
    throw error;
  }
}
