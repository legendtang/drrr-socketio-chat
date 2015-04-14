var xss = require('xss');
// var Sse4Crc32 = require("sse4_crc32");

function chatServer(io) {

	var onlineUsers = {};

	var onlineCount = 0;

	// var crc = Sse4Crc32.calculate("my string");

	// console.log(crc);

	// var channel = [];

	io.on('connection', function(socket){
		console.log('a Dollars member connected');

		socket.on('login', function(obj){

			var validate = 0;

			console.log(obj.username + ' trys to enable a connection ')

			for(key in onlineUsers) {
				if(onlineUsers.hasOwnProperty(key) && onlineUsers[key] == obj.username){
					validate = 1;
				}
			};

			console.log(validate);

			if(validate){
				io.emit('error' + obj.userid, -2);
			} else if (!onlineUsers.hasOwnProperty(obj.userid)) {
				socket.name = obj.userid;
				onlineUsers[obj.userid] = obj.username;
				onlineCount++;
				console.log(obj.username + ' connected');
			};

			console.log(onlineUsers);
		});
		
		socket.on('joinPub', function(obj){

			io.emit('joinPub', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
			console.log(obj.username+' さんが入室しました');
		});

		socket.on('joinPrv', function(obj){

			if (obj.username == obj.userto) {
				io.emit('error' + obj.userid, -3);
			} else {
				for(key in onlineUsers) {
					if(onlineUsers.hasOwnProperty(key) && onlineUsers[key] == obj.userto){
						io.emit('joinPrv' + obj.userto + obj.username, {user: obj});
						console.log(obj.username+' joined a private room');
					}
				};
			}

		});
		
		socket.on('disconnect', function(){

			if(onlineUsers.hasOwnProperty(socket.name)) {

				var obj = {userid:socket.name, username:onlineUsers[socket.name]};

				delete onlineUsers[socket.name];

				onlineCount--;
				
				io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
				
				console.log(obj.username + ' さんが退室しました');

				// console.log(channel);
			}

		});
		
		socket.on('message', function(obj){
			obj.content = xss(obj.content);
			io.emit('message', obj);
			console.log(obj.username + '说：' + obj.content);
		});

		socket.on('directMessage', function(obj){

			for(key in onlineUsers) {
				if(onlineUsers.hasOwnProperty(key) && onlineUsers[key] == obj.userto){
					obj.content = xss(obj.content);
					io.emit('directMessage' + obj.userto + obj.username, obj);
					console.log(obj.username + '对 ' + obj.userto + ' 说：' + obj.content);
				}
			}
		});
	  
	});
}

module.exports = chatServer;