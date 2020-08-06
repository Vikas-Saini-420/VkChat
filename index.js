//jshint esversion :6
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));




server.listen(3000);



const rooms ={};
app.get('/' , (req , res) => {
    res.render('index' , {rooms : rooms});
});




app.get('/:room' , (req , res)=>{
    if(rooms[req.params.room] == null)
    {  
        return res.redirect('/');
    }
    res.render('rooms' , {roomName : req.params.room});
});




app.post('/room' , (req  , res) =>{
    if(rooms[req.body.room]!=null )
    {
        return res.redirect('/');
    }
    rooms[req.body.room] = {users :{}};
/*doubt */    res.redirect(req.body.room);

    io.emit('room-created' , req.body.room);
    //send a message that new room was created
});



io.on('connection' , socket =>{    /* io.on is instance of socket.io */
    socket.on('new-user-joined' ,(room,name )=>{  /*socket.on is for a particular connection */
        socket.join(room);
        rooms[room].users[socket.id] = name;
        socket.to(room).broadcast.emit('user-joined', name);  /*send message to other users that this user has joined */
    });

    socket.on("send" , (room , message ) =>{
        socket.to(room).broadcast.emit('recieve' ,{message:message , user : rooms[room].users[socket.id] } ); /* Brodcast the message to everyone */
    });

    socket.on('disconnect' , () =>{
        getAllRooms(socket).forEach(room => {
            socket.to(room).broadcast.emit('leave' , rooms[room].users[socket.id]);
            delete rooms[room].users[socket.id];
        });
    });
});
function getAllRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
      if (room.users[socket.id] != null) names.push(name);
      return names;
    }, []);
  };