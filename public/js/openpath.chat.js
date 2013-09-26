OpenPath = window.OpenPath || {};

OpenPath.chat = {
  /**
  * Creates chat window.
  */
  init :  function(){
    var self = this,
        input = document.getElementById("chatinput");

    input.addEventListener('keydown', function(event) {
        if(input.value != ''){
            var key = event.which || event.keyCode;
            if (key === 13) {
              var message = OpenPath.username + ": " + input.value; 
              //rtc 
              rtc._socket.send(JSON.stringify({
                      "eventName": "chat_msg",
                      "data": {
                        "messages": message,
                        "room": OpenPath.utils.room
                      }
              }));

              self.addToChat(OpenPath.username, input.value);
              input.value = "";
            }
        }
    }, false);

    rtc.on('receive_chat_msg', function(data) {
      console.log("initChat: username = " + OpenPath.username);
      self.addToChat(OpenPath.username, data.messages);
    });
    
    rtc.on('main_video_socketid', function(data) {
      console.log('socketid',data.socketid);
      
    });
  },
  /**
  * Adds user's message to chat window.
  */
  addToChat : function(user, msg) {
    console.log("addToChat("+user+")")
    var chatwindow = document.getElementById('chatwindow');
    var chatmessages = document.getElementById('chatmessages');
    msg = this.sanitize(msg);
    msg = '<li class="user1"><span>'+ user +'</span>: ' + msg + '</li>';
    chatmessages.innerHTML += msg;
    chatwindow.scrollTop = chatwindow.scrollHeight;
  },
  /**
  * Sanitizes user message in chat window.
  */
  sanitize : function (msg) {
    return msg.replace(/</g, '&lt;');
  }

};
  




