import { Row, Col, Image, Form, Button, Container } from 'react-bootstrap';
import landImage from './assets/img/land.svg'
import { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
const Login = () => {
    const [username, setUsername] = useState('')
    const [error, setError] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const history = useHistory()
    const LS = window.localStorage
    useEffect(() => {
        if (username.length > 15) {
            setError(true)
            setErrorMessage('Maximum length of username is 15')
            return
        }
        if (username.length < 3) {
            setError(true)
            setErrorMessage('Minimum length of username is 3')
            return
        }
        setError(false)
    }, [username])
    useEffect(() => {
        if (LS.getItem('username')) history.push('/')
    }, [])
    const handleChange = (e) => {
        setUsername(e.target.value)
    }
    const handleEnter = (e) => {
        if (!error) {
            LS.setItem('username', username)
            LS.setItem('id', Math.random() * 100000)
            history.push('/')
        }
    }
    return (
        <Container >
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={6}>
                    <h1 className="mt-5 mb-3 ">Anochat</h1>
                    <Image src={landImage} fluid className="mb-3" />

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column xs={3} className="label-enter fw-bold">Username: </Form.Label>
                        <Col xs={9}>
                            <Form.Control type="text" className="custom-input" value={username} onChange={(e) => handleChange(e)} />
                            {error && <Form.Text className="text-danger">
                                {errorMessage}
                            </Form.Text>}
                        </Col>
                    </Form.Group>
                    <div className="text-center">
                        <Button className="mt-3 mb-3 c-bg-gradient" size="md" disabled={error} onClick={handleEnter}>Enter</Button>
                    </div>

                </Col>
            </Row>
        </Container >

    );
}

export default Login;