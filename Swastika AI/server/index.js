import express from 'express'
import cors from 'cors'
import Groq from 'groq-sdk';
import { groq_chat } from './utils/groq_config.js';
import aiRoutes from './routes/aiRoutes.js'
import 'dotenv'
import { configDotenv } from 'dotenv';

configDotenv();

const app = express();

const corsOptions ={
    origin:'http://localhost:5173', 
    credentials:true,            //access-control-allow-credentials:true
    
    optionSuccessStatus:200
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));


const port = 3000; // You can choose any available port

app.use("/ai",aiRoutes )
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
