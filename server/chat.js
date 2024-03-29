import xss from 'xss';

const chatServer = (io) => {
  const onlineUsers = {};
  let onlineCount = 0;

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('login', (obj) => {
      // Initial validation checks
      if (typeof obj !== 'object' || !obj.username || !obj.userid) {
        console.error('Invalid login object');
        return;
      }

      let validate = Object.values(onlineUsers).includes(obj.username);
      console.log(`${obj.username} tries to enable a connection`);

      if (validate) {
        io.emit(`error${obj.userid}`, -2);
      } else if (obj.username.length >= 20) {
        io.emit(`error${obj.userid}`, -1);
      } else if (!onlineUsers.hasOwnProperty(obj.userid)) {
        socket.name = obj.userid;
        onlineUsers[obj.userid] = xss(obj.username);
        onlineCount++;
        console.log(`${obj.username} connected`);
        io.emit('userConnected', { userid: obj.userid, username: xss(obj.username) }); // Emit an event when a user successfully connects
      }

      console.log(onlineUsers);
    });

    socket.on('joinPub', (obj) => {
      if (!obj || !obj.username) {
        console.error('Invalid object for joinPub');
        return;
      }
      io.emit('joinPub', { onlineUsers, onlineCount, user: obj });
      console.log(`${obj.username} joined the public room`);
    });

    socket.on('joinPrv', (obj) => {
      if (!obj || !obj.userto || !obj.username) {
        console.error('Invalid object for joinPrv');
        return;
      }
      if (obj.username === obj.userto) {
        io.emit(`error${obj.userid}`, -3);
      } else {
        if (Object.values(onlineUsers).includes(obj.userto)) {
          io.emit(`joinPrv${obj.userto}${obj.username}`, { user: obj });
          console.log(`${obj.username} joined a private room with ${obj.userto}`);
        }
      }
    });

    socket.on('disconnect', () => {
      if (onlineUsers.hasOwnProperty(socket.name)) {
        const obj = { userid: socket.name, username: onlineUsers[socket.name] };
        delete onlineUsers[socket.name];
        onlineCount--;
        io.emit('logout', { onlineUsers, onlineCount, user: obj });
        console.log(`${obj.username} left`);
      }
    });

    socket.on('message', (obj) => {
      if (!obj || !obj.content || !obj.username) {
        console.error('Invalid message object');
        return;
      }
      obj.content = xss(obj.content);
      io.emit('message', obj);
      console.log(`${obj.username} says: ${obj.content}`);
    });

    socket.on('directMessage', (obj) => {
      if (!obj || !obj.content || !obj.userto || !obj.username) {
        console.error('Invalid direct message object');
        return;
      }
      if (Object.values(onlineUsers).includes(obj.userto)) {
        obj.content = xss(obj.content);
        io.emit(`directMessage${obj.userto}${obj.username}`, obj);
        console.log(`${obj.username} to ${obj.userto}: ${obj.content}`);
      }
    });
  });
};

export default chatServer;
