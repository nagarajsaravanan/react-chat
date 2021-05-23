const express = require('express');
const app = express();
const http = require("http");
const bodyParser = require('body-parser');
const moment = require('moment');

// Body-parser middleware
// app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())

// middlewares.
const corsMiddleware = require('./middleware/corsMiddleware');
app.use(corsMiddleware);

// create server.
const server = http.createServer(app);
server.listen(5000, () => console.log(`Listening on port 5000`));

// import socket instanse.
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('conneted!!!');
  socket.on('join', data => {
    console.log('data._id',data._id);
    if(data._id){
      socket.join(data._id);
    }
  });
  socket.on('chat', data => {
    console.log('data', data);
    let timestamp = Date.now();
    io.to(data.toId).emit('chat', {...data, timestamp: timestamp, time: moment().format('hh:mm A')});
    io.to(data.fromId).emit('chat', {...data, timestamp: timestamp, time: moment().format('hh:mm A')});
  });
})

app.post("/login", (req, res) => {
  const users = require('./data/users.json')
  let auth = null;
  users.map(u => {
    if (req.body.username === u.username && req.body.password === u.password) {
      let temp = { ...u };
      delete temp.password
      auth = temp;
    }
  })
  auth ? res.status(200).send({ error: false, message: 'logged in successfully', response: auth }) : res.status(401).send({ error: true, message: 'invalid username & passord' });
});

app.get("/users", (req, res) => {
  const users = require('./data/users.json')
  let userData = users.map(u => {
    let temp = { ...u };
    delete temp.password
    return temp;
  })
  userData ? res.status(200).send({ error: false, message: 'data fetched successfully.', response: { users: userData } }) : res.status(404).send({ error: true, message: 'data not found.' });
});