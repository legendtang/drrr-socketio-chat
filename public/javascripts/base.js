$(document).ready(function() {
	eventBind();
	new Chat();
});

function eventBind () {
	$('#login-submit').on('click', function () {
		if (CHAT.usernameSubmit() == true) {
			$('#dollars').fadeOut();
			$('#dollars-options').fadeIn();
		} else {
			console.log('error');
		}
	})
	$('.chat-broadcast').on('click', function () {
		$('#dollars-options').fadeOut();
		$('#dollars-room').fadeIn();
	})
	$('.chat-privately').on('click', function () {
		$('.chat-select').fadeOut();
		$('.chat-name').fadeIn();
	})
}

function Chat() {
	window.CHAT = {
		messageObj: $('.talk'),
		username: null,
		userid: null,
		socket: null,
		logout: function(){
			//this.socket.disconnect();
			location.reload();
		},
		submit: function(){
			var message = $("#message").val();
			if(message != ''){
				var obj = {
					userid: this.userid,
					username: this.username,
					content: content
				};
				this.socket.emit('message', obj);
				$("message").val('');
			}
			return false;
		},
		randomUid: function(){
			return new Date().getTime() + "" + Math.floor(Math.random() * 12 + 450);
		},
		updateInfo:function(o, action){
			var onlineUsers = o.onlineUsers;
			var onlineCount = o.onlineCount;

			var user = o.user;

			var html = '';
			html += '<div class="msg-system">';
			html += user.username;
			html += (action == 'login') ? ' 加入了聊天室' : ' 退出了聊天室';
			html += '</div>';
			var section = document.createElement('section');
			section.className = 'system';
			section.innerHTML = html;
			this.messageObj.append(section);	
		},
		usernameSubmit:function(){
			var username = $("form-name").value;
			if(username != ""){
				this.init(username);
				return true;
			}
			return false;
		},
		init:function(username){

			this.userid = this.randomUid();
			this.username = username;
			
			// console.log(messageObj)
			// this.messageObj.style.minHeight = (this.screenheight - document.body.clientHeight + this.messageObj.clientHeight) + "px";
			// this.scrollToBottom();
			
			this.socket = io();

			this.socket.emit('login', {userid:this.userid, username:this.username});
			
			this.socket.on('login', function(o){
				CHAT.updateInfo(o, 'login');	
			});
			
			this.socket.on('logout', function(o){
				CHAT.updateInfo(o, 'logout');
			});

			this.socket.on('message', function(obj){
				var isme = (obj.userid == CHAT.userid) ? true : false;
				var contentDiv = '<div>'+obj.content+'</div>';
				var usernameDiv = '<span>'+obj.username+'</span>';
				
				var section = document.createElement('section');
				if(isme){
					section.className = 'user';
					section.innerHTML = contentDiv + usernameDiv;
				} else {
					section.className = 'service';
					section.innerHTML = usernameDiv + contentDiv;
				}
				CHAT.messageObj.append(section);
			});

		}
	}
}