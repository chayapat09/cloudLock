import './App.css';
import React , {useContext, useEffect, useState} from 'react'
import socketIOClient from 'socket.io-client';
// import SubscribeComponent from './SubscribeComponent';
import MqttPublish from './mqttPub';

import 'bootstrap/dist/css/bootstrap.min.css';
import AlertComponent from './AlertComponent';
// import PublishBar from './PublishBar';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const ENDPOINT = 'http://192.168.31.211:3030/';
//const ENDPOINT = 'http://localhost:3030/'
const socket = socketIOClient(ENDPOINT);


// TODO : currentActiveConnection not update ?? need to refreshs
const alertContext = React.createContext({alertMessage : null , setAlertMessage : null})
function App() {
  const [alert , setAlert] = useState({type : '' , header : ''});
  const [publishTopic , setPublishTopic] = useState('');
  const [currentActiveConnection , setCurrentActiveConnection] = useState(0);
  //const [isSocketConnected , setIsSocketConnected] = useState(false);
  useEffect(() => {
    socket.on('CMD::activeConnection' , (activeConn) => {
      activeConnectionIncommingMessage(activeConn);
    })
    socket.on('cardList' , (cardList) => {
      console.log(cardList);
    })
  },[]);

  const activeConnectionIncommingMessage = (num) => {
    setCurrentActiveConnection(num);
  }

  useEffect(()=> {
    setAlert({
      type : 'success' , 
      header : `Currenly has ${currentActiveConnection} connection to Edge Computer`
    })
  },[currentActiveConnection])

  useEffect(() => {
    if (socket.connected) return;
    setAlert({
      type : 'danger',
      header : 'Connection to Edge Computer Failed'
    })
  },[socket.connected])

  return (
    <div> 
      <AlertComponent type = {alert.type} header = {alert.header} />
      


      {/* <SubscribeComponent socket = {socket} setPublishTopic = {setPublishTopic}/> <br/> <br/>

      <PublishBar publishTopic = {publishTopic} setPublishTopic = {setPublishTopic} socket = {socket} />     */}
    </div>
  )
}

export default App;



      {/* <Container>
        <Row>
          <Col> 
            <SubscribeComponent socket = {socket} setPublishTopic = {setPublishTopic}/> <br/> <br/>
          </Col>
          <Col> 
            <SubscribeComponent socket = {socket} setPublishTopic = {setPublishTopic}/> <br/> <br/>
          </Col>
        </Row>
        <Row>
          <Col> 
            <SubscribeComponent socket = {socket} setPublishTopic = {setPublishTopic}/> <br/> <br/>
          </Col>
          <Col> 
            <SubscribeComponent socket = {socket} setPublishTopic = {setPublishTopic}/> <br/> <br/>
          </Col>
        </Row>
      </Container> */}