import { useState } from "react";
import { useEffect } from "react";
import { Container, Navbar, Button, Card, InputGroup, FormControl } from "react-bootstrap";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { socket } from "./utils/socket";

const Room = () => {
    const { id } = useParams()
    const [messages, setMessages] = useState()
    const [message, setMessage] = useState('')
    const [room, setRoom] = useState()
    const history = useHistory()
    const LS = window.localStorage
    const userId = LS.getItem('id')
    const username = LS.getItem('username')

    useEffect(() => {

        if (!LS.getItem('username')) {
            return history.push('/login')
        }
        socket.emit('join-room', { id: id, username: username, userId: userId }, (x) => {
            if (!x) {
                return history.push('/')
            }
            setMessages(x.messages)
            setRoom(x)

        })

    }, [])
    const handleChange = (e) => {
        setMessage(e.target.value)
    }
    const handleSend = () => {
        let data = {
            message: message,
            user: { id: userId, name: username }
        }
        socket.emit('send-message', data, id)
        setMessage('')
    }
    const handleLeave = () => {
        socket.emit('leave-room', { id: id, username: username, userId: userId }, () => {
            history.push('/')
        })

    }
    useEffect(() => {
        socket.on('new-message', data => {
            setMessages(messages => [...messages, data])
        })
    }, [socket])


    return (
        <div className="h-100">
            <Navbar variant="dark" className="c-bg-gradient">
                <Container>
                    {room && <Navbar.Brand className="fw-bold">
                        {room.name}
                    </Navbar.Brand>}
                    <Navbar.Text>
                        <Button variant="text" className="text-white" onClick={handleLeave}>Leave</Button>
                    </Navbar.Text>
                </Container>
            </Navbar>
            <Container fluid>
                <Card className="room scroll-chat p-3">
                    {messages && messages.map(el => {
                        if (el.user.id == userId) {
                            return (
                                <div className="d-flex justify-content-end mb-2" key={el._id}>
                                    <div className="chat">
                                        <div className="chat-message border border-2 d-inline-block p-1 rounded-3">{el.message}</div>
                                    </div>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className="chat mb-2" key={el._id}>
                                    <div className="chat-name mb-1 text-info">{el.user.name}</div>
                                    <div className="chat-message border border-2 d-inline-block p-1 rounded-3">{el.message}</div>
                                </div>
                            )
                        }
                    })}
                </Card>
                <div className="mt-3">
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Type a message"
                            value={message}
                            onChange={handleChange}
                        />
                        <Button variant="success" onClick={handleSend} disabled={message.length === 0}>
                            Send
                        </Button>
                    </InputGroup>
                </div>
            </Container>
        </div>

    );
}

export default Room;