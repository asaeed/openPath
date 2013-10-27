OpenPath = window.OpenPath || {};

OpenPath.chat = {
	/**
	* Creates chat window.
	*/
	init :  function(){
		var self = this,
			input = document.getElementById("chatinput");
			//fill header message
			$('#chat header p.msg').html('Chat')
		

		//hide/show control
		$('#chat .toggler').click(function(){
			if($('#chat').hasClass('open')){
				$('#chat').removeClass('open');
			}else{
				$('#chat').addClass('open');
				$('#chat header p.msg').html('Chat')
			}
		});
		
		//input text
		input.addEventListener('keydown', function(event) {
			if(input.value != ''){
				var key = event.which || event.keyCode;
				if (key === 13) {
					var message = OpenPath.username + ": " + input.value; 
					//rtc 
					rtc._socket.send(
						JSON.stringify({
							"eventName": "chat_msg",
							"data": {
								"messages": message,
								"room": OpenPath.room
							}
						})
					);
					self.addToChat(OpenPath.username, input.value, 'to');
					input.value = "";
				}
			}
		}, false);

		rtc.on('receive_chat_msg', function(data) {
			console.log("receive_chat_msg " , data);
			self.addToChat(OpenPath.username, data.messages,'from');
		});

		rtc.on('main_video_socketid', function(data) {
			console.log('socketid',data.socketid);
		});
	},
	/**
	* Adds user's message to chat window.
	*/
	addToChat : function(user, msg, toFrom) {
		console.log("addToChat("+user+")",msg)
		var chatwindow = document.getElementById('chatwindow');
		var chatmessages = document.getElementById('chatmessages');
		msg = this.sanitize(msg);
		if(toFrom === 'from'){
			var user1 = msg.split(':')[0];
			msg = msg.split(':').slice(1).join(':');
			msg = '<li class="user2"><span>'+ user1 +'</span>: ' + msg + '</li>';

			//fill header message
			if(!$('#chat').hasClass('open')){
				$('#chat header p.msg').html('New Chat from '+user1+'').fadeOut('slow').fadeIn('slow').fadeOut('slow').fadeIn('slow');
			}else{
				$('#chat header p.msg').html('Chat');
			}
			
		}else{
			msg = '<li class="user1"><span>'+ user +'</span>: ' + msg + '</li>';

		}
	
		
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
  




