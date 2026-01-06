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
