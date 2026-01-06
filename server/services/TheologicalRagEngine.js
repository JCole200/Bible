import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory"; // Replace with Pinecone/PGVector for production
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";

export class TheologicalRagEngine {
    constructor() {
        this.embeddings = new OpenAIEmbeddings({
            modelName: "text-embedding-3-small",
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        this.model = new ChatOpenAI({
            modelName: "gpt-4-turbo",
            temperature: 0.1, // Low temperature for factual accuracy
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        this.vectorStore = null;
    }

    /**
     * Ingestion Pipeline: Process scholarly PDF commentaries
     */
    async ingestCommentary(filePath) {
        console.log(`[RAG] Ingesting: ${filePath}`);
        const loader = new PDFLoader(filePath);
        const rawDocs = await loader.load();

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const splitDocs = await splitter.splitDocuments(rawDocs);

        // In a real pro-app, we would upsert to Pinecone/PGVector here
        if (!this.vectorStore) {
            this.vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, this.embeddings);
        } else {
            await this.vectorStore.addDocuments(splitDocs);
        }

        return splitDocs.length;
    }

    /**
     * Research Execution: Retrieval + Augmented Generation
     */
    async performResearch(query, verseContext = "") {
        if (!this.vectorStore) throw new Error("Vector database not initialized with scholarly context.");

        const retriever = this.vectorStore.asRetriever(5);

        const systemPrompt = `
        You are a Senior Theological Research Assistant for the Transform Pro Bible Suite.
        Your goal is to provide deep, scholarly insights on biblical texts.

        STRICT PROTOCOLS:
        1. Answer the query using ONLY the provided scholarly context below.
        2. CITE EVERY CLAIM using brackets (e.g., [Commentary Name, p. 45]).
        3. If the provided context does not contain the answer, state: "The current scholarly database does not contain specific data to answer this query definitively."
        4. VERSE CONTEXT: The user is currently looking at: ${verseContext}.
        5. DO NOT SPECULATE beyond the provided text.

        SCHOLARLY CONTEXT:
        {context}

        USER QUERY: {question}
        `;

        const chain = RunnableSequence.from([
            {
                context: retriever.pipe(formatDocumentsAsString),
                question: (input) => input.question,
            },
            PromptTemplate.fromTemplate(systemPrompt),
            this.model,
        ]);

        const response = await chain.invoke({ question: query });
        return response.content;
    }
}
