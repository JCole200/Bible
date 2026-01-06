import express from 'express';
import dotenv from 'dotenv';
import aiResearchRouter from './routes/aiResearch.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());

// Routes
app.use('/v1/ai', aiResearchRouter);

// Health Check
app.get('/health', (req, res) => {
    res.json({
        service: "Transform Pro - AI Theological Research Backend",
        status: "Online",
        capabilities: ["RAG", "Vector-Search", "Theological-Context-Injection"]
    });
});

app.listen(PORT, () => {
    console.log(`
    -------------------------------------------------------
    ✨ Transform Pro AI Backend Initialized
    🚀 Vector Service: Online (text-embedding-3-small)
    📡 Endpoint: http://localhost:${PORT}/v1/ai/research
    -------------------------------------------------------
    `);
});
