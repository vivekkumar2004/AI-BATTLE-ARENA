import dotenv from 'dotenv';
dotenv.config();

const config = {
    GROQ_API_KEY : process.env.GROQ_API_KEY || "",
    MISTRAL_API_KEY : process.env.MISTRAL_API_KEY || "",
    COHERE_API_KEY : process.env.COHERE_API_KEY || "",
}

export default config;