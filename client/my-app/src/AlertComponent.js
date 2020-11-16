import React , {useState , useContext, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function AlertComponent({type,header}) {
    const [show, setShow] = useState(true);
    useEffect(() => {
        setShow(true);
    },[header,type])
    if (show && type !== '') {
      return (
        <Alert style = {{position : 'sticky' , top : 0 , zIndex:20}} variant = {type}  onClose={() => setShow(false)} dismissible>
          <Alert.Heading>{header}</Alert.Heading>
          {/* <p>
            Change this and that and try again. Duis mollis, est non commodo
            luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
            Cras mattis consectetur purus sit amet fermentum.
          </p> */}
        </Alert>
      );
    }
    return <dev></dev>;
  }

export default AlertComponent;
