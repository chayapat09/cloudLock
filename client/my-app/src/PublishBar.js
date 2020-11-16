import React, { useState } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

function PublishBar({publishTopic , setPublishTopic , socket}) {
    const [publishMsg , setPublishMsg] = useState('');


    const mqttPublish = () => {
        const payload = {
            topic : publishTopic,
            msg : publishMsg,
        };
        socket.emit('CMD::publishFromClient' , payload);
    }

    const keyPressHandle = (e) => {
        console.log(e.code);
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

    const onSubmitHandle = e => {
        e.preventDefault();
        mqttPublish();
        setPublishMsg('');
    }

    // return (
    //     <div>
    //         <h2> Publish </h2> 
    //         <input type = 'text' value = {publishTopic} onChange = {textBoxTopicChangeHandle} placeholder = 'Publish Topic'/> <br/>
    //         <input type = 'text' value = {publishMsg} onChange = {textBoxMsgChangeHandle} onKeyPress = {keyPressHandle} placeholder = 'Publish Message'/>
    //     </div>
    // );


    return (
        <Navbar style = {{position : 'sticky' , bottom : '0'}} className="bg-light">
            <Form inline>
                <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">Publish</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    placeholder="Topic"
                    aria-label="Topic"
                    aria-describedby="basic-addon1"
                    value = {publishTopic}
                    onChange = {textBoxTopicChangeHandle}
                />
                </InputGroup>
            </Form>
            <Form inline onSubmit = {onSubmitHandle}>
                <FormControl 
                    type="text" 
                    placeholder="Message" 
                    className="bg-light justify-content-between" 
                    value = {publishMsg}
                    onChange = {textBoxMsgChangeHandle}
                    // onKeyDown = {keyPressHandle}
                    />
                <Button type="submit">Submit</Button>
            </Form>
        </Navbar>
    )
}

export default PublishBar;