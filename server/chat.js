var xss = require('xss');

function chatServer(io) {

	var onlineUsers = {};

	var onlineCount = 0;

	// var channel = [];

	io.on('connection', function(socket){
		console.log('a Dollars member connected');

		socket.on('login', function(obj){

			for(key in onlineUsers) {
				if(onlineUsers.hasOwnProperty(key) && onlineUsers[key] == obj.username){
					io.emit('error', -2);
				} else if (!onlineUsers.hasOwnProperty(obj.userid)) {
					socket.name = obj.userid;
					onlineUsers[obj.userid] = obj.username;
					onlineCount++;
					console.log(obj.username+' connected');
				};
			};

		});
		
		socket.on('joinPub', function(obj){

			// for(key in onlineUsers) {
			// 	if(onlineUsers.hasOwnProperty(key)){
			// 		console.log(onlineUsers[key]);
			// 		console.log(obj.username);
			// 	}
			// };

			io.emit('joinPub', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
			console.log(obj.username+' さんが入室しました');
		});

		socket.on('joinPrv', function(obj){

			// for(key in onlineUsers) {
				// if(onlineUsers.hasOwnProperty(key) && onlineUsers[key] == obj.userto){
					// channelId = Math.round((new Date().getTime()) / Math.random() / 1e6 - 450);
					// channel.push(channelId);
					io.emit('joinPrv', {user: obj});
					console.log(obj.username+' joined a private room');
				// }
			// };

		});
		
		socket.on('disconnect', function(){

			if(onlineUsers.hasOwnProperty(socket.name)) {

				var obj = {userid:socket.name, username:onlineUsers[socket.name]};

				delete onlineUsers[socket.name];

				onlineCount--;
				
				io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
				
				console.log(obj.username + ' さんが退室しました');

				console.log(channel);
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
					io.emit('directMessage', obj);
					console.log(obj.username + '对 ' + obj.userto + ' 说：' + obj.content);
				}
			}
		});
	  
	});
}

module.exports = chatServer;