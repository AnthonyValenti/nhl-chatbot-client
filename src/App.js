import arrow from './up-arrow.png';
import clear from './clear.png';
import './App.css';
import React from 'react';
import { useState } from 'react';
import {Rings} from 'react-loading-icons'


function App() {
  const [chatArray, setChatArray] = useState([]);
  const [userMsg,setUserMsg] = useState("");
  const [responseMsg,setResponseMsg] = useState("");
  const [isLoadingRes, setIsLoadingRes] = useState(false);


  const handleInput = (event) => {
    setUserMsg(event.target.value);
  };

  const handleClear = () => {
    setChatArray([]);
  }

  const submitMsg = async () => {
    const newDiv = <div key={chatArray.length} className='msg'><p className='role'>You</p>{userMsg}</div>;
    setUserMsg("");
    setChatArray((prevChatArray) => [...prevChatArray, newDiv]);
    setIsLoadingRes(true);
    await getResponse(userMsg)  }

  const checkEnter = async (event) => {
    if(event.key==='Enter'){
      submitMsg();
    }
  };

  const getResponse = async(prompt) =>{
    try{
      const jsonData = {
        prompt: prompt
      };
      const res = await fetch('https://chatgm-server.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const response = await res.json();
      setResponseMsg(response);
      const newDiv = <div key={chatArray.length} className='msg'><p className='role'>ChatGM</p>{response}</div>;
      console.log(responseMsg)
      setChatArray((prevChatArray) => [...prevChatArray, newDiv]);
    }catch (error) {
      // Handle errors here
      console.error('Error sending data:', error);
    }finally{
      setIsLoadingRes(false);
    }
  };



  return (
    <div className="App">
      <h1>ChatGM</h1>
      <div className='chat'>
      {chatArray.map((message) => (
          <div key={message.key}>{message}</div>
        ))}
        {isLoadingRes && <div className='msg'><p className='role'>ChatGM</p><Rings/></div>}</div>

      <div className="bottomBar">
        <input className="textInput" placeholder='Ask chatGM...' onKeyDown={checkEnter} onChange={handleInput} value={userMsg}/>
        <button className='arrow' onClick={submitMsg}><img src={arrow} alt='arrow'></img></button>
        <button className='clear' onClick={handleClear}><img src={clear} alt='clear'></img></button>
      </div>
    </div>
  );
}

export default App;
