class CollabManager {
  constructor(namespace, options) {
    console.log("Collab Manager Initializing...", options);
    this.config = Core.instance().config();
    this.namespace = namespace;
    this.settings = Object.assign({
      host: this.config.get('collabhost'),
      port: this.config.get('collabport'),
      path: this.config.get('collabpath')
    }, options);
    console.log(this.settings);
    this.isReconnect = false;
    this.evtListeners = new Set();
    this.connect();
    this.handleEvent();
  }

  static instance(namespace, options) {
    if (!CollabManager.inst)
      CollabManager.inst = new CollabManager(namespace, options);
    return CollabManager.inst;
  }

  on(what, listener) {
    switch(what) {
      case 'event':
        if (typeof listener == 'function') 
          this.evtListeners.add(listener);
        break;
    }
  }

  off(what, listener) {
    switch(what) {
      case 'event': 
        this.evtListeners.delete(listener);
        break;
    }
  }

  raiseEvent(evt, ...data) {
    for(let callback of this.evtListeners.values()) {
      if (typeof callback == 'function')
        callback(evt, ...data);
    }
  }

  connect() {
    let url = `${this.settings.host}`;
    if (this.settings.port) url += `:${this.settings.port}`; 
    if (this.namespace) url += `/${this.namespace}`; 
    const socket = io(`${url}`, {
      path: this.settings.path
    });
    if (!this.socket) {
      socket.io.on("error", (error) => { // console.warn(error);
        $('#connection-status-reason').html(error);
        if(error == "Error: xhr poll error") socket.io.disconnect();
      });
    }
    this.socket = socket; // console.warn(socket, this.namespace);
    localStorage.debug = '*';
    this.handleSocketEvent(socket);
    // this.broadcastEvent('connect', socket)
  }

  disconnect() {
    let id = this.socket?.id;
    this.socket?.disconnect();
    this.raiseEvent('disconnect', id);
  }

  handleEvent() {

  }

  isConnected() { return this.socket?.connected; }

  handleSocketEvent(socket) {
    socket.onAny((e, ...args) => { console.warn(e, args);
      this.raiseEvent(e, ...args);
    });

    socket.on("connect", () => {
      console.warn("CONNECTED", socket.id);
      this.updateSocketConnectionStatus(socket);
      this.registerUser();
      this.raiseEvent('connect', socket.id);
    });

    socket.io.on("reconnect", (attempt) => {
      console.warn("RECONNECTED", attempt, socket.id);
      this.isReconnect = true;
      this.registerUser();
      this.getAllClientSockets(socket).then(clientIds =>
        this.raiseEvent('clients-updated', clientIds)
      );
    });

    socket.on("disconnect", (reason) => {
      console.warn("DISCONNECTED Socket ID:", socket.id, "Reason:", reason); // undefined
      this.updateSocketConnectionStatus(socket);
      this.isReconnect = false;
      switch(reason) {
        case 'io client disconnect': break; // manual disconnect
        case 'transport close': break; // server crash/stop
      }
      this.getAllClientSockets(socket).then(clientIds =>
        this.raiseEvent('clients-updated', clientIds)
      ).catch(e => console.error(e));
      // this.broadcastEvent('socket-disconnect', socket, reason)
    });

    socket.on("client-connect", (socketId, rooms) => {
      this.getAllClientSockets(socket).then(clientIds =>
        this.raiseEvent('clients-updated', clientIds, rooms)
      );
    });

    socket.on("client-disconnect", (socketId) => {
      this.getAllClientSockets(socket).then(clientIds =>
        this.raiseEvent('clients-updated', clientIds)
      );
    });
    // socket.on("user-registered", (user) => {
    //   this.raiseEvent('user-registered', user);
    // });
    // socket.on("user-leave-room", (user, room) => {
    //   socket.emit("get-room-sockets", )
    // });
  }

  registerUser(name = 'Administrator', groups = 'Public') { // console.warn(name);
    if (!this.socket.connected) {
      console.error('Socket is not connected.');
      return false;
    }
    if (!name.trim()) {
      console.error('Invalid name to register.');
      return false;
    }
    let user = { name: name.trim(), groups: groups }; // groups value is comma-separated
    this.user = user;
    this.socket.emit('register-user', user, status => {
      console.log(`USER REGISTRATION ${user.name} ${status? 'OK': 'NOK'} - Socket ID: ${this.socket.id}`);
      if (status === true) {
        // KitBuildCollab.getRoomsOfSocket(this.socket);
        // KitBuildCollab.getPublishedRoomsOfGroups(user.groups, this.socket);
        // this.broadcastEvent(`socket-${this.isReconnect ? 'reconnect' : 'connect'}`, 
        //   this.socket);
      } else UI.error(`Unable to register user: ${status}`).show();
    });
    
  }

  createRoom(room) {
    return new Promise((resolve, reject) => {
      if(this.socket.connected) {
        this.socket.emit('manage-create-room', room, e => { 
          if (typeof e == 'string') reject(e);
          else resolve(e);
        });
      } else reject('Socket is not connected');
    });
  }

  joinRoom(room) {
    return new Promise((resolve, reject) => {
      if(this.socket.connected) {
        this.socket.emit('join-room', room, e => { console.warn(e);
          resolve(e);
        });
      } else reject('Socket is not connected');
    });
  }

  getAllClientSockets() {
    return new Promise((resolve, reject) => {
      if(this.socket.connected) {
        this.socket.emit('get-all-clients', clientIds => { // console.warn(clientIds);
          resolve(clientIds);
        });
      } else reject('Socket is not connected');
    });
  }

  getAllRooms() {
    return new Promise((resolve, reject) => {
      if(this.socket.connected) {
        this.socket.emit('get-all-rooms', rooms => { // console.warn(rooms);
          resolve(rooms);
        });
      } else reject('Socket is not connected');
    });
  }

  getRoomSockets(room) { // console.warn(room);
    return new Promise((resolve, reject) => {
      if(this.socket.connected) {
        this.socket.emit('get-room-sockets', room, sockets => {
          // console.warn(sockets);
          resolve(sockets);
        });
      } else reject('Socket is not connected');
    });
  }

  getRoomsOfSocket(socketId) {

  }

  updateSocketConnectionStatus(socket) { // console.log(socket);
    if (this.isConnected()) {
      $('.app-navbar .client-status').html(`Connected: <code>${socket.id}</code>`);
      $('#bt-connect').addClass('visually-hidden');
      $('#bt-disconnect').removeClass('visually-hidden');
    } else {
      $('.app-navbar .client-status').html('Disconnected');
      $('#bt-connect').removeClass('visually-hidden');
      $('#bt-disconnect').addClass('visually-hidden');
    }
  }

  inviteUserToRoom(socketId, room) {
    return new Promise((resolve, reject) => {
      if(this.socket.connected) {
        this.socket.emit('invite-user-to-room', socketId, room, 
          result => resolve(result)
        );
      } else reject('Socket is not connected');
    });
  }

  letUserLeaveRoom(socketId, room) {
    return new Promise((resolve, reject) => {
      if(this.socket.connected) {
        this.socket.emit('let-user-leave-room', socketId, room, e => { console.warn(e);
          resolve(e);
        });
      } else reject('Socket is not connected');
    });
  }

  pushMapId(mapId, room) {
    return new Promise((resolve, reject) => {
      if(this.socket.connected) {
        this.socket.emit('push-mapid', mapId, room, e => { console.warn(e);
          resolve(e);
        });
      } else reject('Socket is not connected');
    });
  }

  pushMapkit(mapkit, room) {
    return new Promise((resolve, reject) => {
      if(this.socket.connected) {
        this.socket.emit('push-mapkit', mapkit, room, e => { console.warn(e);
          resolve(e);
        });
      } else reject('Socket is not connected');
    });
  }


}



