import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './assets/images.png';
import FormLayout from './components/Form';
import Answers from './components/Answers';
import './App.css'
function App() {
  const [prompt, setPrompt] = useState('')
  const [reply, setReply] = useState([])

  const handlePrompt = (e) => {
    e.preventDefault()
    setPrompt(e.target.value)
  }

  const handleSubmit = () => {
    axios.post('https://swastika-ai.onrender.com/ai/chat', { prompt: prompt })
      .then(response => {


        let replyStr = response.data.result.choices[0].message.content
        console.log(replyStr);
        
        replyStr = replyStr.split("**")
        replyStr = replyStr.map((i) => i.trim())
        console.log(replyStr);
        setReply([...reply,{type:'q',text:prompt},{type:'a',text:replyStr}])
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
      <div className="flex justify-center">
        <img src={logo} className="App-logo" alt="logo" />
      </div>

      <div className='h-full p-3 text-zinc-300'>

       {reply.map((i,index)=>(
        <div key={index+Math.random()} className={i.type=='q'?'flex justify-end ':'p-2 m-2'}>
        {i.type=='q'?<ul key={index+Math.random()} className='text-right   border-2 bg bg-zinc-700 border bg-zinc-700 rounded-3xl w-fit'>
          <Answers ans={i.text} totalResult={1} type={i.type}/>
        </ul>:
        i.text.map((ansItem,ansIndex)=>(
          <ul key={ansIndex+Math.random() } className='text-left p-1'>
          <Answers ans={ansItem} totalResult={ansItem.length} index={ansIndex}/></ul>
        ))}</div>
       ))} 
        
       {/* <h2 className=''>{reply && reply.map((i, index) => (
        <ul className='text-left m-5'><Answers ans={i} key={index+Math.random()} totalResult={reply.length} /></ul>))}
        </h2>*/}
        n 
      </div>

      <div className='bg-zinc-800 w-full p-1 pr-5 text-white m-auto rounded-4xl border border-zinc-400 flex h-16 fixed bottom-0 left-0'>


        <input type="text" className='w-full h-full p-3 outline-none ' placeholder='Ask Me Anythng' value={prompt} onChange={(e) => { handlePrompt(e); }} onKeyDown={(e) => handleKeyDown(e)} />
        <button className='rounded-4xl' onClick={() => { handleSubmit() }} >Ask</button>
      </div>

      {/*
    
    <label htmlFor="">Ask Question</label>
    
    <input type="text" value={prompt} onChange={(e)=>{handlePrompt(e);}} onKeyDown={(e)=>handleKeyDown(e)} />
    <button onClick={()=>{handleSubmit()}}  >Ask</button>
    <h3>{reply}</h3>
    
    <div className='grid grid-cols-5 h-screen text-center'>  
    
      <div className='col-span-1 bg-zinc-800'>
      </div>
      <img src={logo} className="App-logo" alt="logo" />
      <div className='col-span-4'>
      <div className='container h-90'>

      </div>
      
      <div className='bg-zinc-800 w-full p-1 pr-5 text-white m-auto rounded-4xl border border-zinc-400 flex h-16'>
      <input type="text" className='w-full h-full p-3 outline-none' placeholder='Ask Me Anythng' value={prompt} onChange={(e)=>{handlePrompt(e);}} onKeyDown={(e)=>handleKeyDown(e)} />
      <button className='rounded-4xl ' >Ask</button>
      </div>
      </div>
      </div>  */}
    </>
  )
}

export default App
