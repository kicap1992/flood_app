//create express from node
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const formData = require('express-form-data');
const cors = require('cors')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require('dotenv/config');


io.on('connection', (socket) => {
  
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('tambah_banjir', (_) => {
    socket.broadcast.emit('tambah_banjir', {
      message : 'Area banjir ditambah pada kecamatan ' + _.kecamatan
    });
  });

  socket.on('edit_banjir', (_) => {
    socket.broadcast.emit('edit_banjir', {
      message : 'Area banjir diubah pada kecamatan ' + _.kecamatan
    });
  })

  socket.on('delete_banjir', (_) => {
    socket.broadcast.emit('delete_banjir', {
      message : 'Area banjir dihapus'
    })
  })

  socket.on('coba2', (_) => {
    console.log(_);
    socket.broadcast.emit('coba2', {
      message : 'Area banjir diubah pada kecamatan ' + _.kecamatan
    });
  });

  
});
//middleware
app.use(formData.parse());
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.options('*', cors())
app.use(cors())

//import routes
const maps_routes = require('./routes/maps_routes');
const area_banjir_routes = require('./routes/area_banjir_routes');

//use routes
app.use('/maps', maps_routes);
app.use('/area_banjir', area_banjir_routes);

//connect to db
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true})
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to db")
})

//if routes not found
app.use((req, res, next) => {
  res.status(404).send('404 not found');
});

//listen to port
server.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
})