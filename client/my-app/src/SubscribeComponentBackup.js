import './App.css';
import React , {useEffect, useRef, useState} from 'react'
import Button from 'react-bootstrap/Button';

// don't show duplicate (same msg state) socket incomming message
function SubscribeComponent({setPublishTopic,socket}) {
    const [subTopic , setSubTopic] = useState('');
    const [msg , setMsg] = useState('');
    const [textAreaMsg , setTextAreaMsg] = useState('');
    const [isSub , setIsSub] = useState(false);
    const [topicInput , setTopicInput] = useState('');
    const [mounted , setMounted] = useState(false);
    const textBoxRef = useRef();

    useEffect(() => {
      setMounted(true);
    },[]);

    useEffect(() => {
      if (!mounted) return;
      const lineOutput = `Topic (${subTopic}) : ${msg} \n`;
      setTextAreaMsg(textAreaMsg + lineOutput);
    },[msg])

    const subscribeTopic = () => {
      unSubscribeTopic();

      const tmpTopic = topicInput;
      sendTopicSubRequest(tmpTopic);
      setSubTopic(tmpTopic); 
      socket.on(tmpTopic, (message) =>{
          //setMsg(message);
          incommingMqttMsgHandle(message);
      });
    }

    const incommingMqttMsgHandle = (message) => {
      setMsg(message);
    }

    const sendTopicSubRequest = (topic) => {
        socket.emit('requestTopic' , topic);
    }
  
    const unSubscribeTopic = () => {
        socket.off(subTopic);
        setSubTopic('');
        // send unsub cmd to server
    }
    const textChangeHandle = (e) => {
      setTopicInput(e.target.value);
    }

    const handleSubButton = (e) => {
        subscribeTopic();
    }
    const handleUnSubButton = e => {
        unSubscribeTopic();
    }

    const handleSetTopicButton = e => {
        setPublishTopic(subTopic);
    }
    return (
      <div> 
        Subscribed Topic : {subTopic || 'Not Subscribed!!'}  <br/>
        Topic Input  <input type = 'text' value = {topicInput} onChange = {textChangeHandle}/>
        <Button variant = {subTopic !== '' ? 'primary' : 'outline-primary'} onClick = {handleSubButton} > subscribe </Button> 
        <Button variant = {subTopic === '' ? 'primary' : 'outline-primary'} onClick = {handleUnSubButton}> unsubscribe </Button> 
        <br/>
        <Button variant = 'outline-primary' onClick = {handleSetTopicButton}> Copy Sub topic to Publish Topic </Button>
        <br/><br/>
        Messages : {msg} <br/>
        <textarea ref = {textBoxRef} rows = '10' value = {textAreaMsg} style = {{width : '360px'}}/>
        <br/>
      </div>
  
    )
  }

  export default SubscribeComponent;