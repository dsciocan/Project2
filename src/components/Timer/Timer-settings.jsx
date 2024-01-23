import { React, useState, useEffect, createContext, useContext} from "react";
import { Button } from "@mui/material";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import RangeSlider from 'react-bootstrap-range-slider';
import { set } from "date-fns";
import { BreakContext, MinutesContext, StartContext, SecondsContext } from "./Timer";


function Settings(props) {
    const [ workValue, setWorkValue ] = useState(25);
    const [ breakValue, setBreakValue] = useState(5);
    const [ sessionNo, setSessionNo ] = useState(1);
    const [longBreak, setLongBreak] = useState(false);
    const [sessionCounter, setSessionCounter] = useState(0) 
    const [name, setName] = useState()
    const [newSession, setNewSession] = useState(false)
    let sessionId = 0

    const [ minutes, setMinutes] = useContext(MinutesContext)
    const seconds = useContext(SecondsContext);
    const focusMode = useContext(BreakContext)
    const [startTimer, setStartTimer] = useContext(StartContext)


    useEffect(() => {
        if(sessionCounter == 3) {
            setLongBreak(true)
        } else {
            setLongBreak(false)
        }
    }, [sessionCounter])
    
const changeMinutes = (e) => {
        e.preventDefault()
        setMinutes(workValue)
        setNewSession(true)
        sessionId++
        const sessionHistory = JSON.parse(localStorage.getItem('savedSessions')) || [];
        const session = {
            id: sessionId,
            name: name,
            sessions: sessionNo
        }
            sessionHistory.push(session)
            console.log(sessionHistory)
            localStorage.setItem('savedSessions', JSON.stringify(sessionHistory))
    }

useEffect(() => {
        if(focusMode) {
            setMinutes(workValue)
        } else if (longBreak) {
            setMinutes(15)
            setSessionCounter(sessionCounter => sessionCounter + 1)
        } else {
            setMinutes(breakValue)
            setSessionCounter(sessionCounter => sessionCounter + 1)
            console.log(sessionCounter)
            console.log(sessionNo)
        }
}, [focusMode])


    useEffect(() => {
        if(sessionCounter == sessionNo && minutes == 0 && seconds == 0) {
            setStartTimer(false)
            setSessionCounter(0)
            setNewSession(false)
        }
    }, [minutes, focusMode, seconds])


  return (

    <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
            Timer Settings
        </Modal.Title>
      </Modal.Header>
      <Form  onSubmit={changeMinutes}>
      <Modal.Body className="grid-example">
        <Container>
          <Row>
            <Col>
                <Form.Label>Session Name/Summary</Form.Label>
                <Form.Control as="textarea" rows={3} value={name}  onChange={e => setName(e.target.value)}/>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={8}>
            <Form.Label>Work Session Time (minutes)</Form.Label>
            <RangeSlider min={20} max={30} value={workValue}  onChange={e => setWorkValue(e.target.value)} tooltip='auto'/>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={8}>
            <Form.Label>Break Time (minutes)</Form.Label>
            <RangeSlider min={3} max={7} value={breakValue}  onChange={e => setBreakValue(e.target.value)} tooltip='auto'/>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={8}>
            <Form.Label>Number of Sessions</Form.Label>
            <RangeSlider min={1} max={4} value={sessionNo}  onChange={e => setSessionNo(e.target.value)} tooltip='auto'/>
            </Col>
            <Col xs={12} md={4}>
                {sessionNo == 4 ? <p>15 minute break included</p> : <p></p>}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="contained" type="submit" onClick={props.onHide}>
             Save
          </Button>
        <Button variant="contained" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
      </Form >
    </Modal>
  );
}


export default Settings