import { useState,useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function FormLayout() {

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

    <div className='FormLayout'>
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Ask Question</Form.Label>
        <Form.Control type="email" placeholder="Ask Question" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      
      <Button variant="light" type="submit">
        Submit
      </Button>
      <br />
      <label htmlFor="">Ask Question</label>
    <br />
    <input type="text" value={prompt} onChange={(e)=>{handlePrompt(e);}} onKeyDown={(e)=>handleKeyDown(e)} />
    <button onClick={()=>{handleSubmit()}}  >Ask</button>
    <h3>{reply}</h3>

      
    </Form>
    </div>
  );
}

export default FormLayout;