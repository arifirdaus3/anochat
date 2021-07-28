const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const db = require('./db')
const Rooms = require('./model/Rooms')
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    server.listen(8000, () => {
        console.log('Connected');
    });
});



io.on('connection', async (socket) => {
    io.emit('new-user', io.engine.clientsCount)
    socket.on('request-usercounts-and-rooms', async (cb) => {
        let rooms = await Rooms.find({})
        cb(io.engine.clientsCount, rooms)
    })
    socket.on('create-room', async (roomName, username) => {
        await Rooms.create({ name: roomName, creator: username, messages: [], participant: [] })
        let rooms = await Rooms.find({})
        io.emit('new-room', rooms)
    })
    socket.on('join-room', async (data, cb) => {
        let room = await Rooms.findById(data.id)
        if (room) {
            if (room.participant.filter(el => el.id == data.userId).length == 0) {
                room.participant.push({ username: data.username, id: data.userId })
                room.save()
            }
            socket.join(`room-${data.id}`)
        }
        cb(room)
    })
    socket.on('leave-room', async (data, cb) => {
        socket.leave(`room-${data.id}`)
        let room = await Rooms.findById(data.id)
        room.participant = room.participant.filter(el => el.id !== data.userId)
        await room.save()
        if (room.participant.length === 0) {
            await room.remove()
        }
        cb()
    })
    socket.on('send-message', async (data, id) => {
        let room = await Rooms.findById(id)
        room.messages.push(data)
        room = await room.save()
        io.to(`room-${id}`).emit('new-message', room.messages[room.messages.length - 1])
    })
});


