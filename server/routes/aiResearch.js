import express from 'express';
import { TheologicalRagEngine } from '../services/TheologicalRagEngine.js';

const router = express.Router();
const ragEngine = new TheologicalRagEngine();

// In a real staging environment, we'd trigger ingestion here or via a webhook
// ragEngine.ingestCommentary('./data/scholarly_commentary_ephesians.pdf');

/**
 * @route   POST /v1/ai/research
 * @desc    Executes a RAG-based theological research query
 * @access  Pro
 */
router.post('/research', async (req, res) => {
    try {
        const { user_query, verse_context } = req.body;

        if (!user_query) {
            return res.status(400).json({
                error: "Missing user_query. Please provide a specific theological question."
            });
        }

        console.log(`[AI-Research] Requesting intel for: "${user_query}" in context of ${verse_context || 'General Bible'}`);

        const result = await ragEngine.performResearch(user_query, verse_context);

        return res.status(200).json({
            status: "success",
            engine: "Theological-RAG-v4",
            model: "GPT-4-Turbo",
            verse_context: verse_context,
            intel: result,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("[AI-Research] Critical Failure:", error);
        return res.status(500).json({
            error: "Neural Research Engine failure.",
            message: error.message
        });
    }
});

export default router;
