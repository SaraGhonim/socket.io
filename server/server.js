const express = require ('express');
const app =express();

const server = require('http').createServer(app);


var clients = {};
var users = {};
var chatId = 1;

var messages=[
  
{_id: 1 ,  text: 'Hello Sara',           createdAt:new Date(), user:{_id:2, name:'yara'}},
{_id: 2 ,  text: 'How can I help you',   createdAt:new Date(), user:{_id:2, name:'yara'}},
{_id: 3 ,  text: 'thank you',createdAt:new Date(), user:{_id:2, name:'yara'}}
];

const socketio = require('socket.io')(server);
socketio.on('connection', socket => {
  clients[socket.id] = socket;
  socket.on('message', (message) => onMessageReceived(message, socket));

});


// function onUserJoined(userId, socket) {
//     try {
//       // The userId is null for new users.
//       console.log('ccccccccc')
//       if (!userId) {
//           socket.emit('userJoined', 2);
//           users[socket.id] = 2;
        
//       } else {
//         users[socket.id] = userId;
//       }
//     } catch(err) {
//       console.err(err);
//     }
//   }
  function onMessageReceived(message, senderSocket) {
    console.log('bbbbbbbbbb')

    var userId = users[senderSocket.id];
    // Safety check.
    if (!userId) return;
  console.log('bbbbbbbbbb')
    _sendAndSaveMessage(message, senderSocket);
  }

  function _sendAndSaveMessage(message, socket, fromServer) {
     
  
    messages[messages.length]={
        text: message.text,
        user: message.user,
        createdAt: new Date(message.createdAt),
        
      };

      socketio.emit('message', messages[messages.length-1]);
      console.log(messages[messages.length-1]);

  }

  var stdin = process.openStdin();
stdin.addListener('data', function(d) {
  _sendAndSaveMessage({
    text: d.toString().trim(),
    createdAt: new Date(),
    user: { _id: 'robot' }
  }, null /* no socket */, true /* send from server */);
});

app.get('/',(req,res)=>{
    res.send(messages)  ;  
    
});
app.get('/api/msg',(req,res)=>{
    res.send('it is working')  ;  
});

server.listen(3000, () => console.log('listening on port 3000'));
