import { groq_chat } from "../utils/groq_config.js"

const aiCall = async (req, res) => {
    //const prompt = "What is Groq ai"
    const {prompt} = req.body
    try {
        const result = await groq_chat(prompt)
        res.status(200).json({
            "result":result
        })
    } catch (error) {
        res.status(400)

    }
}

export {aiCall}