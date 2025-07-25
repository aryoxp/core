const fs = require('fs');
const ini = require('ini')

var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8')); 
// console.log(config)

const { createServer } = (config.server.useSSL) ? require("https") : require("http");
const { Server } = require("socket.io");

const mysql = require('mysql2/promise');
const { rejects } = require('assert');
// const { channel } = require('diagnostics_channel');
const dbConnectionParams = {
  host: config.database.host,
  user: config.database.user,
  port: config.database.port,
  password: config.database.password,
  database: config.database.database
}

// const { zlib } = require("zlib");
// const { resolve } = require("path");
// const { rejects } = require("assert");
// const { channel } = require("diagnostics_channel");

class ServerApp {
  constructor() {
    console.log(`Kit-Build collaboration server is listening on port: ${config.server.port} ${config.server.useSSL ? "with" : "without"} SSL.`);
    const options = (config.server.useSSL) ? {
      key: fs.readFileSync(config.server.privkey),
      cert: fs.readFileSync(config.server.cert)
    } : {};
    this.httpServer = createServer(options);
    let ioOptions = Object.assign({}, {
      port: parseInt(config.server.port),
      cors: {
        origin: config.server.corsOrigin,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204
      },
      path: config.server.path
    }); // console.log(ioOptions);
    // if (config?.server?.port?.trim() != "") 
    //   ioOptions.port = config.server.port;
    this.io = new Server(this.httpServer, ioOptions);
    // console.log(this.io);

    this.rooms    = new Map(); // key is room name, value is room data
    this.users    = new Map(); // key is socket ID, value is user data
    this.groups   = new Map(); // key is group room name, value is Map of private room created
    this.chats    = new Map(); // key is room name, value is chat item list
    this.channels = new Map(); // key is room name, value is channel Map, key is node id, value is array of chat item list

    this.cmapio = this.io.of('/cmap')
    this.cmapio.on('connection', socket => ServerApp.handleCmapSocketEvent(this.cmapio, socket))

    this.kbio = this.io.of('/kitbuild')
    this.kbio.on('connection', socket => ServerApp.handleKitBuildSocketEvent(this.kbio, socket))

    // server-side
    this.io.on("connection", (socket) => { 
      // not working, because clients connect to namespaced socket.
      // called only when checking whether collaboration server is online
      console.log("IO CONNECT", socket.id);
      socket.on('disconnecting', (socket) => console.log('IO DISCONNECTING'));
      socket.on('disconnect', (socket) => console.log('IO DISCONNECTED'));
    });

    this.httpServer.listen(config.server.port);
  }
  static async instance(config) {

    try { // test db connection
      const db = await mysql.createConnection(dbConnectionParams);
      console.log("Database connection OK.");
      // const sql = "SELECT 1, ?";
      // const [rows, fields] = await db.query(sql, [2]);
      // console.log("Database query test result:", rows, fields);
      await db.end();
    } catch (err) {
      console.log("Database Error:", err.code);
    }

    ServerApp.inst = new ServerApp(config);
    return ServerApp.inst;
  }


  static handleCmapSocketEvent(io, socket) {
    console.log('CMAP CONNECT', socket.id, socket.rooms)
    socket.on('disconnecting', (reason) => {
      console.log('CMAP DISCONNECTING', socket.id, reason)
      // let user = ServerApp.inst.users.get(socket.id)
      // socket.rooms.forEach(room => {
      //   let roomData = ServerApp.inst.rooms.get(room);
      //   if (user && roomData && roomData.type == "personal") {
      //     socket.in(room).emit('user-leave-room', user, roomData);
      //   }
      // })
    })
    socket.on('disconnect', (reason) => {
      console.log('CMAP DISCONNECT', socket.id, reason)

      // Cleanups users and rooms cache.
      let user = ServerApp.inst.users.get(socket.id)

      if (!user) // if no user, then it is just other passing by
        return

      // broadcast groups left by this user
      if (user.groups) {
        user.groups.forEach(group => {
          let name = `GC/${group}`;
          console.log("DISCONNECT GROUPS:", name);
          let room = {
            name: name,
            socketIds: ServerApp.getSocketsOfRoom(io, name),
            users: ServerApp.getUsersOfRoom(io, name)
          }
          io.emit('user-leave-room', user, room);
        })
      }

      ServerApp.inst.users.delete(socket.id)
      ServerApp.inst.rooms.forEach((roomData, room) => {
        if (!io.adapter.rooms.has(room))
          ServerApp.inst.rooms.delete(room)
      })
      ServerApp.inst.groups.forEach((rooms, group) => {
        if (!io.adapter.rooms.has(group)) {
          ServerApp.inst.groups.delete(group)
          return
        }
        rooms.forEach((room, key) => {
          if (!io.adapter.rooms.has(key)) rooms.delete(key)
        })
      })
      ServerApp.inst.chats.forEach((chats, room) => {
        if (!io.adapter.rooms.has(room))
          ServerApp.inst.chats.delete(room)
      })
      ServerApp.inst.channels.forEach((channel, room) => {
        if (!io.adapter.rooms.has(room))
          ServerApp.inst.channels.delete(room)
      })

      
      // console.log(io.adapter.rooms, io.adapter.sids, ServerApp.inst.rooms)
    })
    socket.on('register-user', (user, callback) => {
      console.log("CMAP REGISTER USER", user?.name, socket.id);
      if (!user || !user.name) {
        if (typeof callback == 'function') 
          callback("Invalid user data.");
        return;
      }
      // extract user's groups
      user.groups = user.groups ? user.groups.split(",") : [];
      user.groups = user.groups.map(g => g.trim());
      ServerApp.inst.users.set(socket.id, user);
      // create and/or join this user group rooms
      for(let groupName of user.groups) {
        // console.log("GR", groupName);
        let name = `GC/${groupName}`;
        let room = {
          name: name,
          type: 'group',
        };
        ServerApp.inst.rooms.set(name, room);
        user = ServerApp.inst.users.get(socket.id);
        user.socketId = socket.id;
        socket.join(name);
        room = Object.assign(room, {
          socketIds: ServerApp.getSocketsOfRoom(io, name),
          users: ServerApp.getUsersOfRoom(io, name)
        }); // console.log(room);
        // broadcast that this user has joined a room
        socket.in(room.name).emit('user-join-room', user, room);
      }
      // console.log(io.adapter.rooms, io.adapter.sids)
      // broadcast that this user has been registered in the system
      let rooms = this.getRoomsOfSocket(io, socket);
      // console.log("user-registered", user, rooms);
      io.emit('user-registered', user, rooms);
      if (typeof callback == 'function') callback(true);
    });
    socket.on('get-registered-user', (callback) => {
      console.log("CMAP GET REGISTERED USER", socket.id);
      let user = ServerApp.inst?.users?.get(socket.id) ?? {};
      user.socketId = socket.id;
      if (typeof callback == 'function') callback(user);
    });
    socket.on('unregister-user', async (user, callback) => {
      console.log("CMAP UNREGISTER USER", user?.name, user?.socketId);
      let socketId = user?.socketId;
      let name = user?.name;
      if (!socketId) {
        console.log('Invalid user'); 
        if (typeof callback == 'function') callback(false, "Invalid user");
        return;
      }
      // console.log("Users", ServerApp.inst?.users);
      let sockets = await io.fetchSockets();
      for (let socket of sockets) {
        if (socket.id == socketId) {
          // console.log(socket.id);
          // console.log(socket.rooms);
          for(const room of socket.rooms) {
            // console.log(room);
            if (room != socket.id && !room.startsWith('GK/')) {
              // console.log("Try leaving room:", room);
              this.leaveRoom(io, socket, room).catch((err) => console.log(err));
              // io.emit('user-leave-room', ServerApp.inst.users.get(socket.id), room);
            }
          }
          ServerApp.inst?.users?.delete(socket.id);
          break;
        }
      }
      // let rooms = ServerApp.getRoomsOfSocket(io, {id: socketId});
      // console.log(rooms);
      // for (let room of rooms) {
      //   console.log(room);
      //   console.log(`User ${name} leaves room: ${room?.name}`)
      //   this.leaveRoom(io, socketId, room?.name).then(result => {
      //     console.log("Leave result:", result);
      //   });
      // }
      
      if (typeof callback == 'function') callback(true);
    });
    socket.on('get-designated-room', async (userid, callback) => {
      console.log("CMAP GET DESIGNATED ROOM", socket.id, userid);
      let room = await Collab.getRoom(userid);
      // console.log(room);
      if (typeof callback == 'function') callback(room);
    });
    socket.on('get-all-clients', (callback) => {
      console.log("CMAP ALL CLIENTS", socket.id);
      // console.log(ServerApp.inst.users);
      io.fetchSockets().then(sockets => {
        let users = [];
        for(let socket of sockets) {
          let user = ServerApp.inst.users.get(socket.id) ?? {};
          user.socketId = socket.id;
          users.push(user);
        };
        if (typeof callback == 'function') callback(users);
      });
    });
    socket.on('get-all-rooms', (callback) => {
      console.log("CMAP REQUEST GET ALL ROOMS", socket.id);
      let roomKeys = Array.from(io.adapter.rooms.keys() ?? []);
      let rooms = [];
      for(let r of roomKeys) {
        let room = {
          name: r,
          socketIds: ServerApp.getSocketsOfRoom(io, r),
          users: ServerApp.getUsersOfRoom(io, r)
        };
        rooms.push(room);
      }
      if (typeof callback == 'function') callback(rooms);
    });
    socket.on('get-room-sockets', (name, callback) => {
      console.log("CMAP GET ROOM SOCKETS", name, socket.id);
      if (!name || name == "null" || name == "undefined" ) {
        if (typeof callback == 'function') callback([]);
        return;
      } 
      let sockets = Array.from(ServerApp.getSocketsOfRoom(io, name) ?? []);
      let users = [];
      for(let socket of sockets) {
        let user = ServerApp.inst.users.get(socket) ?? {};
        user.socketId = socket
        users.push(user);
      };
      // console.log(sockets, users);
      if (typeof callback == 'function') callback(users);
    });
    socket.on('get-rooms-of-socket', (callback) => {
      console.log("GET SOCKET JOINED ROOMS", socket.id)
      let rooms = ServerApp.getRoomsOfSocket(io, socket)
      if (typeof callback == 'function') callback(rooms)
    });
    socket.on('get-rooms-of-groups', (groups, callback) => {
      console.log("GET ROOMS OF GROUPS", groups)
      if (!Array.isArray(groups)) {
        if (typeof callback == 'function') callback(null);
        return
      }
      let rooms = new Map()
      groups.forEach(group => {
        let groupRooms = ServerApp.inst.groups.get(`GC/${group}`)
        // console.log("GCGRRMS", `GC/${group}`, groupRooms);
        if (groupRooms) groupRooms.forEach(groupRoom => {
          let currentRoom = rooms.get(groupRoom.name)
          if (currentRoom) { // previous group also has this toom
            currentRoom.groups.push(group)
            return
          } else {
            let sids = io.adapter.rooms.get(groupRoom.name)
            groupRoom.users = Array.from(sids.values()).map(sid => ServerApp.inst.users.get(sid));
            groupRoom.groups = [group]
            rooms.set(groupRoom.name, groupRoom)
          }
        })
      })
      if (typeof callback == 'function') callback(Array.from(rooms.values()))
      // console.log('GROUPS ROOMS', ServerApp.inst.rooms, rooms);
    });
    socket.on('create-room', (room, callback) => {
      console.log("CREATE (JOIN) ROOM", room)
      if (!room) {
        if (typeof callback == 'function') callback("Invalid room name.");
        return
      }
      room = `PC/${room}`
      // TODO: Check room already exist, created by another group
      console.log("IO has ROOM?", room, io.adapter.rooms.has(room))
      if (io.adapter.rooms.has(room)) {
        if (typeof callback == 'function') 
          callback("The room name is currently being used. Please use another name.")
        return
      }
      ServerApp.joinRoom(io, socket, room).then(callback);
    });
    socket.on('manage-create-room', (room, callback) => {
      console.log("CMAP MANAGE: CREATE ROOM", room);
      if (!room) {
        if (typeof callback == 'function') callback("Invalid room name.");
        return;
      }
      // TODO: Check room already exist, created by another group
      console.log("IO has ROOM?", room, io.adapter.rooms.has(room))
      if (io.adapter.rooms.has(room)) {
        if (typeof callback == 'function') 
          callback("Cannot create room, please use another name.")
        return
      }
      ServerApp.createRoom(io, socket, room).then(callback);
    });
    socket.on('join-room', (room, callback) => {
      if ((!room)) { // || !io.adapter.rooms.has(room)
        if (typeof callback == 'function')
          callback("Invalid room to join.");
        return;
      }
      console.log('CMAP JOIN ROOM', room, socket.id);
      ServerApp.joinRoom(io, socket, room).then(callback);
    })
    socket.on('leave-room', (name, callback) => {
      console.log('CMAP LEAVE ROOM', name, socket.id);
      this.leaveRoom(io, socket, name).then(result => {
        let room = {
          name: name,
          socketIds: ServerApp.getSocketsOfRoom(io, name),
          users: ServerApp.getUsersOfRoom(io, name) 
        };
        // io.emit('user-leave-room', ServerApp.inst.users.get(socket.id), room);
        if (typeof callback == 'function') callback(result ? true : false);
      }).catch((err) => {
        if (typeof callback == 'function') callback(false, err);
      });
    })
    socket.on('invite-user-to-room', (socketId, name, callback) => {
      console.log(`CMAP INVITE USER ${socketId} TO ROOM ${name}`);
      try {
        io.timeout(30000).to(socketId).emit('join-room-request', name, (err, response) => {
          console.log("INVITE RECEIVED", err, response);
          if (response.shift() == true) {
            if (typeof callback == 'function') callback(true);
            io.to(socket.id).emit('join-room-request-received', true);
          } else {
            let message ='Invite user: Peer did not respond on specified time.';
            console.log(message);
            if (typeof callback == 'function') callback(false, message);    
          }
        });
      } catch(err) {
        console.log('Invite user catch: Peer did not respond on specified time.');
        if (typeof callback == 'function') callback(false, err);
      }
      // if (typeof callback == 'function') callback(true);
    });
    socket.on('reject-join-room-request', (room, user, callback) => {
      console.log('CMAP JOIN ROOM REQUEST REJECTED', room, user);
      user.socketId = socket.id;
      io.emit('join-room-request-rejected', room, user);
      if (typeof callback == 'function') callback(true);
    });
    socket.on('let-user-leave-room', (socketId, name, callback) => {
      console.log(`CMAP LET USER ${socketId} LEAVE ROOM ${name}`);
      let socket = io.sockets.get(socketId);
      this.leaveRoom(io, socket, name).then(result => {
        let room = {
          name: name,
          socketIds: ServerApp.getSocketsOfRoom(io, name),
          users: ServerApp.getUsersOfRoom(io, name) 
        };
        // if (result) io.emit('user-leave-room', ServerApp.inst.users.get(socket.id), room);
        if (typeof callback == 'function') callback(result ? true : false);
      }, (e) => {
        if (typeof callback == 'function') callback(false, e);
        console.error(e);
      });
    });  


    socket.on('message', (message, room, callback) => {
      ServerApp.sendMessage(message, socket, room)
        .then(callback).catch(callback)
    })
    socket.on('get-room-messages', (room, callback) => {
      if (typeof callback == 'function')
        callback(ServerApp.inst.chats.get(room))
    })
    socket.on('broadcast', (message, room, callback) => {
      ServerApp.broadcastMessage(message, io, room, callback)
    })

    socket.on('channel-message', (message, room, nodeId, callback) => {
      ServerApp.sendChannelMessage(message, socket, room, nodeId)
        .then(callback).catch(callback)
    })
    socket.on('get-channels-of-room', (room, callback) => {
      console.log("GET CHANNELS ROOM", room)
      ServerApp.getChannelsOfRoom(room)
        .then(channels => callback(channels)).catch(error => callback(error))
    })
    socket.on('get-channel-messages', (room, nodeId, callback) => {
      console.log("GET CHANNEL MESSAGE", room, nodeId)
      if (typeof callback == 'function') {
        let channels = ServerApp.inst.channels.get(room);
        console.log(channels)
        if (channels) {
          let chats = channels.get(nodeId);
          console.log(chats)
          callback(chats ? chats : []);
        }
        callback([]);
      }
      console.log(ServerApp.inst.channels);
    })

    socket.on("command", (room, command, data, callback) => {
      console.log("CMAP COMMAND", room, command, data, socket.id);
      io.in(room).emit('command', command, data);
    });
    socket.on("get-map-state", async (room, callback) => {
      console.log("CMAP GET MAP STATE", room, socket.id);
      if (!room) {
        if (typeof callback == 'function') callback("Invalid room.");
        return;
      }
      let sockets = ServerApp.getSocketsOfRoom(io, room);
      if (!sockets) {
        if (typeof callback == 'function') callback("Unable to get socket list from room.");
        return;
      } 
      let socketsSet = new Set([...Array.from(sockets)]); // console.log(socketsSet);
      socketsSet.delete(socket.id); // remove own socket from list
      socketsSet = Array.from(socketsSet);
      while (socketsSet.length > 0) {
        let sockId = socketsSet.shift();
        // console.log("Try:", sockId, socket.id);
        if (sockId != socket.id) {
          try {
            let response = await new Promise((resolve, reject) => {
              console.log(`Requesting map state from ${sockId}`);
              io.timeout(30000).to(sockId).emit("get-map-state", socket.id, 
                (err, canResponse) => {
                  if (err) reject(err);
                  console.log(`Target ${sockId} can response:`, canResponse);
                  resolve(canResponse?.shift());
              });
            }); // console.log(response);
            if (typeof callback == 'function') {
              if (response == true) { callback(true); return; }
            } else { callback(false); return; } 
          } catch(err) { 
            if (typeof callback == 'function') callback(false, "Unable to get socket list from room.");
          }
        }
        
      }
      callback("Unable to get map state from peer. No peer found.");
      return;
    });
    socket.on("send-map-state", (requesterSocketId, mapState, callback) => {
      console.log("CMAP SEND MAP STATE", requesterSocketId);
      socket.to(requesterSocketId).emit("set-map-state", mapState)
    });
    socket.on("push-map-state", (mapState, room, callback) => {
      console.log("CMAP PUSH MAP STATE", room, socket.id);
      io.in(room).emit('set-map-state', mapState);
    })
    // socket.on('push-mapid', (mapId, room, callback) => {
    //   console.log('CMAP PUSH MAPID', mapId, room);
    //   io.to(room).emit('push-mapid', mapId);
    //   callback(true);
    // });
    // socket.on('push-mapkit', (mapkit, room, callback) => {
    //   console.log('CMAP PUSH MAPKIT', mapkit, room);
    //   io.to(room).emit('push-mapkit', mapkit);
    //   callback(true);
    // });
    // socket.on('load-collabmap', (id, room, callback) => {
    //   console.log('CMAP LOAD COLLABMAP', id, room);
    //   io.to(room).emit('load-collabmap', id);
    //   callback(true);
    // });
  }


  static handleKitBuildSocketEvent(io, socket) {
    console.log('KB CONNECT', socket.id, socket.rooms);
    let rooms = ServerApp.getRoomsOfSocket(io, socket);
    // console.log("ROOMS", rooms, io.adapter.rooms);
    
    io.emit('client-connect', socket.id, rooms);

    socket.on('disconnecting', (reason) => {
      console.log('KB DISCONNECTING', socket.id, reason)
      // let user = ServerApp.inst.users.get(socket.id)
      // socket.rooms.forEach(room => {
      //   let roomData = ServerApp.inst.rooms.get(room) ?? {};
      //   if (user && roomData && roomData.type == "personal") {
      //     socket.in(room).emit('user-leave-room', socket.id, user, roomData);
      //   }
      // })
    });
    socket.on('disconnect', (reason) => {
      console.log('KB DISCONNECT', socket.id, reason);

      // Cleanups users and rooms cache.
      let user = ServerApp.inst.users.get(socket.id);

      io.emit('client-disconnect', socket.id);

      // if no user, then it is just other passing by
      if (!user) return;

      // broadcast groups left by this user
      user.groups.forEach(group => {
        let name = `GK/${group}`;
        console.log("DISCONNECT GROUPS:", name);
        let room = {
          name: name,
          socketIds: ServerApp.getSocketsOfRoom(io, name),
          users: ServerApp.getUsersOfRoom(io, name)
        }
        io.emit('user-leave-room', user, room);
        // io.in(`GK/${group}`).emit('user-leave-room', user, room);
      })

      ServerApp.inst.users.delete(socket.id);
      ServerApp.inst.rooms.forEach((roomData, room) => {
        // console.log(roomData);
        if (roomData.socketIds.includes(socket.id))
          io.emit('user-leave-room', user, roomData);
        if (!io.adapter.rooms.has(room))
          ServerApp.inst.rooms.delete(room);
      });
      ServerApp.inst.groups.forEach((rooms, group) => {
        if (!io.adapter.rooms.has(group)) {
          ServerApp.inst.groups.delete(group);
          return;
        }
        rooms.forEach((room, key) => {
          if (!io.adapter.rooms.has(key)) rooms.delete(key);
        });
      });
      ServerApp.inst.chats.forEach((chats, room) => {
        if (!io.adapter.rooms.has(room))
          ServerApp.inst.chats.delete(room);
      });
      ServerApp.inst.channels.forEach((channel, room) => {
        if (!io.adapter.rooms.has(room))
          ServerApp.inst.channels.delete(room);
      });

      // console.log(io.adapter.rooms, io.adapter.sids, ServerApp.inst.rooms)
    });
    socket.on('register-user', (user, callback) => {
      console.log("KB REGISTER USER", user?.name, socket.id);
      if (!user || !user.name) {
        if (typeof callback == 'function') 
          callback("Invalid user data.");
        return;
      }
      // extract user's groups
      user.groups = user.groups ? user.groups.split(",") : [];
      user.groups = user.groups.map(g => g.trim());
      ServerApp.inst.users.set(socket.id, user);
      // create and/or join this user group rooms
      for(let groupName of user.groups) {
        // console.log("GR", groupName);
        let name = `GK/${groupName}`;
        let room = {
          name: name,
          type: 'group',
        };
        ServerApp.inst.rooms.set(name, room);
        user = ServerApp.inst.users.get(socket.id);
        user.socketId = socket.id;
        socket.join(name);
        room = Object.assign(room, {
          socketIds: ServerApp.getSocketsOfRoom(io, name),
          users: ServerApp.getUsersOfRoom(io, name)
        }); // console.log(room);
        // broadcast that this user has joined a room
        socket.in(room.name).emit('user-join-room', user, room);
      }
      // console.log(io.adapter.rooms, io.adapter.sids)
      // broadcast that this user has been registered in the system
      let rooms = this.getRoomsOfSocket(io, socket);
      // console.log("user-registered", user, rooms);
      io.emit('user-registered', user, rooms);
      if (typeof callback == 'function') callback(true);
    });
    socket.on('get-registered-user', (callback) => {
      console.log("KB GET REGISTERED USER", socket.id);
      let user = ServerApp.inst?.users?.get(socket.id) ?? {};
      user.socketId = socket.id;
      if (typeof callback == 'function') callback(user);
    });
    socket.on('unregister-user', async (user, callback) => {
      console.log("KB UNREGISTER USER", user?.name, user?.socketId);
      let socketId = user?.socketId;
      let name = user?.name;
      if (!socketId) {
        console.log('Invalid user'); 
        if (typeof callback == 'function') callback(false, "Invalid user");
        return;
      }
      // console.log("Users", ServerApp.inst?.users);
      let sockets = await io.fetchSockets();
      for (let socket of sockets) {
        if (socket.id == socketId) {
          // console.log(socket.id);
          // console.log(socket.rooms);
          for(const room of socket.rooms) {
            // console.log(room);
            if (room != socket.id && !room.startsWith('GK/')) {
              // console.log("Try leaving room:", room);
              this.leaveRoom(io, socket, room).catch((err) => console.log(err));
              // io.emit('user-leave-room', ServerApp.inst.users.get(socket.id), room);
            }
          }
          ServerApp.inst?.users?.delete(socket.id);
          break;
        }
      }
      // let rooms = ServerApp.getRoomsOfSocket(io, {id: socketId});
      // console.log(rooms);
      // for (let room of rooms) {
      //   console.log(room);
      //   console.log(`User ${name} leaves room: ${room?.name}`)
      //   this.leaveRoom(io, socketId, room?.name).then(result => {
      //     console.log("Leave result:", result);
      //   });
      // }
      
      if (typeof callback == 'function') callback(true);
    });
    socket.on('get-designated-room', async (userid, callback) => {
      console.log("KB GET DESIGNATED ROOM", socket.id, userid);
      let room = await Collab.getRoom(userid);
      // console.log(room);
      if (typeof callback == 'function') callback(room);
    });
    socket.on('get-all-clients', (callback) => {
      console.log("KB ALL CLIENTS", socket.id);
      // console.log(ServerApp.inst.users);
      io.fetchSockets().then(sockets => {
        let users = [];
        for(let socket of sockets) {
          let user = ServerApp.inst.users.get(socket.id) ?? {};
          user.socketId = socket.id;
          users.push(user);
        };
        if (typeof callback == 'function') callback(users);
      });
    });
    socket.on('get-all-rooms', (callback) => {
      console.log("KB REQUEST GET ALL ROOMS", socket.id);
      let roomKeys = Array.from(io.adapter.rooms.keys() ?? []);
      let rooms = [];
      for(let r of roomKeys) {
        let room = {
          name: r,
          socketIds: ServerApp.getSocketsOfRoom(io, r),
          users: ServerApp.getUsersOfRoom(io, r)
        };
        rooms.push(room);
      }
      if (typeof callback == 'function') callback(rooms);
    });
    socket.on('get-room-sockets', (name, callback) => {
      console.log("KB GET ROOM SOCKETS", name, socket.id);
      if (!name || name == "null" || name == "undefined" ) {
        if (typeof callback == 'function') callback([]);
        return;
      } 
      let sockets = Array.from(ServerApp.getSocketsOfRoom(io, name) ?? []);
      let users = [];
      for(let socket of sockets) {
        let user = ServerApp.inst.users.get(socket) ?? {};
        user.socketId = socket
        users.push(user);
      };
      // console.log(sockets, users);
      if (typeof callback == 'function') callback(users);
    });
    socket.on('get-rooms-of-socket', (callback) => {
      console.log("KB GET ROOMS OF SOCKET", socket.id);
      let rooms = ServerApp.getRoomsOfSocket(io, socket);
      if (typeof callback == 'function') callback(rooms);
    });
    socket.on('get-rooms-of-groups', (groups, callback) => {
      console.log("KB GET ROOMS OF GROUPS", groups)
      if (!Array.isArray(groups)) {
        if (typeof callback == 'function') callback(null);
        return
      }
      let rooms = new Map();
      groups.forEach(group => {
        let groupRooms = ServerApp.inst.groups.get(`GK/${group}`);
        // console.log("GKGRRMS", `GK/${group}`, groupRooms);
        if (groupRooms) groupRooms.forEach(room => {
          let currentRoom = rooms.get(room.name);
          if (currentRoom) { // previous group also has this toom
            currentRoom.groups.push(group);
            return;
          } else {
            let sids = ServerApp.getSocketsOfRoom(io, room.name);
            room.users = Array.from(sids.values())
              .map(sid => ServerApp.inst.users.get(sid));
            room.groups = [group];
            rooms.set(room.name, room);
          }
        })
      })
      if (typeof callback == 'function') 
        callback(Array.from(rooms.values()));
      // console.log('GROUPS ROOMS', ServerApp.inst.rooms, rooms);
    });
    socket.on('create-room', (room, callback) => {
      console.log("KB CREATE (JOIN) ROOM", room);
      if (!room) {
        if (typeof callback == 'function') callback("Invalid room name.");
        return;
      }
      room = `PK/${room}`;
      // TODO: Check room already exist, created by another group
      console.log("IO has ROOM?", room, io.adapter.rooms.has(room));
      if (io.adapter.rooms.has(room)) {
        if (typeof callback == 'function') 
          callback("Cannot create room, please use another name.");
        return;
      }
      ServerApp.joinRoom(io, socket, room).then(callback);
    });
    socket.on('manage-create-room', (room, callback) => {
      console.log("KB MANAGE: CREATE ROOM", room);
      if (!room) {
        if (typeof callback == 'function') callback("Invalid room name.");
        return;
      }
      // TODO: Check room already exist, created by another group
      console.log("IO has ROOM?", room, io.adapter.rooms.has(room))
      if (io.adapter.rooms.has(room)) {
        if (typeof callback == 'function') 
          callback("Cannot create room, please use another name.")
        return
      }
      ServerApp.createRoom(io, socket, room).then(callback);
    });
    socket.on('join-room', (room, callback) => {
      if ((!room)) { // || !io.adapter.rooms.has(room)
        if (typeof callback == 'function')
          callback("Invalid room to join.");
        return;
      }
      console.log('KB JOIN ROOM', room, socket.id);
      ServerApp.joinRoom(io, socket, room).then(callback);
    });
    socket.on('leave-room', (name, callback) => {
      console.log('KB LEAVE ROOM', name, socket.id);
      this.leaveRoom(io, socket, name).then(result => {
        let room = {
          name: name,
          socketIds: ServerApp.getSocketsOfRoom(io, name),
          users: ServerApp.getUsersOfRoom(io, name) 
        };
        // io.emit('user-leave-room', ServerApp.inst.users.get(socket.id), room);
        if (typeof callback == 'function') callback(result ? true : false);
      }).catch((err) => {
        if (typeof callback == 'function') callback(false, err);
      });
    });
    socket.on('invite-user-to-room', (socketId, name, callback) => {
      console.log(`KB INVITE USER ${socketId} TO ROOM ${name}`);
      try {
        io.timeout(30000).to(socketId).emit('join-room-request', name, (err, response) => {
          console.log("INVITE RECEIVED", err, response);
          if (response.shift() == true) {
            if (typeof callback == 'function') callback(true);
            io.to(socket.id).emit('join-room-request-received', true);
          } else {
            let message ='Invite user: Peer did not respond on specified time.';
            console.log(message);
            if (typeof callback == 'function') callback(false, message);    
          }
        });
      } catch(err) {
        console.log('Invite user catch: Peer did not respond on specified time.');
        if (typeof callback == 'function') callback(false, err);
      }
      // if (typeof callback == 'function') callback(true);
    });
    socket.on('reject-join-room-request', (room, user, callback) => {
      console.log('KB JOIN ROOM REQUEST REJECTED', room, user);
      user.socketId = socket.id;
      io.emit('join-room-request-rejected', room, user);
      if (typeof callback == 'function') callback(true);
    });
    socket.on('let-user-leave-room', (socketId, name, callback) => {
      console.log(`KB LET USER ${socketId} LEAVE ROOM ${name}`);
      let socket = io.sockets.get(socketId);
      this.leaveRoom(io, socket, name).then(result => {
        let room = {
          name: name,
          socketIds: ServerApp.getSocketsOfRoom(io, name),
          users: ServerApp.getUsersOfRoom(io, name) 
        };
        // if (result) io.emit('user-leave-room', ServerApp.inst.users.get(socket.id), room);
        if (typeof callback == 'function') callback(result ? true : false);
      }, (e) => {
        if (typeof callback == 'function') callback(false, e);
        console.error(e);
      });
    });


    socket.on('message', (message, room, callback) => {
      ServerApp.sendMessage(message, socket, room)
        .then(callback).catch(callback)
    })
    socket.on('get-room-messages', (room, callback) => {
      if (typeof callback == 'function')
        callback(ServerApp.inst.chats.get(room))
    })
    socket.on('broadcast', (message, room, callback) => {
      ServerApp.broadcastMessage(message, io, room, callback)
    })
    socket.on('channel-message', (message, room, nodeId, callback) => {
      // console.log('KB CHANNEL MESSAGE', message, room, nodeId);
      ServerApp.sendChannelMessage(message, socket, room, nodeId)
        .then(callback).catch(callback)
    })
    socket.on('get-channels-of-room', (room, callback) => {
      // console.log("KB GET CHANNELS ROOM", room);
      ServerApp.getChannelsOfRoom(room)
        .then(channels => callback(channels)).catch(error => callback(error))
    })
    socket.on('get-channel-messages', (room, nodeId, callback) => {
      // console.log("KB GET CHANNEL MESSAGE", room, nodeId);
      if (typeof callback == 'function') {
        let channels = ServerApp.inst.channels.get(room);
        // console.log(channels)
        if (channels) {
          let chats = channels.get(nodeId);
          // console.log(chats)
          callback(chats ? chats : []);
        }
        callback([]);
      }
      // console.log(ServerApp.inst.channels);
    })
    socket.on("command", (room, command, data, callback) => {
      console.log("KB COMMAND", room, command, data, socket.id);
      io.in(room).emit('command', command, data);
    });
    socket.on("get-map-state", async (room, callback) => {
      console.log("KB GET MAP STATE", room, socket.id);
      if (!room) {
        if (typeof callback == 'function') callback("Invalid room.");
        return;
      }
      let sockets = ServerApp.getSocketsOfRoom(io, room);
      if (!sockets) {
        if (typeof callback == 'function') callback("Unable to get socket list from room.");
        return;
      } 
      let socketsSet = new Set([...Array.from(sockets)]); // console.log(socketsSet);
      socketsSet.delete(socket.id); // remove own socket from list
      socketsSet = Array.from(socketsSet);
      while (socketsSet.length > 0) {
        let sockId = socketsSet.shift();
        // console.log("Try:", sockId, socket.id);
        if (sockId != socket.id) {
          try {
            let response = await new Promise((resolve, reject) => {
              console.log(`Requesting map state from ${sockId}`);
              io.timeout(30000).to(sockId).emit("get-map-state", socket.id, 
                (err, canResponse) => {
                  if (err) reject(err);
                  console.log(`Target ${sockId} can response:`, canResponse);
                  resolve(canResponse?.shift());
              });
            }); // console.log(response);
            if (typeof callback == 'function') {
              if (response == true) { callback(true); return; }
            } else { callback(false); return; } 
          } catch(err) { 
            if (typeof callback == 'function') callback(false, "Unable to get socket list from room.");
          }
        }
        
      }
      callback("Unable to get map state from peer. No peer found.");
      return;
    });
    socket.on("send-map-state", (requesterSocketId, mapState, callback) => {
      console.log("KB SEND MAP STATE", requesterSocketId);
      socket.to(requesterSocketId).emit("set-map-state", mapState)
    });
    socket.on('push-mapid', (mapId, room, callback) => {
      console.log('KB PUSH MAPID', mapId, room);
      io.to(room).emit('push-mapid', mapId);
      callback(true);
    });
    socket.on('push-mapkit', (mapkit, room, callback) => {
      console.log('KB PUSH MAPKIT', mapkit, room);
      io.to(room).emit('push-mapkit', mapkit);
      callback(true);
    });
    socket.on('load-collabmap', (id, room, callback) => {
      console.log('KB LOAD COLLABMAP', id, room);
      io.to(room).emit('load-collabmap', id);
      callback(true);
    });
  }
  static getRoomsOfSocket(io, socket) {
    let rooms = [];
    let names = io.adapter.sids.get(socket.id);
    // console.log("GROS", names, socket.id);
    // console.log(socket, names, io.adapter.sids);
    // console.log(io.adapter.sids, socket.id);
    // console.log(ServerApp.inst.rooms);
    for(let name of names ?? []) {
      let room = Object.assign(
        {},
        ServerApp.inst.rooms.get(name), 
        {
          name: name,
          socketIds: ServerApp.getSocketsOfRoom(io, name),
          users: ServerApp.getUsersOfRoom(io, name)
        });
      rooms.push(room);
    }
    // console.log(rooms);
    return rooms;
  }
  static getUsersOfRoom(io, roomName) {
    let users = [];
    let socketIds = ServerApp.getSocketsOfRoom(io, roomName) ?? [];
    socketIds.forEach(socketId => {
      let user = ServerApp.inst.users.get(socketId);
      // console.log("GUOR", roomName, user);
      if (user) users.push(user);
    })
    // console.log("GUOR", roomName, users, ServerApp.inst.users);
    return users;
  }
  static createRoom(io, socket, name) {
    return new Promise((resolve, reject) => {
  
      socket.join(name);  
      let room = { 
        name: name, 
        type: 'personal' 
      };
      ServerApp.inst.rooms.set(name, room);

      let group = `GK/Public`;
          
      // if the group room has not been created in the group ... 
      if (!ServerApp.inst.groups.has(group))
        ServerApp.inst.groups.set(group, new Map());

      let groupRooms = ServerApp.inst.groups.get(group);
      groupRooms.set(name, room);


      room = Object.assign(room, {
        socketIds: ServerApp.getSocketsOfRoom(io, name),
        users: ServerApp.getUsersOfRoom(io, name) 
      });
      let user = ServerApp.inst.users.get(socket.id);
      io.emit('user-join-room', user, room);
      resolve(room);

      // broadcast this new room to all users of the same groups
      // a new room has been created or user has join a room
      // let user = ServerApp.inst.users.get(socket.id);
      // if (user?.groups) {
      //   user.groups.forEach(groupRoom => {
  
      //     let namespace = socket.nsp;
      //     let prefix = namespace.name == '/cmap' ? 'GC' : 'GK'
      //     groupRoom = `${prefix}/${groupRoom}`
          
      //     // if the group room has not been created in the group ... 
      //     if (!ServerApp.inst.groups.has(groupRoom))
      //       ServerApp.inst.groups.set(groupRoom, new Map())
    
      //     let group = ServerApp.inst.groups.get(groupRoom)
      //     group.set(room, roomData)
    
      //     // clean deleted room from group room cache
      //     if (deletedRoom) group.delete(deletedRoom)
    
      //     // io.in: to all sockets in room, including sender
      //     // socket.in: to all sockets in room, excluding sender
      //     let r = ServerApp.inst.rooms.get(room);
      //     r.socketIds = ServerApp.getSocketsOfRoom(io, room);
      //     r.users= ServerApp.getUsersOfRoom(io, room); 

      //     io.in(groupRoom).emit('user-join-room', user, r);
      //   });
      // }
  
      // console.log(callback)
      // returns rooms (and group rooms) joined by this user.
      // let rooms = ServerApp.getRoomsOfSocket(io, socket);
      // console.log(io.adapter.rooms);
      // resolve(rooms);
    });
  }
  static joinRoom(io, socket, room) {
    // this method is used to join PRIVATE/PERSONAL Room Only 
    // console.log("JOIN", socket.id, room);
    return new Promise((resolve, reject) => {
      // Leave previously joined personal room
      let deletedRoom = null;
      for(let socketRoom of ServerApp.getRoomsOfSocket(io, socket)) {
        if (socketRoom.type == 'personal' && socketRoom.name != room) {
          // currentRoom = socketRoom
          socket.leave(socketRoom.name)
          // if no other users in the room, remove it from cache
          if (!io.adapter.rooms.has(socketRoom.name)) {
            ServerApp.inst.rooms.delete(socketRoom.name)
            deletedRoom = socketRoom.name
          }
          // broadcast event to everybody in the room
          // that this user is leaving the room
          let room = {
            name: socketRoom.name,
            socketIds: ServerApp.getSocketsOfRoom(io, socketRoom.name),
            users: ServerApp.getUsersOfRoom(io, socketRoom.name)
          };
          let user = ServerApp.inst.users.get(socket.id);
          io.emit('user-leave-room', user, room);
          // io.in(socketRoom.name).emit('user-leave-room', ServerApp.inst.users.get(socket.id), room);
          console.log("LEAVE", socket?.id, room.name);
          break;
        }
      }
  
      // now, join the room, either create or just join
      socket.join(room);
  
      // cache the room data
      let roomData = { name: room, type: 'personal' };
      ServerApp.inst.rooms.set(room, roomData);
  
      // broadcast this new room to all users of the same groups
      // a new room has been created or user has join a room
      let user = ServerApp.inst.users.get(socket.id);
      if (user?.groups) {
        user.groups.forEach(groupRoom => {
  
          let namespace = socket.nsp;
          let prefix = namespace.name == '/cmap' ? 'GC' : 'GK';
          groupRoom = `${prefix}/${groupRoom}`;
          // if the group room has not been created in the group ... 
          if (!ServerApp.inst.groups.has(groupRoom))
            ServerApp.inst.groups.set(groupRoom, new Map());
    
          let group = ServerApp.inst.groups.get(groupRoom);
          group.set(room, roomData);
    
          // clean deleted room from group room cache
          if (deletedRoom) group.delete(deletedRoom);
    
          // io.in: to all sockets in room, including sender
          // socket.in: to all sockets in room, excluding sender
          let r = ServerApp.inst.rooms.get(room);
          r.socketIds = ServerApp.getSocketsOfRoom(io, room);
          r.users= ServerApp.getUsersOfRoom(io, room); 

          io.in(groupRoom).emit('user-join-room', user, r);
        });
      }
  
      // console.log(callback)
      // returns rooms (and group rooms) joined by this user.
      let rooms = ServerApp.getRoomsOfSocket(io, socket);
      // console.log(io.adapter.rooms);
      resolve(rooms);
    });
  }
  static leaveRoom(io, socket, name) {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject("KB LEAVE ROOM: Socket undefined.");
        return;
      }
      socket?.leave(name);
      // if no other users in the room, remove it from rooms cache
      if (!io.adapter.rooms.has(name)) 
        ServerApp.inst.rooms.delete(name);
      
      ServerApp.inst.groups.forEach((groupRoomMap, groupRoom) => {
        groupRoomMap.forEach((name, roomName) => {
          if (!io.adapter.rooms.has(roomName)) 
            groupRoomMap.delete(roomName);
        })
        if (groupRoomMap.size == 0)
          ServerApp.inst.groups.delete(groupRoom);
        // broadcast event to everybody in the group room
        // so they refresh all published rooms in their group
        // console.log(room);
        let room = {
          name: name,
          socketIds: ServerApp.getSocketsOfRoom(io, name),
          users: ServerApp.getUsersOfRoom(io, name) 
        };
        io.emit('user-leave-room', ServerApp.inst.users.get(socket.id), room);
      });
      resolve(socket);
    });
  }
  static getSocketsOfRoom(io, name) { 
    let socketIds = io.adapter.rooms.get(name);
    return Array.from(socketIds ?? []);
  }

  static sendMessage(message, socket, room) {
    return new Promise((resolve, reject) => {
      if (!socket || !room) { // validate parameters
        reject('Invalid socket or room.');
        return;
      }
      socket.in(room).emit('message', message);
      switch(message.type) {
        case 'text': { // cache the message
          let roomChat = ServerApp.inst.chats.get(room);
          if (roomChat) roomChat.push(message);
          else ServerApp.inst.chats.set(room, [message]);
          let session = message?.session ?? null;
          let channel = null;
          let mapid = message?.mapid ?? null;
          let channelId = null;
          let tstampc = message?.when ?? null;
          let data = message;
          console.log("Message:", room, message?.sender?.name, socket.id, session, message.text, channel, mapid, channelId, tstampc, data);
          L.log(room, message?.sender?.name, socket.id, session, message.text, channel, mapid, channelId, tstampc, data);
          } break;
        default: break;
      }
      
      // L.log(room, sender, socket, session, message, channel, mapid);
      resolve(true);
    })
  }
  static broadcastMessage(message, io, room, callback) {
    if (!socket || !room) { // validate parameters
      if (typeof callback == 'function') 
        callback('Invalid socket or room.');
      return;
    }
    // console.log(message, io, room);
    io.in(room).emit('broadcast', message)
    // console.log(room, sender, socket, session, message, channel, mapid);
    // L.log(room, sender, socket, session, message, channel, mapid);
    let session = '';
    let channel = '';
    let mapid   = '';
    // console.log("Message:", room, message?.sender?.name, io?.socket?.id, session, message.text, channel, mapid);
    // L.log(room, message?.sender?.name, io?.socket?.id, session, message.text, channel, mapid);
    if (typeof callback == 'function') callback(true)
  }
  static getChannelsOfRoom(room) {
    return new Promise((resolve, reject) => {
      let channels = ServerApp.inst.channels.get(room);
      channels = channels && channels.size ? Array.from(channels.keys()) : []
      resolve(channels)
    })
  }
  static sendChannelMessage(message, socket, room, nodeId) {
    // console.log("CHANNEL MESSAGE:", message, socket, room, nodeId);
    return new Promise((resolve, reject) => {
      if (!socket || !room) { // validate parameters
        reject('Invalid socket or room.');
        return;
      }
      socket.in(room).emit('channel-message', message, nodeId);
      switch(message.type) {
        case 'text': { // cache the message
          let channelChats = ServerApp.inst.channels.get(room);
          // console.log(channelChats);
          if (channelChats) {
            let channel = channelChats.get(nodeId);
            if (!channel) channelChats.set(nodeId, [message]);
            else channel.push(message);
          } else {
            let channelMap = new Map([[nodeId, [message]]]);
            ServerApp.inst.channels.set(room, channelMap);
          }
          let session = message?.session ?? null;
          let channel = nodeId;
          let mapid   = message?.mapid ?? null;
          let channelId = nodeId;
          let data = message;
          console.log("Channel message:", room, message?.sender?.name, socket?.id, session, message.text, channel, mapid, channelId, message.when, data);
          L.log(room, message?.sender?.name, socket?.id, session, message.text, channel, mapid, channelId, message.when, data);
          
        } break;
        default: break;
      }
      // console.log("Message:", room, sender, socket, session, message, channel, mapid);
      // L.log(room, sender, socket, session, message, channel, mapid);
      resolve(true);
    });
  }
}

class Utility {
  static decompress(b64string) {
    const zlib = require('zlib');
    var buf = Buffer.from(b64string, 'base64');
    var data = zlib.unzipSync(buf)
    return data
  }

  static compress(data) {
    const zlib = require('zlib');
    var deflated = zlib.gzipSync(data).toString('utf8')
    var base64string = Buffer.from(deflated).toString('base64')
    return base64string
  }
}

class L {
  static log = async (room, sender, socket = null, session = null, message = null, channel = null, mapid = null, channelId = null, tstampc = null, data = null) => {
    try {
      const db = await mysql.createConnection(dbConnectionParams);
      const sql = "INSERT INTO chat (room, sender, socket, session, message, channel, mapid, channelId, tstampc, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const [result] = await db.query(sql, [room, sender, socket, session, message, channel, mapid, channelId, tstampc, data ? JSON.stringify(data) : null]);
      console.log("Chat log:", result?.insertId);
      db.end();
    } catch (err) {
      console.log("Database Error:", err.code);
    }
  }
}

class Collab {
  static getRoom = async (userid) => {
    try {
      const db = await mysql.createConnection(dbConnectionParams);
      const sql = "SELECT room FROM pair WHERE userid = ? ORDER BY id DESC LIMIT 1";
      const [rows, fields] = await db.query(sql, [userid]); // console.log(rows);
      await db.end();
      return rows.length ? rows[0] : null;
    } catch (err) {
      console.log("Database Error:", err.code);
      return [];
    }
  }
}

let server = ServerApp.instance(config);


