import { useState } from 'react';
import { Container, Navbar, Button, Row, Col, ListGroup, Card, Form } from 'react-bootstrap';
import CreateRoom from './CreateRoom';
import { useHistory } from 'react-router';
import { useEffect } from 'react';
import { socket } from './utils/socket';
const Home = () => {
    const [showModal, setShowModal] = useState(false)
    const [userCount, setUserCount] = useState(1)
    const [rooms, setRooms] = useState([])
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState([])
    const history = useHistory()

    const LS = window.localStorage
    const handleRoom = (id) => {
        history.push(`/room/${id}`)
    }
    const username = LS.getItem('username')
    useEffect(() => {
        if (username == null) {
            history.push('/login')
        }
        socket.emit('request-usercounts-and-rooms', (count, rooms) => {
            setRooms(rooms)
            setFilter(rooms)
        })
    }, [])

    socket.on('new-room', (rooms) => {
        setRooms(rooms)
    })
    socket.on('new-user', (count) => {
        setUserCount(count)
    })


    useEffect(() => {
        setFilter(rooms.filter(e => e.name.toLowerCase().includes(search)))
    }, [search, rooms])
    const handleSearch = (e) => {
        setSearch(e.target.value)

    }
    const handleLogout = () => {
        LS.removeItem('username')
        history.push('/login')
    }
    return (
        <div >
            <Navbar expand="lg" variant="dark" className="c-bg-gradient">
                <Container>
                    {username &&
                        <Navbar.Brand className="fw-bold">
                            {(username.length > 15) ? username.slice(0, 15) + '...' : username}
                        </Navbar.Brand>
                    }
                    <Navbar.Text>
                        <Button variant="text" className="text-white" onClick={handleLogout}>Logout</Button>
                    </Navbar.Text>
                </Container>
            </Navbar>
            <Container>
                <Row>
                    <Col md={9} className="p-3">
                        <Card className="p-3">
                            <div className="mt-3">{rooms.length} Rooms {userCount} User<span className="float-end"><Button className="c-bg-gradient border-0" size="sm" onClick={() => setShowModal(true)}>Create Room</Button></span></div>
                            {rooms.length > 0 && filter.map(el => {
                                return (<ListGroup className="mt-3" key={el._id}>
                                    <ListGroup.Item action onClick={() => handleRoom(el._id)}>{el.name} <span className="float-end">{el.creator}</span></ListGroup.Item>
                                </ListGroup>)
                            })

                            }
                            {rooms.length === 0 && <div className="mt-3 text-muted text-center" >There is no room available. Click "Create Room" to create new room.</div>}
                        </Card>
                    </Col>
                    <Col md={{ span: 3, order: 'last' }} xs={{ order: 'first' }} className="p-3">
                        <Card className="p-3">
                            <h3>Search</h3>
                            <Form.Group className="mt-3">
                                <Form.Control type="text" placeholder="Find room" onChange={(e) => handleSearch(e)} value={search} />
                            </Form.Group>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <CreateRoom showModal={showModal} onHide={() => setShowModal(false)} setRooms={setRooms} />
        </div>
    );
}

export default Home;