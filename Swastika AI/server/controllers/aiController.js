import { groq_chat } from "../utils/groq_config.js"

const aiCall = async (req, res) => {

    const {prompt} = req.body
    try {
        console.log(req.body);
        
        const result = await groq_chat(prompt)
        res.status(200).json({
            "result":result
        })
    } catch (error) {
        res.status(400)

    }
}

export {aiCall}