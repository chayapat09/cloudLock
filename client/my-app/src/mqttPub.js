import React , {useEffect, useState} from 'react'

function MqttPublish({publishTopic , setPublishTopic , socket}) {
    //const [publishTopic , setPublishTopic] = useState('');
    const [publishMsg , setPublishMsg] = useState('');


    const mqttPublish = () => {
        const payload = {
            topic : publishTopic,
            msg : publishMsg,
        };
        socket.emit('CMD::publishFromClient' , payload);
    }

    const keyPressHandle = (e) => {
        if (e.code === 'Enter') {
            mqttPublish();
            setPublishMsg('');
        }
    }

    const textBoxTopicChangeHandle = (e) => {
        setPublishTopic(e.target.value);
    }

    const textBoxMsgChangeHandle = (e) => {
        setPublishMsg(e.target.value);
    }

    return (
        <div>
            <h2> Publish </h2> 
            <input type = 'text' value = {publishTopic} onChange = {textBoxTopicChangeHandle} placeholder = 'Publish Topic'/> <br/>
            <input type = 'text' value = {publishMsg} onChange = {textBoxMsgChangeHandle} onKeyPress = {keyPressHandle} placeholder = 'Publish Message'/>
        </div>
    );
}

export default MqttPublish;