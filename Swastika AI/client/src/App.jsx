import { useState,useEffect } from 'react';
import axios from 'axios';
import logo from './assets/images.png';
import FormLayout from './components/Form';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
function App() {
  const [prompt, setPrompt] = useState('')
  const [reply,setReply] = useState('')
 
  const handlePrompt =(e)=>{
    e.preventDefault()
    setPrompt(e.target.value)
  }

  const handleSubmit=()=>{
    axios.post('http://localhost:3000/ai/chat',{prompt:prompt})
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
    <h1 className='bg-amber-300'>Swastika App</h1>
    <img src={logo} className="App-logo" alt="logo" />
    <br></br>
    
    <label htmlFor="">Ask Question</label>
    <br />
    <input type="text" value={prompt} onChange={(e)=>{handlePrompt(e);}} onKeyDown={(e)=>handleKeyDown(e)} />
    <button onClick={()=>{handleSubmit()}}  >Ask</button>
    <h3>{reply}</h3>
    </>
  )
}

export default App
