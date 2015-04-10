$(document).ready(function() {
	eventBind();
	new Chat();
});

function eventBind () {
	$('.chat-broadcast').on('click', function () {
		$('#dollars-options').fadeOut();
		$('#dollars-room').fadeIn();
	});
	$('.chat-privately').on('click', function () {
		$('.chat-select').fadeOut();
		$('.chat-name').fadeIn();
	});


	$('#login-submit').on('click', function () {
		nameSubmit();
	});
	$('#form-name').keydown(function (event) {
		if ( event.which == 13 )
			nameSubmit();
	})

	$('.message-input button').on('click', function () {
		CHAT.submit();
	})
	$('.message-input input').keydown(function (event) {
		if ( event.which == 13 )
			CHAT.submit();
	});


	function nameSubmit() {
		if (CHAT.usernameSubmit() == true) {
			$('#dollars').fadeOut();
			$('#dollars-options').fadeIn();
		} else {
			console.log('error');
		}
	}
}

function Chat() {
	window.CHAT = {
		messageObj: $('#talk'),
		username: null,
		userid: null,
		socket: null,
		logout: function(){
			//this.socket.disconnect();
			location.reload();
		},
		submit: function(){
			var message = $("#message").val();
			if($.trim(message) != ''){
				var obj = {
					userid: this.userid,
					username: this.username,
					content: message
				};
				this.socket.emit('message', obj);
				$("#message").val('');
			}
			return false;
		},
		randomUid: function(){
			// Give Me 450!
			return new Date().getTime() + "" + Math.floor(Math.random() * 12 + 450);
		},
		updateInfo:function(o, action){
			var onlineUsers = o.onlineUsers;
			var onlineCount = o.onlineCount;

			var user = o.user;

			var html = '';
			html += '<div class="message-system">';
			html += '►► ' + user.username;
			html += (action == 'login') ? ' さんが入室しました' : ' さんが退室しました';
			html += '</div>';
			var section = document.createElement('section');
			section.className = 'system';
			section.innerHTML = html;
			this.messageObj.append(section);
			this.scrollToBottom();	
		},
		usernameSubmit:function(){
			var username = $("#form-name").val();

			if(username != ""){
				this.init(username);
				return true;
			}
			return false;
		},
		init:function(username){

			this.userid = this.randomUid();
			this.username = username;
			
			this.scrollToBottom();
			
			this.socket = io();

			this.socket.emit('login', {userid:this.userid, username:this.username});
			
			this.socket.on('login', function(o){
				CHAT.updateInfo(o, 'login');	
			});
			
			this.socket.on('logout', function(o){
				CHAT.updateInfo(o, 'logout');
			});

			this.socket.on('message', function(obj){
				// 保留以后用
				var isMe = (obj.userid == CHAT.userid) ? true : false;

				
				var avatarDiv = '<div class="avatar avatar-setton"></div>';
				var contentTailDiv = '<div class="tail-wrap"></div>'
				var contentDiv = '<div class="content-wrap content-text">'+obj.content+'</div>';
				var usernameDiv = '<div class="username">' + obj.username + '</span>';

				var section = document.createElement('section');

				section.className = 'user';
				section.innerHTML = avatarDiv + contentTailDiv + contentDiv + usernameDiv;

				CHAT.messageObj.append(section);
				CHAT.scrollToBottom();
			});
		},
		scrollToBottom: function () {
			$("body").animate({ scrollTop: $('#talk').height() });
		}
	}
}