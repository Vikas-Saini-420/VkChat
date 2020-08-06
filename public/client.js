//jshint esversion :6
const socket = io('http://localhost:3000');

const form = document.getElementById('send-container');
const inputMessage = document.getElementById('input-message');
const messageContainer = document.querySelector(".container");
const roomCcontainer = document.getElementById('room-container');
if(form!=null)                                                                      //already added 
{
    const name = prompt("enter your name to join");
    appendMessage("you joined the chat" , 'right');
    socket.emit('new-user-joined' ,roomName , name);
    form.addEventListener('submit' , (e)=>{
        e.preventDefault();
        const message = ipmessage.value ;
        appendMessage(`you : ${message}`, 'right');
        socket.emit('send' ,roomName , message);
        ipmessage.value ='';
    });
}


socket.on('room-created' , room =>{

const roomElement = document.createElement('div');
roomElement.innerText = room;
roomElement.classList.add('name');
const roomLink = document.createElement('a');
roomLink.href  = `/${room}` ;
roomLink.innerText="join";
roomCcontainer.append(roomElement);
roomCcontainer.append(roomLink);
});



socket.on('user-joined' , name =>{
    appendMessage( `${name} joined` , 'left');
});


var audio = new Audio('notify.mp3');



socket.on('recieve' , data=>{
    appendMessage( `${data.user} : ${data.message}`, 'left');
});



socket.on('leave' , name =>
{
    appendMessage(`${name} left the chat` , 'left');
});

function appendMessage( message  , pos)
{
    let msgElement = document.createElement('div');
    msgElement.innerText=message;
    msgElement.classList.add('message');
    msgElement.classList.add(pos);
    messageContainer.append(msgElement);
    if(pos==='left')
    {
        audio.play();
    }
}