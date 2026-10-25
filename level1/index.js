import express from "express"
import dotenv from "dotenv"
dotenv.config()
import { GoogleGenAI } from "@google/genai"

const app = express()

const port = process.env.PORT || 5000

const ai = new GoogleGenAI(
    {
        apiKey:process.env.GEMINI_API_KEY
    }
)

// Example 1: generateContent - waits for the full response, then prints it at once
// const generateContent = async ()=>{
//     try {
//         const response = await ai.models.generateContent({
//             model:"gemini-3.8-flash",
//             contents:"Hello"
//         })
//         console.log(response.text);
//     } catch (error) {
//         console.error("Gemini error:", error.message);
//     }
// }
// generateContent()

// Example 2: generateContentStream - prints the response chunk by chunk as it arrives
// const generateContentStream = async ()=>{
//     try {
//         const responseStream = await ai.models.generateContentStream({
//             model:"gemini-3.8-flash",
//             contents:"what is python"
//         })
//         for await (const chunk of responseStream){
//             console.log(chunk.text);
//         }
//     } catch (error) {
//         console.error("Gemini error:", error.message);
//     }
// }
// generateContentStream()

app.use(express.json())

// Chatbot API: send { "message": "..." } and get the AI reply back
app.post("/chat", async (req, res)=>{
    try {
        const { message } = req.body
        if (!message) {
            return res.status(400).json({ error: "message is required" })
        }
        const response = await ai.models.generateContent({
            model:"gemini-3.5-flash",
            contents:message
        })
        res.json({ reply: response.text })
    } catch (error) {
        console.error("Gemini error:", error.message);
        res.status(500).json({ error: error.message })
    }
})
app.listen(port, ()=>{
    console.log(`server started at ${port}`)
})