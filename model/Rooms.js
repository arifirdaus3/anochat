const mongoose = require('mongoose');
const RoomsSchema = new mongoose.Schema({
    name: String,
    creator: String,
    messages: [
        {
            message: String,
            user: {
                name: String,
                id: String
            }
        }
    ],
    participant: [{ username: String, id: String }]
});
const Rooms = mongoose.model('Room', RoomsSchema)
module.exports = Rooms