import { ChatGroq } from "@langchain/groq"
import { ChatMistralAI, MistralAI } from "@langchain/mistralai"
import { ChatCohere } from "@langchain/cohere"
import config from "../config/confit.js"


export const groqModel = new ChatGroq({
    model : "llama-3.3-70b-versatile",
    apiKey : config.GROQ_API_KEY
})

export const mistralAiModel = new MistralAI({
    model : "mistral-medium-latest",
    apiKey : config.MISTRAL_API_KEY,
})

export const cohereModel = new ChatCohere({
    model : "command-a-03-2025",
    apiKey : config.COHERE_API_KEY
})