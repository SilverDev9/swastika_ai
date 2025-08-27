import { useState } from 'react'
import axios from 'axios';

import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [reply,setReply] = useState('')
 
  const handlePrompt =(e)=>{
    e.preventDefault()
    setPrompt(e.target.value)
  }

  const handleSubmit=()=>{
    axios.post('https://swastika-ai.onrender.com/ai/chat',{prompt:prompt})
    .then(response => {
    setReply(response.data.result.choices[0].message.content)
    setPrompt('')
})
.catch(error => {
  console.error(error);
});
    
  }

    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    };
  

  return (
    <>
    <label htmlFor="">Enter Prompt</label>
    <br />
    <input type="text" value={prompt} onChange={(e)=>{handlePrompt(e);}} onKeyDown={(e)=>handleKeyDown(e)} />
    <button onClick={()=>{handleSubmit()}}  >Send</button>
    <h3>{reply}</h3>
    </>
  )
}

export default App
