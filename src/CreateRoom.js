import { useEffect } from "react";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { socket } from "./utils/socket";
const CreateRoom = ({ showModal, onHide, setRooms }) => {
    const [roomName, setRoomName] = useState('')
    const [error, setError] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    const validate = () => {
        if (roomName.length > 40) {
            setError(true)
            setErrorMessage('Room name length must be 40 character or lower!')
            return
        }
        if (roomName.length === 0) {
            setError(true)
            setErrorMessage('Room name cannot be empty')
            return
        }
        setError(false)
    }
    useEffect(validate, [roomName])
    const handleChange = (e) => {
        setRoomName(e.target.value)
    }
    const handleCreate = () => {
        if (!error) {
            socket.emit('create-room', roomName, window.localStorage.getItem('username'))
            setRoomName('')
            onHide()
        }
    }
    return (
        <Modal
            show={showModal}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create New Room {error && 'Error'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Room Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter room name" value={roomName} onChange={handleChange} />
                    {error && <Form.Text className="text-danger">
                        {errorMessage}
                    </Form.Text>}

                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button className="c-bg-gradient" onClick={handleCreate} disabled={error}>Create</Button>
            </Modal.Footer>
        </Modal >
    );
}

export default CreateRoom;