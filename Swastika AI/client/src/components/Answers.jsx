import React, { useEffect,useState } from 'react'
import { checkHeading, replaceHeadingStars } from '../utils'


const Answers = ({ans,totalResult,index,type}) => {

    const [heading, setHeading] = useState(false)
    const [answer, setAnswer] = useState(ans)

    useEffect(() => {
    if(checkHeading(ans)){
      setHeading(true)
      setAnswer(replaceHeadingStars(ans))
    }
    }, [])    
    
  return (
    <div>
        
        {
        index== 0 && totalResult>1?<span className=' pl-5 font-bold'>{answer}</span>:
        heading?<span className='pt-2 text-lg block'>{answer}</span>:
        <span className={type=='q'?'pl-1 m-2':'pl-5'}>{answer}</span>}
    </div>
  )
}

export default Answers