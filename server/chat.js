function chatServer(io) {

	var onlineUsers = {};

	var onlineCount = 0;

	io.on('connection', function(socket){
		console.log('a Dollars member connected');
		
		socket.on('login', function(obj){

			socket.name = obj.userid;

			if(!onlineUsers.hasOwnProperty(obj.userid)) {
				onlineUsers[obj.userid] = obj.username;

				onlineCount++;
			}
			
			io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
			console.log(obj.username+' さんが入室しました');
		});
		
		socket.on('disconnect', function(){

			if(onlineUsers.hasOwnProperty(socket.name)) {

				var obj = {userid:socket.name, username:onlineUsers[socket.name]};

				delete onlineUsers[socket.name];

				onlineCount--;
				
				io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
				console.log(obj.username + ' さんが退室しました');
			}
		});
		
		socket.on('message', function(obj){
			io.emit('message', obj);
			console.log(obj.username + '说：' + obj.content);
		});
	  
	});
}

module.exports = chatServer;