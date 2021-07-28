const mongoose = require('mongoose');
mongoose.connect('mongodb://anochat:anochat123@cluster0-shard-00-00.q5hh5.mongodb.net:27017,cluster0-shard-00-01.q5hh5.mongodb.net:27017,cluster0-shard-00-02.q5hh5.mongodb.net:27017/anochat?ssl=true&replicaSet=atlas-43nwiq-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
module.exports = db