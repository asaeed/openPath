var app = require('express').createServer();
app.listen(8001);
var webRTC = require('webrtc.io').listen(app);

console.log("Server running on port 8001");

/*
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.htm');
});
*/

webRTC.rtc.on('connect', function(rtc) {
  //Client connected
	console.log("Client Connected " + rtc);
});

webRTC.rtc.on('send answer', function(rtc) {
  //answer sent
	console.log("Send Answer");
});

webRTC.rtc.on('disconnect', function(rtc) {
  //Client disconnect 
	console.log("Client Disconnect");
});

webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});
