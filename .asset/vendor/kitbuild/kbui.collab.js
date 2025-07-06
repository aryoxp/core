class KitBuildCollab {
  constructor(namespace, canvas, options) {
    this.namespace = namespace;
    this.canvas = canvas;
    this.settings = Object.assign({
      host: 'http://localhost',
      port: 3000,
      path: '',
      listener: null
    }, options);

    console.warn("Collab instance initialized", this.settings);

    this.data = new Map();
    this.data.set('session', this.settings.session?.id ?? null);

    this.eventListeners = new Set();
    this.user = null;

    KitBuildCollab.render();
    KitBuildCollab.enableControl(false);
    // cache for currently joined rooms: [{name, type},...]
    KitBuildCollab.rooms = new Map();
    KitBuildCollab.publishedRooms = new Map();
    KitBuildCollab.typingTimeout = new Map();
    KitBuildCollab.unreadChannelMessageCount  = 0;

    // if (!this.user) {
    //   console.error('Collaboration control does not have user information set.');
    //   return;
    // }

    this.tools = new Map();
    
    this.tools.set('chat', new CollabChatTool(this));
    this.tools.set('channel', new CollabChannelTool(this));

    // Append tools and render
    this.tools.forEach(tool => {
      let toolHtml = tool.render();
      $(toolHtml).insertAfter("#dd-connection-menu");
      tool.handleUIEvent()
    });

    this.handleUIEvent();
    this.on('event', this.onCollabEvent.bind(this));
    if (this.settings.listener) this.on('event', this.settings.listener);
    
    KitBuildCollab.isServerOnline(this.namespace, this.settings).then(result => {}, error => {});
    KitBuildCollab.updateSocketConnectionStatus(this.socket);
    // KitBuildCollab.handleRefresh(this);
  }
  static async instance(namespace, user, canvas, options) {
    return new KitBuildCollab(namespace, user, canvas, options)
  }

  static isServerOnline(namespace = '', options) {
    // console.error("CHECK SERVICE ONLINE");
    let settings = Object.assign({
      host: 'http://localhost',
      port: 3000,
      path: ''
    }, options); // console.log(settings);
    return new Promise((resolve, reject) => {
      let url = `${settings.host}`;
      if (settings.port) url += `:${settings.port}`; 
      if (namespace) url += `/${namespace}`; 
      const checkSocket = io(`${url}`, {
        reconnection: false,
        path: settings.path
      }); // console.log(checkSocket);
      // online at mgm.ub.ac.id
      // const checkSocket = io('https://mgm.ub.ac.id/kitbuild', {
      //   reconnection: false,
      //   path: '/sio'
      // });
      checkSocket.on("connect_error", (error) => {
        console.error(error);
        checkSocket.disconnect();
        $('#server-connection').addClass('bg-danger')
        .removeClass('bg-warning bg-success');
        $('#server-status-text').html('Server is offline');
        $('#server-status-reason').html(error);
      });
      checkSocket.on("disconnect", () => 
        console.warn(`Check socket disconnected.`));
      checkSocket.on("connect", () => {
        console.warn(`Server is ONLINE, socket ID: ${checkSocket.id}`);
        $('#server-status-text').html('Server is online');
        $('#server-status-reason').html('');
        $('#server-connection').addClass('bg-success')
          .removeClass('bg-danger bg-warning');
        checkSocket.disconnect();
        resolve(true);
      });
    })
  }

  isConnected() {
    return this.socket && this.socket.connected
  }

  connect() {

    // console.log(this.socket?.active, this.socket);

    this.socket?.disconnect();

    if(!this.socket || !this.socket.active) {
      let url = `${this.settings.host}`;
      if (this.settings.port) url += `:${this.settings.port}`; 
      if (this.namespace) url += `/${this.namespace}`; 
      const socket = io(`${url}`, {
        path: this.settings.path
      });
      // online at mgm.ub.ac.id
      // const socket = io(`https://mgm.ub.ac.id/kitbuild`, {path:'/sio'});
      
      socket.io.reconnection(true);
      // console.error(socket, socket.io, socket.io.reconnection());
      socket.on('connect_error', (e) => {
        $('#server-connection').addClass('bg-danger')
          .removeClass('bg-warning bg-success');
        $('#server-status-text').html('Server is offline');
        $('#server-status-reason').html(e);
        console.error(e);
      });
      socket.io.on('reconnect_attempt', (e) => {
        console.warn('attempt to reconnect');
        $('#server-connection').addClass('bg-warning')
        .removeClass('bg-danger bg-success');
        $('#server-status-text').html('Reconnecting...');
        $('#server-status-reason').html('');
      });
      this.socket = socket; // console.warn(socket, this.namespace);
      localStorage.debug = '*';
      this.handleSocketEvent(socket);
      this.broadcastEvent('connect', socket);
    }
  }

  disconnect() {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
      this.broadcastEvent('disconnect');
    }
  }

  handleSocketEvent(socket) {

    socket.onAny((e, ...args) => { 
      
      if (e == 'message' && args[0]?.type == 'typing') {} 
      else console.warn("Socket event:", e, args);

      switch(e) {
        case 'join-room-request': { // this case requires callback
          let room = args.shift();
          let callback = args.shift();
          this.broadcastEvent(e, room);
          if (typeof callback == 'function') callback(true);
        } break;
        case 'push-mapid': {
          let mapid = args.shift();
          this.broadcastEvent(e, mapid);
        } break;
        case 'push-mapkit': {
          let mapkit = args.shift();
          this.broadcastEvent(e, mapkit);
        } break;
        case 'user-registered': {
          let user = args.shift();
          // updates only when registering self
          if (socket.id == user?.socketId) {
            KitBuildCollab.updateRegisterStatus(user);
            UI.success('Registered successfully.').show();
          }
        } break;
      }
    });

    socket.on("connect", () => {
      console.warn("Connected socketId:", socket.id);
      KitBuildCollab.updateSocketConnectionStatus(socket);
      // KitBuildCollab.isServerOnline(this.namespace, this.settings);
      this.broadcastEvent(this.isReconnect ? 'reconnected' : 'connected', socket);
    });

    socket.io.on("reconnect", (attempt) => {
      console.warn(`Reconnected at attempt:`, attempt);
      // KitBuildCollab.isServerOnline(this.namespace, this.settings);
      this.isReconnect = true;
    });

    socket.on("disconnect", (reason) => {
      console.warn("DISCONNECTED Socket ID:", socket.id, "Reason:", reason); // undefined
      KitBuildCollab.updateSocketConnectionStatus(socket);
      KitBuildCollab.updateRegisterStatus();
      KitBuildCollab.isServerOnline(this.namespace, this.settings);
      this.isReconnect = false;
      switch(reason) {
        case 'io client disconnect': break; // manual disconnect
        case 'transport close': break; // server crash/stop
      }
      this.broadcastEvent('socket-disconnect', socket, reason)
    });

    socket.on("user-join-room", (user, room) => {
      if (!user) return;
      KitBuildCollab.getPublishedRoomsOfGroups(user.groups, socket);
      KitBuildCollab.getRoomsOfSocket(socket);
      this.broadcastEvent('socket-user-join-room', user, room)
    });

    socket.on("user-leave-room", (user, room) => {
      if (!user) return;
      KitBuildCollab.getPublishedRoomsOfGroups(user.groups, socket);
      KitBuildCollab.getRoomsOfSocket(socket);
      if (user?.socketId == socket.id)
        this.broadcastEvent('socket-user-leave-room', user, room);
    });

    socket.on("command", (command, compressedData) => {
      let data = Core.decompress(compressedData);
      this.broadcastEvent('socket-command', command, ...data)
      switch(command) {
        case 'update-concept':
        case 'update-link':
        case 'redo-update-link':
        case 'redo-update-concept':
        case 'undo-update-link':
        case 'undo-update-concept':
          // something happened to a particular node, then...
          KitBuildCollab.updateChannelList(this.canvas)
          break;
      }
    });

    socket.on("get-map-state", (requesterSocketId, callback) => {
      if (typeof callback == "function") callback(true);
      this.broadcastEvent('socket-get-map-state', requesterSocketId)
    });

    socket.on("set-map-state", (mapState) => {
      this.broadcastEvent('socket-set-map-state', mapState)
    });

    socket.on("load-collabmap", (id) => {
      this.broadcastEvent('load-collabmap', id);
    });
  }



  on(what, listener) {
    switch(what) {
      case 'event': this.eventListeners.add(listener); break;
    }
    return this;
  }

  off(what, listener = null) {
    switch(what) {
      case 'event': {
        if (listener === null) this.eventListeners.clear();
        else this.eventListeners.delete(listener);
      } break;
    }
    return this;
  }

  addTool(id, tool) {
    this.tools.set(id, tool)
  }
  removeTool(id) {
    this.tools.delete(id)
  }

  registerUser(name, groups = 'Public') { // console.warn(name);
    console.warn("Registering user", name, 'to Groups:', groups);
    return new Promise((res, rej) => {
      if (!this.socket || !this.socket?.connected) {
        console.error('Socket is not connected.');
        rej('Socket is not connected.'); // return false;
      }
      if (!name.trim()) {
        console.error('Invalid name to register.');
        rej('Invalid name to register.'); // return false;
      }
      let user = { name: name.trim(), groups: groups }; // groups value is comma-separated
      this.user = user;
      this.socket.emit('register-user', user, status => {
        console.warn(`User registration: "${user.name}" Status: ${status? 'OK': 'NOK'}`, `Socket ID:`, this.socket.id);
        window.localStorage.setItem(`collab-${this.namespace}-collabid`, name);
        window.localStorage.setItem(`collab-${this.namespace}-collabname`, name.split("/")[1] ?? name);
        if (status === true) {
          res(user);
          KitBuildCollab.getRoomsOfSocket(this.socket);
          KitBuildCollab.getPublishedRoomsOfGroups(user.groups, this.socket);
          this.broadcastEvent(`socket-${this.isReconnect ? 'reconnect' : 'connect'}`, 
            this.socket);
        } else {
          UI.error(`Unable to register user: ${status}`).show();
          rej(`Unable to register user: ${status}`);
        }
      });
    });
  }
  async registerUserGroup(name, groups = 'Public') { // console.warn(name);
    console.warn("Registering user", name, 'to Groups:', groups);
    return new Promise((res, rej) => {
      if (!this.socket.connected) {
        console.error('Socket is not connected.');
        rej('Socket is not connected.'); // return false;
      }
      if (!name.trim()) {
        console.error('Invalid name to register.');
        rej('Invalid name to register.'); // return false;
      }

      this.registerUser(name, groups).then((user)=> { 
        // console.log(user);
        this.user = user;
        this.socket.emit('get-designated-room', name, (room) => {
          if (!room || !room?.room ) {
            UI.error("Unable to get designated room.").show();
            return;
          }
          let roomName = room.room;
          this.joinRoom(`PK/${roomName}`, this.user).then(({room, user}) => {
            // console.log(room, user);
            this.broadcastEvent('join-room', room);
            $('#register-dialog').hide();
          }).catch(error => UI.error("Error join room: " + error).show());
        });
      }, (error) => console.error(error));
          
      // let user = { name: name.trim(), groups: groups }; // groups value is comma-separated
      // this.user = user;
      // this.socket.emit('register-user', user, status => {
      //   console.warn(`User registration: "${user.name}" Status: ${status? 'OK': 'NOK'}`, `Socket ID:`, this.socket.id);
      //   window.localStorage.setItem(`collab-${this.namespace}-collabid`, name);
      //   window.localStorage.setItem(`collab-${this.namespace}-collabname`, name.split("/")[1] ?? name);
      //   if (status === true) {
      //     res(user);
      //     KitBuildCollab.getRoomsOfSocket(this.socket);
      //     KitBuildCollab.getPublishedRoomsOfGroups(user.groups, this.socket);
      //     this.broadcastEvent(`socket-${this.isReconnect ? 'reconnect' : 'connect'}`, 
      //       this.socket);
      //   } else {
      //     UI.error(`Unable to register user: ${status}`).show();
      //     rej(`Unable to register user: ${status}`);
      //   }
      // });
    });
  }

  getRegisteredUser() {
    return new Promise((resolve, reject) => {
      if (!this.socket) reject("Socket not connected.");
      this.socket.emit('get-registered-user', user => {
        console.warn(`Get registered user:`, user);
        resolve(user);
      });
    });
  }

  getCollabId() { // console.log(this.namespace);
    let id = window.localStorage.getItem(`collab-${this.namespace}-collabid`);
    return id;
  }

  getCollabName() {
    return window.localStorage.getItem(`collab-${this.namespace}-collabname`);
  }

  setCollabId(id = null) { // console.log(this.namespace);
    window.localStorage.setItem(`collab-${this.namespace}-collabid`, id);
  }

  setCollabName(name = null) {
    window.localStorage.getItem(`collab-${this.namespace}-collabname`, name);
  }

  removeCollabId() {
    window.localStorage.removeItem(`collab-${this.namespace}-collabid`);
  }

  removeCollabName() {
    window.localStorage.removeItem(`collab-${this.namespace}-collabname`);
  }

  // Forward Message/Event: Server --> App
  broadcastEvent(evt, ...data) { // console.warn(evt, data);
    switch(evt) {
      case 'connect':
      case 'reconnect':
        break;
      case 'join-room': {
        let room = data.shift();
        data.unshift(room);
        console.warn("Collab: Room joined", room);
        console.warn("Collab: Requesting map state.");
        this.send("get-map-state");
      } break;
      case 'socket-user-leave-room':
      case 'leave-room': {
        window.localStorage.removeItem(`collab-${this.namespace}-room`);
      } break;
      case 'socket-command': {
        let command = data.shift();
        // directly apply command 
        // for canvas-related collaboration action
        this.applyReceivedCommand(command, data);
        data.unshift(command);
      } break;
    }

    // forward event from server to App for further handling
    this.eventListeners.forEach(listener => {
      if (typeof listener == 'function') listener(evt, ...data);
    });
    return this;
  }

  send(action, ...data) { // console.warn(action, data);
    // console.log(this.isConnected(), KitBuildCollab.getPersonalRoom());
    if (!this.isConnected()) return;
    if (!KitBuildCollab.getPersonalRoom()) return;
    
    switch(action) {
      case "command": {
        let command = data.shift();
        this.command(command, ...data)
          .then(result => {})
          .catch(error => console.error(command, error));
      } break;
      case "push-map-state": {
        let compressedData = Core.compress(data);
        this.socket.emit("command", 
          KitBuildCollab.getPersonalRoom().name, 
          action, compressedData, 
          result => console.log(result));
        break;
      }
      case "get-map-state": {
        this.getMapState().then(result => {})
          .catch(error => UI.error("Unable to get map state: " + error).show());
      } break;
      case "send-map-state": {
        this.sendMapState(...data).then(result => {})
          .catch(error => UI.error("Unable to send map state: " + error).show());
      } break;
      case "get-channels": { 
        this.tools.get('channel').getChannels()
          .then(channels => {})
          .catch(error => UI.error("Unable to get channels: " + error)
          .show());
      } break;
    }
  }

  command(command, ...data) {
    return new Promise((resolve, reject) => { // console.log(KitBuildCollab.rooms);
      if (!KitBuildCollab.getPersonalRoom()) {
        reject("Not connected to room.");
        return;
      }
      if ([
        'camera-zoom-in','camera-zoom-out',
        'camera-center','camera-fit',
        'camera-reset',
        'toolbar-search','toolbar-next-search-item',
        'toolbar-prev-search-item'
      ].includes(command)) return;
      let compressedData = Core.compress(data);
      this.socket.emit("command", KitBuildCollab.getPersonalRoom().name, command, compressedData, (result) => {});
    });
  }

  getMapState() {
    return new Promise((resolve, reject) => {
      if (!KitBuildCollab.getPersonalRoom()) {
        reject("Not connected to room.");
        return
      }
      this.socket.emit("get-map-state", KitBuildCollab.getPersonalRoom().name, (result) => {
        if (result !== true) {
          console.error(result, KitBuildCollab.getPersonalRoom().name)
          return
        }
      })
    })
  }

  sendMapState(requesterSocketId, mapState) {
    return new Promise((resolve, reject) => {
      if (!KitBuildCollab.getPersonalRoom()) {
        reject("Not connected to room.");
        return
      }
      this.socket.emit("send-map-state", requesterSocketId, mapState, (result) => {})
    })
  }

  loadCollabMap(id) {
    let room = KitBuildCollab.getPersonalRoom().name;
    return new Promise((resolve, reject) => {
      if(this.socket.connected) {
        this.socket.emit('load-collabmap', id, room, e => { console.warn(e);
          resolve(e);
        });
      } else reject('Socket is not connected');
    });
  }

  applyReceivedCommand = (command, data) => { // console.log(command, data)
    switch(command) {
      case "move-nodes": {
        let moves = data.shift();
        let nodes = moves.later;
        if (Array.isArray(nodes)) nodes.forEach(node => 
        this.canvas.moveNode(node.id, node.x, node.y, 200))
      } break;
      case "redo-move-nodes":
      case "undo-move-nodes": {
        let moves = data.shift();
        let nodes = moves;
        if (Array.isArray(nodes)) nodes.forEach(node => 
        this.canvas.moveNode(node.id, node.x, node.y, 200))
      } break;
      case "undo-centroid":
      case "undo-move-link":
      case "undo-move-concept": {
        let move = data.shift();
        this.canvas.moveNode(move.from.id, move.from.x, move.from.y, 200)
      } break;
      case "centroid":
      case "redo-centroid":
      case "redo-move-link":
      case "redo-move-concept":
      case "move-link":
      case "move-concept": {
        let move = data.shift();
        this.canvas.moveNode(move.to.id, move.to.x, move.to.y, 100);
      } break;
      case "layout-elements": {
        let layoutMoves = data.shift();
        let nodes = layoutMoves.later;
        if (Array.isArray(nodes)) nodes.forEach(node => 
        this.canvas.moveNode(node.id, node.position.x, node.position.y, 100));
      } break;
      case "redo-layout-elements":
      case "undo-layout-elements":
      case "undo-layout": {
        let nodes = data.shift();
        if (Array.isArray(nodes)) nodes.forEach(node => 
        this.canvas.moveNode(node.id, node.position.x, node.position.y, 100));
      } break;
      case "undo-disconnect-right":
      case "undo-disconnect-left":
      case "redo-connect-right":
      case "redo-connect-left":
      case "connect-right":
      case "connect-left": {
        let edge = data.shift();
        this.canvas.createEdge(edge.data)
      } break;
      case "undo-connect-right":
      case "undo-connect-left":
      case "redo-disconnect-right":
      case "redo-disconnect-left":
      case "disconnect-left":
      case "disconnect-right": { 
        let edge = data.shift();
        this.canvas.removeEdge(edge.data.source, edge.data.target)
      } break;
      case "undo-move-connect-left":
      case "undo-move-connect-right": { 
        let moveData = data.shift();
        this.canvas.moveEdge(moveData.later, moveData.prior)
      } break;
      case "redo-move-connect-left":
      case "redo-move-connect-right":
      case "move-connect-left":
      case "move-connect-right": { 
        let moveData = data.shift();
        this.canvas.moveEdge(moveData.prior, moveData.later)
      } break;
      case "switch-direction": { 
        let switchData = data.shift();
        this.canvas.switchDirection(switchData.prior, switchData.later)
      } break;
      case "undo-disconnect-links": { 
        let edges = data.shift();
        if (!Array.isArray(edges)) break;
        edges.forEach(edge => {
          this.canvas.createEdge(edge.data)
        })
      } break;
      case "redo-disconnect-links":
      case "disconnect-links": { 
        let edges = data.shift();
        if (!Array.isArray(edges)) break;
        console.log(edges)
        edges.forEach(edge => {
          this.canvas.removeEdge(edge.data.source, edge.data.target)
        })
      } break;
      // case "create-link":
      // case "create-concept":
      // case "redo-duplicate-link":
      // case "redo-duplicate-concept":
      // case "duplicate-link":
      // case "duplicate-concept": { 
      //   let node = data.shift();
      //   console.log(node)
      //   this.canvas.addNode(node.data, node.position)
      // } break;
      // case "undo-duplicate-link":
      // case "undo-duplicate-concept": { 
      //   let node = data.shift();
      //   console.log(node)
      //   this.canvas.removeElements([node.data])
      // } break;
      // case "duplicate-nodes": { 
      //   let nodes = data.shift();
      //   if (!Array.isArray(nodes)) break;
      //   nodes.forEach(node =>
      //     this.canvas.addNode(node.data, node.position))
      // } break;
      // case "undo-delete-node":
      // case "undo-clear-canvas":
      // case "undo-delete-multi-nodes": { 
      //   let elements = data.shift();
      //   this.canvas.addElements(elements)
      // } break;
      // case "delete-link":
      // case "delete-concept": 
      // case "redo-delete-multi-nodes":
      // case "delete-multi-nodes": {
      //   let elements = data.shift();
      //   this.canvas.removeElements(elements.map(element => element.data))
      // } break;
      // case "undo-update-link":
      // case "undo-update-concept": {
      //   let node = data.shift();
      //   this.canvas.updateNodeData(node.id, node.prior.data)
      // } break;
      // case "redo-update-link":
      // case "redo-update-concept":
      // case "update-link":
      // case "update-concept": {
      //   let node = data.shift();
      //   this.canvas.updateNodeData(node.id, node.later.data)
      // } break;
      // case "redo-concept-color-change":
      // case "undo-concept-color-change": {
      //   let changes = data.shift();
      //   this.canvas.changeNodesColor(changes)
      // } break;
      // case "concept-color-change": {
      //   let changes = data.shift();
      //   let nodesData = changes.later
      //   this.canvas.changeNodesColor(nodesData)
      // } break;
      // case "undo-lock":
      // case "undo-unlock":
      // case "redo-lock":
      // case "redo-unlock":
      // case "lock-edge":
      // case "unlock-edge": {
      //   let edge = data.shift();
      //   this.canvas.updateEdgeData(edge.id, edge)
      // } break;
      // case "undo-lock-edges":
      // case "undo-unlock-edges":
      // case "redo-lock-edges":
      // case "redo-unlock-edges": {
      //   let lock = data.shift();
      //   if (!lock) break;
      //   if (!Array.isArray(lock.edges)) break;
      //   lock.edges.forEach(edge =>
      //     this.canvas.updateEdgeData(edge.substring(1), { lock: lock.lock }))
      // } break;
      // case "lock-edges":
      // case "unlock-edges": {
      //   let edges = data.shift();
      //   if (!Array.isArray(edges)) return;
      //   edges.forEach(edge =>
      //     this.canvas.updateEdgeData(edge.data.id, edge.data))
      // } break;
      // case "redo-clear-canvas":
      // case "clear-canvas": {
      //   this.canvas.reset()
      // } break;
      // case "convert-type": {
      //   let map = data.shift();
      //   let elements = map.later
      //   let direction = map.to
      //   this.canvas.convertType(direction, elements)
      // } break;
      case "select-nodes": {
        let ids = data.shift();
        ids = ids.map(id => `#${id}`)
        this.canvas.cy.nodes(ids.join(", ")).addClass('peer-select')
      } break;
      case "unselect-nodes": {
        let ids = data.shift();
        ids = ids.map(id => `#${id}`)
        this.canvas.cy.nodes(ids.join(", ")).removeClass('peer-select')
      } break;
  
    }
  }

  onCollabEvent(evt, ...data) { 
    // store and restore collab state on refresh
    switch(evt) {
      case 'join-room':
      case 'create-room': {
        if (!data[0]) break;
        let room = data[0].split("/").pop();
        window.localStorage.setItem(`collab-${this.namespace}-room`, room);
      } break;
      case 'leave-room': {
        window.localStorage.removeItem(`collab-${this.namespace}-room`)
      } break;
      case 'connect': {
        window.localStorage.setItem(`collab-${this.namespace}-connected`, true)
      } break;
      case 'disconnect': {
        window.localStorage.removeItem(`collab-${this.namespace}-connected`)
        // window.localStorage.removeItem(`collab-${this.namespace}-room`)
      } break;
      case 'socket-reconnect':
      case 'socket-connect': {
        let room = window.localStorage.getItem(`collab-${this.namespace}-room`)
        if (!room) break; // it was just connected, but not joined to any rooms
        let prefix = this.namespace == `cmap` ? `PC` : `PK`
        room = `${prefix}/${room}`;
        this.joinRoom(room, this.user).then(() => {
          this.broadcastEvent('join-room', room)
        }).catch(error => UI.error("Error: " + error).show())
      } break;
    }
  }
 
  static render() {
    let collabControlHtml = `<div id="collab-control" class="btn-group btn-group-sm dropup me-2">
      <button id="dd-connection" type="button" class="dd bt-connection-status btn btn-warning dropdown-toggle" data-bs-toggle="dropdown"  data-bs-auto-close="outside" data-bs-offset="0,10" aria-expanded="false">
        <i class="bi bi-plug-fill"></i>
      </button>
      <ul id="dd-connection-menu" class="dropdown-menu dropdown-menu-end scroll-y py-2" style="max-height: 300px;">
        <li><a class="dropdown-item d-flex align-items-center disabled" href="#">
          <span id="server-connection" class="p-2 badge rounded-pill bg-danger me-2">
            <span class="visually-hidden">New alerts</span>
          </span>
          <span class="text-dark" id="server-status-text">Server is online</span>
          </a>
          <div class="text-center text-danger"><em id="server-status-reason"></em></div>
          </li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item d-flex align-items-center disabled" href="#">
          <span id="notification-app-connection" class="p-2 badge rounded-pill bg-danger me-2">
            <span class="visually-hidden">New alerts</span>
          </span>
          <span class="text-dark" id="app-connection-status-text">App is disconnected</span></a>
          <small class="mx-auto d-block text-center"><code id="notification-app-socket-id"></code></small>
          <div class="text-center mt-2 register-status">
            <a class="btn btn-primary btn-sm bt-register px-4 d-none">
              <i class="bi bi-person-lines-fill"></i> Register
            </a>
            <a class="btn btn-warning btn-sm bt-unregister px-4 d-none">
              <i class="bi bi-person-fill-slash"></i> Unregister
            </a>
          </div>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item d-flex flex-column" href="#"><span class="bt-connect btn btn-success btn-sm"><i class="bi bi-plug-fill"></i> Connect</span></a></li>
        <li><a class="dropdown-item d-flex flex-column" href="#"><span class="bt-disconnect btn btn-danger btn-sm disabled"><i class="bi bi-plug-fill"></i> Disconnect</span></a></li>
      </ul>
      <button id="dd-room" type="button" class="dd btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" data-bs-offset="0,15" aria-expanded="false">
        <i class="bi bi-people-fill"></i>
        <span id="notification-room" class="position-absolute top-0 start-100 translate-middle p-2 badge rounded-pill bg-danger" style="display: none;">
          <span class="visually-hidden">New alerts</span>
        </span>
      </button>
      <ul id="dd-room-menu" class="dropdown-menu" style="max-width:280px;">
        <li class="px-3 mb-1 d-flex justify-content-between align-items-center flex-nowrap"><span class="me-3 text-nowrap text-dark">Connected Rooms</span><span class="badge rounded-pill bg-primary bt-refresh-rooms" role="button"><i class="bi bi-arrow-repeat"></i> Refresh</span></li>
        <li class="room-list bg-light"><em class="d-block text-muted text-center p-1">No Rooms</em></li>
        <li><hr class="dropdown-divider"></li>
        <li class="published-room-list overflow-auto" style="max-height:200px"><em class="d-block text-muted text-center p-1">No Rooms</em></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item bt-create-room" href="#"><i class="bi bi-plus-lg me-2"></i> Create Room</a></li>
        <li class="px-2 pt-2 d-none bg-light">
          <form class="create-room input-group input-group-sm">
            <input type="text" class="form-control" id="input-room-name">
            <button type="text" class="bt-create btn btn-primary"><i class="bi bi-plus-lg"></i> Create</button>
          </form>
        </li>
      </ul>
    </div>`;
    $('#collab-control').remove();
    $('.status-control').append(collabControlHtml);

    let registerHtml = `<form id="register-dialog" class="card d-none rounded rounded-3 p-1">
      <div class="d-flex mx-3 mt-2 align-items-center">
        <h5 class="flex-fill m-0">Register</h5>
        <span class="btn btn-sm bt-close bg-secondary-subtle"><i class="bi bi-x-lg"></i></span>
      </div>
      <div class="card-body">
        <input type="text" class="form-control" name="collabid" placeholder="Enter ID" />
        <input type="text" class="form-control mt-2" name="collabname" placeholder="Enter Name" />
        <div class="mt-2 form-check">
          <input class="form-check-input me-2" type="checkbox" value="1" id="inputrememberregister" checked>
          <label class="form-check-label user-select-none" for="inputrememberregister">Remember Me</label>
        </div>
      </div>
      <div class="text-end p-3 pt-0">
        <button class="btn btn-sm btn-secondary bt-cancel">Cancel</button>
        <button class="btn btn-sm btn-primary ms-1 bt-single-register"><i class="bi bi-person-lines-fill"></i> Register</button>
        <button class="btn btn-sm btn-primary ms-1 bt-group-register"><i class="bi bi-people-fill"></i><i class="bi bi-list"></i> Group Register</button>
      </div>
    </form>`;
    $('body').remove('#register-dialog').append(registerHtml);
  }

  static enableControl(enabled = true) {
    $('#collab-control button').attr('disabled', !enabled)
  }

  handleUIEvent() {

    this.registerDialog = UI.modal('#register-dialog', {
      hideElement: '.bt-close',
      backdrop: false,
      draggable: true,
      dragHandle: '.drag-handle',
      resizable: true,
      resizeHandle: '.resize-handle',
      minWidth: 350,
      minHeight: 250,
      width: 350,
      // height: 250,
      onShow: () => {
        let remember = window.localStorage.getItem(`collab-${this.namespace}-remember`);
        let collabid = window.localStorage.getItem(`collab-${this.namespace}-remember-collabid`);
        let collabname = window.localStorage.getItem(`collab-${this.namespace}-remember-collabname`);
        // console.log(remember, collabid, collabname);
        if (remember) {
          if (collabid) {
            collabid = collabid.split("/")[0];
          }
          $('#register-dialog input#inputrememberregister').prop('checked', true);
          $('body #register-dialog input[name="collabid"]').val(collabid);
          $('body #register-dialog input[name="collabname"]').val(collabname);
        } else {
          $('#register-dialog input#inputrememberregister').prop('checked', false);
          $('body #register-dialog input[name="collabid"]').val('');
          $('body #register-dialog input[name="collabname"]').val('');
        }
      }
    });

    // Allow only single dropdown open
    $('.dd[data-bs-toggle="dropdown"]').on('show.bs.dropdown', (e) => { 
      $('.dd[data-bs-toggle="dropdown"]').not(e.currentTarget).dropdown('hide');

      switch($(e.currentTarget).attr('id')) {
        case 'dd-connection': {
          this.getRegisteredUser().then(user => { // console.log(user);
            KitBuildCollab.updateRegisterStatus(user);
          }).catch(err => console.error(err));
          $('#server-connection').addClass('bg-warning')
            .removeClass('bg-danger bg-success');
          $('#server-status-text').html('Checking...');
          $('#server-status-reason').html('');
          KitBuildCollab.isServerOnline(this.namespace, this.settings).then(online => {
            $('#server-status-text').html('Server is online');
            $('#server-status-reason').html('');
            $('#server-connection').addClass('bg-success')
              .removeClass('bg-danger bg-warning');
          }).catch(error => {
            $('#server-status-text').html('Server is offline');
            $('#server-connection').addClass('bg-danger')
              .removeClass('bg-success bg-warning');
          })
          this.broadcastEvent(`check-server`);
        } break;
      }
    })

    $('#register-dialog').on('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();

      let sender = e.originalEvent.submitter;
      let collabid = $('#register-dialog input[name="collabid"]').val();
      let collabname = $('#register-dialog input[name="collabname"]').val();
      let remember = $('#register-dialog input#inputrememberregister:checked').val();

      // TODO: sanitize or check
      if ($(sender).hasClass('bt-cancel')) {
        $('#register-dialog').hide();
        return;
      }
      if (collabid.trim() == "") {
        UI.warning(`Invalid ID`).show();
        return;
      }
      if (collabname.trim() == "") {
        UI.warning(`Invalid Name`).show();
        return;
      }
      if (remember) {
        window.localStorage.setItem(`collab-${this.namespace}-remember`, remember);
        window.localStorage.setItem(`collab-${this.namespace}-remember-collabid`, collabid);
        window.localStorage.setItem(`collab-${this.namespace}-remember-collabname`, collabname);
      } else {
        window.localStorage.removeItem(`collab-${this.namespace}-remember`);
        window.localStorage.removeItem(`collab-${this.namespace}-remember-collabid`);
        window.localStorage.removeItem(`collab-${this.namespace}-remember-collabname`);
      }
      if ($(sender).hasClass('bt-single-register')) {
        this.registerUser(collabid+"/"+collabname).then((user)=> { // console.log(user);
          this.user = user;
          $('#register-dialog').hide();
        }, (error) => console.error(error));
      } else if ($(sender).hasClass('bt-group-register')) {
        this.registerUserGroup(collabid+"/"+collabname).then((user)=> { // console.log(user);
          this.user = user;
          $('#register-dialog').hide();
        }, (error) => console.error(error));
      } 
      else $('#register-dialog').hide();
    });

    // Connection
    $('#dd-connection-menu .bt-connect').on('click', (e) => {
      this.connect();
    })
    $('#dd-connection-menu .bt-disconnect').on('click', (e) => {
      if (this.socket && this.socket.connected) this.disconnect();
    })

    $('#dd-connection-menu .bt-register').on('click', (e) => {
      if (this.socket && this.socket.connected) this.registerDialog.show();
    });
    $('#dd-connection-menu .bt-unregister').on('click', (e) => {
      if (this.socket && this.socket.connected) {
          let confirm = UI.confirm(`Do you want to <span class="text-danger">unregister</span> yourself?<br>You will leave all rooms and your activities will no longer be synchronized.`).positive(() => {
          let user = {
            name: this.getCollabId(),
            socketId: this.socket.id
          };
          if (this.socket && this.socket.connected)
            this.socket.emit('unregister-user', user, (result) => {
              // console.error(result);
              UI.success('User unregistered.').show();
              // KitBuildCollab.getRoomsOfSocket(this.socket);
              this.removeCollabId();
              this.removeCollabName();
              this.broadcastEvent('user-unregistered', user);
              // $('#dd-room-menu .bt-refresh-rooms').trigger('click');
            });
          confirm.hide();
        }).negative(()=>confirm.hide()).show();
      }
    });

    // Room
    $('#dd-room').on('click', (e) => {
      setTimeout(() => $('#notification-room').hide(), 200)
    })
    $('#dd-room-menu .bt-create-room').on('click', (e) => {
      $('form.create-room').parent('li').toggleClass('d-none')
    })
    $('#dd-room-menu .bt-refresh-rooms').on('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.socket || !this.socket.connected) {
        UI.error("Socket is not connected.").show();
        return;
      }
      let label = Loading.load(e.currentTarget);
      KitBuildCollab.getRoomsOfSocket(this.socket).then((rooms) => {
        // console.log(rooms);
        UI.info("Joined room list refreshed.").show();
        this.broadcastEvent('manual-refresh-rooms');
        Loading.done(e.currentTarget, label);
      });
    });
    $('#dd-room-menu .room-list').on('click', '.bt-leave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let name = $(e.currentTarget).siblings('a.room').attr('data-name')
      let confirm = UI.confirm(`Do you want to <span class="text-danger">LEAVE</span> this room?<br><span class="text-danger">${name}</span><br>Your concept map and concept map activities will no longer be synchronized.`).positive(() => {
        if (this.socket && this.socket.connected)
          this.socket.emit('leave-room', name, () =>
            KitBuildCollab.getRoomsOfSocket(this.socket));
        confirm.hide();
        this.broadcastEvent('leave-room', name);
      }).negative(()=>confirm.hide()).show();
    })
    $('#dd-room-menu .published-room-list').on('click', '.bt-join', (e) => {
      let room = $(e.currentTarget).attr('data-name');
      if (KitBuildCollab.rooms.has(room)) {
        UI.warning(`You are already in room: ${room}`).show();
        return;
      }
      let confirm = UI.confirm(`Join room: <span class="text-primary">"${room}"</span>?<br>Your active session working data will be synchronized.`).positive(() => {
        this.joinRoom(room, this.user).then(() => {
          confirm.hide();
          this.broadcastEvent('join-room', room);
        }).catch(error => UI.error("Error joining room: " + error).show());
      }).negative(()=>confirm.hide()).show();
    });
    $('#dd-room-menu form.create-room').on('submit', (e) => {
      e.preventDefault()
      e.stopPropagation()
      let roomName = $('#input-room-name').val().trim() // console.log(roomName)
      if (!this.socket || !this.socket.connected) {
        UI.warning(`Cannot create room: <code>${roomName}</code>. You are not connected to the collaboration server.`).show()
        return
      }
      if (!roomName.length) {
        UI.warning(`Cannot create room with empty name.`).show()
        return
      }
      this.socket.emit('create-room', roomName, (rooms) => { // console.log(rooms)
        if (!rooms || typeof rooms == 'string') {
          UI.error(`Cannot create room: <code>${roomName}</code>. ${rooms}`).show()
          return
        }
        $('form.create-room').parent('li').addClass('d-none')
        KitBuildCollab.getRoomsOfSocket(this.socket)
        let prefix = this.namespace == `cmap` ? `PC` : `PK`
        this.broadcastEvent('create-room', `${prefix}/${roomName}`)
      })
    })


  }



  // Socket Connection
  static updateSocketConnectionStatus(socket) {
    if (!socket || !socket.connected) {
      $('#notification-app-connection').addClass('bg-danger').removeClass('bg-success')
        .attr('title', '');
      $('#notification-app-socket-id').html('');
      $('#app-connection-status-text').html('App is not connected');
      $('#dd-connection-menu .bt-connect').removeClass('disabled').show();
      $('#dd-connection-menu .bt-disconnect').addClass('disabled').hide();
      $('#dd-connection').removeClass('btn-outline-success').addClass('btn-warning');
      $('#dd-connection-menu .bt-register').addClass('d-none');
    } else {
      $('#notification-app-connection').addClass('bg-success').removeClass('bg-danger')
        .attr('title', socket.id);
      $('#notification-app-socket-id').html(socket.id);
      $('#app-connection-status-text').html('App is connected');
      $('#dd-connection-menu .bt-connect').addClass('disabled').hide();
      $('#dd-connection-menu .bt-disconnect').removeClass('disabled').show();
      $('#dd-connection').addClass('btn-outline-success').removeClass('btn-warning');
      $('#dd-connection-menu .bt-register').removeClass('d-none');
    }
  }

  static updateRegisterStatus(user = false) { // console.log(user)
    $('.bt-register').parent().find(".userid").remove();
    if (!user) {
      $('.bt-register').addClass('d-none');
      $('.bt-unregister').addClass('d-none');
      return;
    }
    if (user?.name) {
      let html = ``;
      html += `<small class="d-flex mx-3 mb-2 px-2 py-1 fw-semibold `;
      html += `  text-secondary-emphasis bg-secondary-subtle border`;
      html += `  justify-content-center align-items-center`;
      html += `  border-secondary-subtle rounded-2 userid" style="font-size:.775em;">`;
      html += `  <i class="bi bi-person-fill me-2"></i>`;
      html += `  ${user.name}`;
      html += `</small>`;
      $('.bt-register').parent().prepend(html);
      $('.bt-register').addClass('d-none');
      $('.bt-unregister').removeClass('d-none');
    } else {
      $('.bt-register').removeClass('d-none');
      $('.bt-unregister').addClass('d-none');
    }
  }


  // Room
  static updateRoomNotificationBadge() {
    if (!$('#dd-room-menu').is(':visible')) {
      $('#notification-room').show()
    } else $('#notification-room').hide()
  }

  static getPublishedRoomsOfGroups(groups, socket) {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject("Invalid socket.");
        return;
      } 
      if (!Array.isArray(groups)) groups = groups.split(",");
      // console.log("getPublishedRoomsOfGroups",groups);
      socket.emit("get-rooms-of-groups", groups, (rooms) => {
        // console.log("getPublishedRoomsOfGroups",rooms);
        KitBuildCollab.publishedRooms.clear();
        if (rooms) rooms.forEach(room =>
          KitBuildCollab.publishedRooms.set(room.name, room));
        KitBuildCollab.populatePublishedRoomList();
        CollabChatTool.updateChatRoomName();
        resolve(rooms);
      });
    });

  }

  static getRoomsOfSocket(socket) { // console.error(socket);
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject("Invalid socket.")
        return
      } 
      socket.emit('get-rooms-of-socket', rooms => {
        KitBuildCollab.rooms = new Map(rooms.map(i => [i.name, i]));
        KitBuildCollab.populateRoomList(rooms);
        KitBuildCollab.updateRoomNotificationBadge();
        CollabChatTool.updateChatRoomName();
        resolve(rooms);
      });
    });
  }

  static getPersonalRoom() { // console.log(KitBuildCollab.rooms);
    for(let room of KitBuildCollab.rooms?.values()) {
      if (room.type == 'personal') return room;
    }; return null;
  }

  static populateRoomList(rooms) {
    let html = rooms.length ? '' : `<em class="d-block text-muted text-center">No Rooms</em>`;
    rooms.forEach(room => { // console.warn(room);
      let color = room.type == "group" ? `text-muted` : `text-primary`;
      color = room.type ? color : 'text-dark text-opacity-50';
      let bg = room.type == "group" ? `bg-warning text-dark` : `bg-primary`;
      bg = room.type ? bg : 'bg-secondary-subtle text-secondary';
      let dd = (room.type == "personal") ? `data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"` : ``;
      if (room.type == "personal")
        html += `<span>`;

      html += `<span class="dropdown-item d-flex justify-content-between align-items-center me-3" ${dd}>`
      html += `<a class="text-decoration-none text-truncate room ${color}" href="#" data-name="${room.name}" data-type="${room.type ?? ''}">`
      
      let usersCount = room.users ? room.users.length : 0

      if (room.type == "personal"){
        html += `<span><i class="bi bi-chevron-right"></i> ${room.name}</span>`;
        html += `<span class="badge rounded-pill ms-2 ${bg}"><i class="bi bi-people-fill"></i> ${usersCount}</span>`;
      } else html += `<span>${room.name}</span>`;
      
      
      html += `</a>`;

      if (room.type == "personal")
        html += `<span href="#" class="bt-leave badge rounded-pill bg-danger" role="button">Leave<i class="bi bi-box-arrow-right ms-1"></i></span>`
      else html += `<span class="badge rounded-pill ms-2 ${bg}"><i class="bi bi-people-fill"></i> ${usersCount}</span>`;
      
      html += `</span>`
      if (room.type == "personal" && room.users && room.users.length) {
        html += `<ul class="dropdown-menu dropdown-menu-end me-3 shadow" style="max-width:250px;">`
        room.users.forEach(user => {
          html += `<li><a class="dropdown-item text-truncate" href="#">`;
          html += `<i class="bi bi-person-fill me-1 text-primary"></i>`;
          html += `${user.name}`;
          html += `</a></li>`;
        })
        html += `</ul>`;
      }
      if (room.type == "personal") html += `</span>`
    });
    $('#dd-room-menu .room-list').html(html);
  }

  static populatePublishedRoomList() {
    let html = KitBuildCollab.publishedRooms.size ? '' : `<em class="d-block text-muted text-center">No Rooms</em>`;
    KitBuildCollab.publishedRooms.forEach(room => { // console.log(room)
      html += `<a class="dropdown-item room bt-join" href="#" data-name="${room.name}" data-type="${room.type}">`
      html += `<span>${room.name}</span>`;
      html += `<span class="badge rounded-pill ms-2 bg-primary"><i class="bi bi-people-fill"></i> ${room.users?.length}</span>`;
      html += `</a>`;
    });
    $('#dd-room-menu .published-room-list').html(html);
  }

  joinRoom(room, user) { 
    console.warn("Joining room:", room, user);
    return new Promise((resolve, reject) => {
      this.socket.emit('join-room', room, (rooms) => {
        // console.log("emit join room", room, rooms);
        if (typeof rooms == 'string') {
          reject(rooms);
          return;
        }
        let promises = [];
        let chatTool = this.tools.get('chat');
        if (chatTool)
          promises.push(chatTool.getAndBuildRoomMessages(room, user));
        // console.log(promises);
        Promise.all(promises).then((result) => {
          // console.log(result, room);
          // resolve(result);
          let roomNameParts = room.split("/");
          let roomName = roomNameParts.length > 1 ? roomNameParts[1] : roomNameParts[0];
          // console.log(roomNameParts, roomName, user);
          window.localStorage.setItem(`collab-${this.namespace}-room`, roomName);
          resolve({room, user});
        }).catch((error) => UI.warning(error).show());
      })
    })
  }

  rejectjoinRoomRequest(room, user) {
    return new Promise((resolve, reject) => {
      this.socket.emit('reject-join-room-request', room, user, () => {
        resolve(true);
      });
    });
  }

  async connectIfPreviouslyConnected() {
    let previouslyConnected = 
      window.localStorage.getItem(`collab-${this.namespace}-connected`);
    console.warn("Connecting to collab server by previous state ...");
    if (previouslyConnected) return await this.connect();
  }

  setData(key, value) {
    this.data.set(key, value);
  }

  getData(key) {
    return this.data.get(key) ?? null;
  }

}






















class CollabTool extends KitBuildCanvasTool {
  constructor(collab, options) {
    super(collab.canvas, options);
  }
  render() { return '' }
  handleUIEvent() {}
}

class CollabChannelTool extends CollabTool {
  constructor(collab, options) {    
    super(collab, Object.assign({
      showOn: KitBuildCanvasTool.SH_LINK | KitBuildCanvasTool.SH_CONCEPT,
      bgColor: "#FFFFFF",
      color: "#22BA73",
      gridPos: { x: 0, y: -1 },
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-square-quote-fill" viewBox="-5 -5 26 28"><path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM7.194 6.766a1.688 1.688 0 0 0-.227-.272 1.467 1.467 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 5.734 6C4.776 6 4 6.746 4 7.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26-.137.389-.39.804-.81 1.22a.405.405 0 0 0 .011.59c.173.16.447.155.614-.01 1.334-1.329 1.37-2.758.941-3.706a2.461 2.461 0 0 0-.227-.4zM11 9.073c-.136.389-.39.804-.81 1.22a.405.405 0 0 0 .012.59c.172.16.446.155.613-.01 1.334-1.329 1.37-2.758.942-3.706a2.466 2.466 0 0 0-.228-.4 1.686 1.686 0 0 0-.227-.273 1.466 1.466 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 10.07 6c-.957 0-1.734.746-1.734 1.667 0 .92.777 1.666 1.734 1.666.343 0 .662-.095.931-.26z"/></svg>'
    }, options))
    this.collab = collab;
    this.canvas = collab.canvas;
    this.socket = collab.socket; // WARNING! possibility null
    this.canvas.toolCanvas.addTool("channel-tool", this)
    this.collab.on('event', this.onCollabEvent.bind(this));
    this.shouldBlink = false
    
    CollabChannelTool.channels = new Map();
  }

  action(event, e, node) { console.error(event, e, node)
    if (!node) return;
    if (!this.socket || !this.socket.connected) {
      UI.error("Socket is not connected.").show();
      return;
    }
    if (!KitBuildCollab.getPersonalRoom()) {
      UI.warning("Please join a room.").show();
      return;
    }
    this.setNode(node);
    this.showChannel(node.id());
    this.channelDialog.show();
    this.getAndBuildChannelMessages(KitBuildCollab.getPersonalRoom().name, node.id())
      .catch(error => {
        UI.error("Unable to get channel messages.").show();
        console.error(error);
      })
    CollabChannelTool.updateChannelChatRoomNotificationBadge();
    this.raiseEvent('collab-channel', {
      id: node.id(),
      label: node.data().label
    });
  }

  render() {
    this.renderDialog()
    return `<button id="dd-channel" type="button" class="dd btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"  data-bs-auto-close="outside" data-bs-offset="40,15" aria-expanded="false">
      <i class="bi bi-chat-square-quote-fill"></i>
      <span id="notification-channel" class="position-absolute translate-middle badge rounded-pill bg-danger" style="display: none;">
        <span class="count">99+</span>
        <span class="visually-hidden">New alerts</span>
      </span>
    </button>
    <ul id="dd-channel-menu" class="dropdown-menu scroll-y py-2" style="max-height: 300px;">
      <li class="d-flex justify-content-between align-items-center px-3 py-1"><span class="text-primary">Channel</span><span class="badge rounded-pill bg-primary bt-refresh-channel ms-5" role="button">Refresh</span></li>
      <li class="channel-list"></li>
    </ul>`;
  }

  renderDialog() {
    let channelDialogHtml = `<div id="collab-channel" class="card d-none">
        <div class="px-2 pt-2 d-flex align-items-center">
          <div class="text-muted drag-handle flex-fill">Channel: <span class="channel-name text-primary">Channel Name</span></div>
          <span><a class="bt-close" href="#"><i class="bi bi-x-lg text-dark"></i></a></span>
        </div>
        <div class="card-body p-2 d-flex flex-column position-relative" style="height: 100%;">
          <div class="border rounded mb-2 overflow-y-scroll pt-1 flex-fill" style="height: 10px;" id="channel-chat-list"></div>
          <form class="channel-chat" name="chat" autocomplete="off">
            <div class="input-group input-group-sm">
              <input type="text" class="form-control" id="input-channel-message" placeholder="Type Message..." aria-label="Type Message..." aria-describedby="button-send-message">
              <button class="btn btn-primary" id="bt-send-channel-message"><i class="bi bi-send"></i> Send</button>
              <button class="btn btn-sm border resize-handle" type="button" style="cursor: nwse-resize;"><i class="bi bi-arrows-angle-expand"></i></button>
            </div>
          </form>
        </div>
      </div>`;
    $('#collab-channel').remove()
    $('body').append(channelDialogHtml);
  }

  blink() {
    if (this.shouldBlink) return;
    this.shouldBlink = setInterval(() => {
      // console.log("tick", CollabChannelTool.channels)
      CollabChannelTool.channels.forEach((channel, nodeId) => {
        if (channel.unread)
          this.canvas.cy.nodes(`#${nodeId}`).toggleClass(`notify`)
        else this.canvas.cy.nodes(`#${nodeId}`).removeClass(`notify`)
      })
      let unread = false
      for(let channel of CollabChannelTool.channels.values()){
        if (channel.unread) { unread = true; break; }
      }
      if (!unread) { // all channels have been read
        clearInterval(this.shouldBlink)
        this.shouldBlink = false;
      }
    }, 1000)
  }

  setNode(node) {
    this.node = node.json();
    $('#collab-channel .channel-name').html(this.node.data.label)
  }

  getChannels() {
    return new Promise((resolve, reject) => {
      if (!KitBuildCollab.getPersonalRoom()) {
        reject("Not connected to room.");
        return
      }
      this.socket.emit("get-channels-of-room", 
        KitBuildCollab.getPersonalRoom().name, 
        (channels) => {
          channels.forEach(channel => {
            if (!CollabChannelTool.channels.has(channel)) {
              let label = this.canvas.cy.nodes(`#${channel}`).data('label');
              CollabChannelTool.channels.set(channel, {
                cid: channel,
                label: label,
                unread: 0
              });
            }
          });
          resolve(channels);
        });
    });
  }

  showChannel(nodeId) {
    this.canvas.cy.nodes(`#${nodeId}`).removeClass('notify');
    this.channel = CollabChannelTool.channels.get(nodeId);
    if (this.channel)
      this.channel.unread = 0;
  }

  handleUIEvent() {
    let collab = this.collab;
    this.channelDialog = UI.modal('#collab-channel', {
      hideElement: '.bt-close',
      backdrop: false,
      draggable: true,
      dragHandle: '.drag-handle',
      resizable: true,
      resizeHandle: '.resize-handle',
      minWidth: 350,
      minHeight: 250,
      width: 350,
      height: 250,
      onShow: () => {
        $('#input-channel-message').focus()
      }
    });
    
    $('#input-channel-message').on('keyup', e => {
      // console.log(e);
      if (!e.shiftKey && e.key == "Enter") {
        // console.log('should submit');
        // e.preventDefault();
        let text = $('#input-channel-message').val().trim();
        if (text.length == 0) return
        if (!collab.socket || !collab.socket.connected) {
          UI.error("Cannot send message: Socket is not connected.").show()
          return;
        }
        if (KitBuildCollab.getPersonalRoom()) {
          let message = {
            when: Date.now() / 1000 | 0,
            type: 'text',
            text: text,
            sender: {
              name: collab.user.name
            }
          };
          if (this.collab?.data)
            this.collab?.data?.forEach((v, k) => message[k] = v);          
          collab.socket.emit('channel-message', message, 
            KitBuildCollab.getPersonalRoom().name, 
            this.node.data.id, () => {
              message.self = true;
              this.onMessageText(message);
            $("#channel-chat-list").animate({ scrollTop: $("#channel-chat-list")[0].scrollHeight }, 200);
            $('#input-channel-message').val('')
            CollabChannelTool.channels.set(this.node.data.id, {
              cid: this.node.data.id,
              label: this.node.data.label,
              unread: 0
            });
            collab.broadcastEvent('channel-message', message, KitBuildCollab.getPersonalRoom().name, this.node.data.id);
          })
        } else UI.error('Unable to send message. No room joined.').show();
      }
    });
    $('#bt-send-channel-message').on('click', e => {
      var e = $.Event( "keyup", { key: "Enter" } );
      $('#input-channel-message').trigger(e);
    })
    $('form.channel-chat').on('submit', (e) => { // console.log(e);
      e.preventDefault();
      e.stopPropagation();
    });
    $('#input-channel-message').on('keydown', (e) => {
      if (!collab.socket || !collab.socket.connected) return;
      if (KitBuildCollab.getPersonalRoom()) {
        collab.socket.emit('channel-message', {
          when: Date.now() / 1000 | 0,
          type: 'typing',
          sender: {
            username: collab.user.username,
            name: collab.user.name,
          }
        }, KitBuildCollab.getPersonalRoom().name, this.node.data.id, () => {});
      }
    });
    $('#dd-channel').on('click', (e) => {
      CollabChannelTool.updateChannelList(this.canvas);
    });
    $('#dd-channel-menu .channel-list').on('click', 'a.channel', (e) => {
      let cid = $(e.currentTarget).attr('data-cid');
      this.setNode(this.canvas.cy.nodes(`#${cid}`));
      this.showChannel(cid);
      this.getAndBuildChannelMessages(KitBuildCollab.getPersonalRoom().name, cid)
        .catch(error => {
          UI.error("Unable to get channel messages.").show()
          console.error(error)
        });
      this.channelDialog.show();
      CollabChannelTool.updateChannelList(this.canvas);
    });
  }

  // Channel Message Handler chain
  onCollabEvent(evt, ...data) {
    switch(evt) {
      case 'connect': 
        let socket = data.shift();
        this.socket = socket;
        if (!CollabChannelTool.listener)
          CollabChannelTool.listener = this.onChannelMessage.bind(this);
        socket.off("channel-message", CollabChannelTool.listener)
          .on("channel-message", CollabChannelTool.listener)
      break;
    }
  }
  onChannelMessage(message, nodeId) {
    // console.log(message, nodeId)
    switch(message.type) {
      case 'text': 
        let channel = CollabChannelTool.channels.get(nodeId);
        if (this.node && nodeId == this.node.data.id && $('#collab-channel').is(':visible')) {
          message.self = (message.sender.name == this.collab.user.name);
          this.onMessageText(message);  
          $("#channel-chat-list").animate({ scrollTop: $("#channel-chat-list")[0].scrollHeight }, 200);
          $(`#channel-chat-list .typing[data-sender="${message.sender.name}"`).remove();
          CollabChannelTool.unreadChannelMessageCount = 0
          if (channel) channel.unread = 0;
        } else {
          CollabChannelTool.unreadChannelMessageCount++;
          if (!channel) {
            CollabChannelTool.channels.set(nodeId, {
              cid: nodeId,
              label: this.canvas.cy.nodes(`#${nodeId}`).data('label'),
              unread: 1
            });
          } else channel.unread++;
          this.canvas.cy.nodes(`#${nodeId}`).addClass('notify')
          this.blink()
        }
        CollabChannelTool.updateChannelChatRoomNotificationBadge()
        CollabChannelTool.updateChannelList(this.canvas)
        break;
      case 'typing': 
        this.onMessageTyping(message, nodeId); 
        break;
      default: console.log(message);
    }
  }
  onMessageText(message) {
    let when = new Date(message.when * 1e3).toISOString().slice(-13, -5);
    let align = message.self ? 'flex-row-reverse ms-4' : 'me-4';
    let bg = message.self ? 
      'border-dark-subtle bg-light' : 'border-warning bg-warning-subtle';
    let round = message.self ? 
      'rounded-top-3 rounded-start-3' : 'rounded-bottom-3 rounded-end-3';
    let chatHtml = `<span class="my-1 d-flex ${align}">`;
    chatHtml += ` <span class="mx-2 p-2 border ${round} d-flex ${bg}">`;
    if (!message.self)
    chatHtml += `   <small class="text-primary me-2 text-truncate" style="max-width:100px">${message.sender.name}</small>`;
    chatHtml += `   <small>${message.text}</small>`;
    chatHtml += `   </span>`;
    chatHtml += ` </span>`;
    chatHtml += `</span>`;
    $('#channel-chat-list').append(chatHtml);
  }
  onMessageTyping(message, nodeId) {
    let label = ''
    if (this.node && nodeId != this.node.data.id && $('#collab-channel').is(':visible')) {
      label = `on ${this.canvas.cy.nodes(`#${nodeId}`).data('label')}`
    }
    let chatHtml = `<span class="mt-1 mx-1 pb-2 typing" data-sender="${message.sender.name}" data-type="typing">`
    chatHtml += `   <em class="px-2 text-muted" style="font-size:.75rem">${message.sender.name} is typing... ${label}</em>`
    chatHtml += `</span>`
    let clearTyping = (name) => {
      $(`#channel-chat-list .typing[data-sender="${name}"`).remove();
      clearTimeout(KitBuildCollab.typingTimeout.get(message.sender.name))
      KitBuildCollab.typingTimeout.delete(message.sender.name)
    }

    if ($(`#channel-chat-list .typing[data-sender="${message.sender.name}"]`).length == 0) {
      $('#channel-chat-list').append(chatHtml)
      $("#channel-chat-list").animate({ scrollTop: $("#channel-chat-list")[0].scrollHeight }, 200);
      KitBuildCollab.typingTimeout.set(message.sender.name,
        setTimeout(() => clearTyping(message.sender.name), 3000));
    } else {
      clearTimeout(KitBuildCollab.typingTimeout.get(message.sender.name))
      KitBuildCollab.typingTimeout.set(message.sender.name, 
        setTimeout(() => clearTyping(message.sender.name), 3000));
    }
  }

  // Channel
  getAndBuildChannelMessages(room, nodeId) { 
    return new Promise((resolve, reject) => {
      let socket = this.socket;
      let user = this.collab.user;
      if (!socket || !socket.connected || !room || !nodeId || !user) {
        if (!socket) reject("Invalid socket.")
        if (!socket.connected) reject("Socket is not connected.")
        if (!room) reject("No room joined.")
        if (!nodeId) reject("Invalid node.")
        if (!user) reject("Invalid user.")
        return 
      } 
      socket.emit('get-channel-messages', room, nodeId, (messages) => { 
        // console.warn(messages);
        if (messages && Array.isArray(messages)) {
          $('#channel-chat-list').html('')
          messages.forEach(message => { // console.log(message, user);
            message.self = (message.sender.name == user.name);
            this.onMessageText(message);
          });
          $("#channel-chat-list").animate({ scrollTop: $("#channel-chat-list")[0].scrollHeight }, 200);
        }
        resolve(messages);
      })
    })
  }
  static updateChannelChatRoomNotificationBadge() {
    KitBuildCollab.unreadChannelMessageCount = 0;
    CollabChannelTool.channels.forEach(channel => KitBuildCollab.unreadChannelMessageCount += channel.unread)
    if (KitBuildCollab.unreadChannelMessageCount) {
      $('#notification-channel').show()
      $('#dd-channel .count').html(KitBuildCollab.unreadChannelMessageCount)
    } else $('#notification-channel').hide()
  }
  static updateChannelList(canvas) { // console.warn(CollabChannelTool.channels)
    let channelListHtml = ''
    CollabChannelTool.channels.forEach(channel => {
      let label = canvas.cy.nodes(`#${channel.cid}`).data('label')
      channelListHtml += `<a class="channel dropdown-item d-flex justify-content-between align-items-center"`
      channelListHtml += `  data-cid="${channel.cid}" href="#">`;
      channelListHtml += `<span>${label}</span>`;
      if (channel.unread)
        channelListHtml += `<span class="badge rounded-pill bg-danger ms-2">${channel.unread}</span>`;
      channelListHtml += `</a>`;
    })
    $('#dd-channel-menu .channel-list').html(channelListHtml)
    CollabChannelTool.updateChannelChatRoomNotificationBadge()
  }


}

class CollabChatTool extends CollabTool {
  constructor(collab, options) {
    super(collab.canvas, options)
    this.collab = collab;
    this.socket = collab.socket;
    this.collab.on('event', this.onCollabEvent.bind(this));
    CollabChatTool.unreadMessageCount = 0;
    console.warn("Chat tool created and event subscribed.");
  }
  render() {
    return `<button id="dd-message" type="button" class="dd btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" data-bs-offset="30,15" aria-expanded="false">
      <i class="bi bi-chat-dots-fill"></i>
      <span id="notification-message" class="position-absolute translate-middle badge rounded-pill bg-primary" style="display: none;">
        <span class="count">99+</span>
        <span class="visually-hidden">New alerts</span>
      </span>
    </button>
    <ul id="dd-message-menu" class="dropdown-menu" style="width: 300px;">
      <li class="px-2">
        <div class="mb-2 text-muted">Room: <span class="room-name text-primary">Room 2</span></div>
        <div class="border rounded mb-2 scroll-y pt-1 overflow-hidden" style="min-height: 100px; max-height: 250px" id="chat-list"></div>
        <form class="chat" name="chat" autocomplete="off">
          <div class="input-group input-group-sm mb-2">
            <input type="text" class="form-control" id="input-message" placeholder="Type Message..." aria-label="Type Message..." aria-describedby="button-send-message">
            <button class="btn btn-primary" id="bt-send-message"><i class="bi bi-send"></i> Send</button>
          </div>
        </form>
      </li>
    </ul>`;
  }
  handleUIEvent() {
    let collab = this.collab
    // Message
    $('#dd-message').on('click', () => {
      CollabChatTool.updateChatRoomName();
      setTimeout(() => {
        CollabChatTool.unreadMessageCount = 0;
        CollabChatTool.updateChatRoomNotificationBadge()
        $("#chat-list").animate({ scrollTop: $("#chat-list")[0].scrollHeight }, 200);
      }, 200)
      if ($('#dd-message-menu').hasClass('show'))
        $('#input-message').focus();
    })
    $('#input-message').on('keydown', (e) => {
      if (!collab.socket || !collab.socket.connected) return;
      if (KitBuildCollab.getPersonalRoom()) {
        collab.socket.emit('message', {
          when: Date.now() / 1000 | 0,
          type: 'typing',
          sender: {
            username: collab.user.username,
            name: collab.user.name,
          }
        }, KitBuildCollab.getPersonalRoom().name, () => {})
      }
    })
    $('#dd-message-menu form.chat').on('submit', (e) => {
      e.preventDefault()
      e.stopPropagation()
      let message = $('#input-message').val().trim()
      if (message.length == 0) return 
      if (!collab.socket || !collab.socket.connected) {
        UI.error("Cannot send message: Socket is not connected.").show()
        return;
      }
      // console.log(this.collab?.data, this);
      message = {
        when: Date.now() / 1000 | 0,
        type: 'text',
        text: message,
        sender: {
          username: collab.user.username,
          name: collab.user.name,
        },
      }
      if (this.collab?.data)
        this.collab?.data?.forEach((v, k) => message[k] = v);

      if (KitBuildCollab.getPersonalRoom()) {
        collab.socket.emit('message', message, KitBuildCollab.getPersonalRoom().name, () => {
          message.self = (message.sender.name == collab.user.name);
          this.onMessageText(message);
          $("#chat-list").animate({ scrollTop: $("#chat-list")[0].scrollHeight }, 200);
          $('#input-message').val('')
          collab.broadcastEvent('message', message, KitBuildCollab.getPersonalRoom().name)
        })
      } else UI.error('Unable to send message. No room joined.').show()
    })
  }

  getAndBuildRoomMessages(room, user) { 
    // console.warn(room, user, this.socket);
    return new Promise((resolve, reject) => {
      if (!this.socket 
        || !this.socket.connected 
        || !room 
        || !user) {
        reject("Invalid parameters.")
        return 
      } 
      this.socket.emit('get-room-messages', room, (messages) => { 
        // console.warn(messages);
        $('#chat-list').html('')
        if (messages && Array.isArray(messages)) {
          messages.forEach(message => { // console.log(message);
            message.self = (message.sender.name == user.name);
            this.onMessageText(message);
          })
          $("#chat-list").animate({ scrollTop: $("#chat-list")[0].scrollHeight }, 200);
        }
        resolve(messages);
      })
    })
  }

  // Message handlers chain
  onCollabEvent(evt, ...data) {
    switch(evt) {
      case 'connect':
        let socket = data.shift();
        this.socket = socket;
        if (!CollabChatTool.listener)
          CollabChatTool.listener = this.onMessage.bind(this);
        socket.off("message", CollabChatTool.listener)
          .on("message", CollabChatTool.listener)
        break;
    }
  }
  onMessage(message) {
    switch(message.type) {
      case 'text': {
        this.onMessageText(message); 
        $(`#chat-list .typing[data-sender="${message.sender.name}"`).remove();
        $("#chat-list").animate({ scrollTop: $("#chat-list")[0].scrollHeight }, 200);
        if ($('#dd-message-menu').hasClass('show')) 
          CollabChatTool.unreadMessageCount = 0;
        else CollabChatTool.unreadMessageCount++;
        CollabChatTool.updateChatRoomNotificationBadge();
      } 
        break;
      case 'typing': this.onMessageTyping(message); break;
      // default: console.log(message);
    }

  }
  onMessageText(message) { // console.log(message);
    let align = message.self ? 'flex-row-reverse ms-4' : 'me-4';
    let when = new Date(message.when * 1e3).toISOString().slice(-13, -5);
    let chatHtml = `<span class="my-1 d-flex ${align}">`;
    let bg = message.self ? 'bg-light' : 'bg-warning-subtle';
    chatHtml += ` <span class="mx-2 p-2 border rounded ${bg} d-flex">`
    if(!message.self)
    chatHtml += `   <small class="pe-2 text-primary text-truncate" style="max-width:100px">${message.sender.name}</small>`
    chatHtml += `   <small>${message.text}</small>`
    chatHtml += ` </span>`
    chatHtml += `</span>`
    $('#chat-list').append(chatHtml)
  }
  onMessageTyping(message) {
    let chatHtml = `<span class="mt-1 mx-1 pb-2 typing" data-sender="${message.sender.name}" data-type="typing">`
    chatHtml += `   <small class="px-2 text-muted">${message.sender.name} is typing...</small>`
    chatHtml += `</span>`

    let clearTyping = (username) => {
      $(`#chat-list .typing[data-sender="${username}"`).remove();
      clearTimeout(KitBuildCollab.typingTimeout.get(message.sender.name))
      KitBuildCollab.typingTimeout.delete(message.sender.name)
    }

    if ($(`#chat-list .typing[data-sender="${message.sender.name}"]`).length == 0) {
      $('#chat-list').append(chatHtml)
      $("#chat-list").animate({ scrollTop: $("#chat-list")[0].scrollHeight }, 200);
      KitBuildCollab.typingTimeout.set(message.sender.name,
        setTimeout(() => clearTyping(message.sender.name), 3000));
    } else {
      clearTimeout(KitBuildCollab.typingTimeout.get(message.sender.name))
      KitBuildCollab.typingTimeout.set(message.sender.name, 
        setTimeout(() => clearTyping(message.sender.name), 3000));
    }
  }

  // Chat
  static updateChatRoomName() {
    let room = KitBuildCollab.getPersonalRoom();
    $('#dd-message-menu .room-name').html(room
      ? `<span>${room.name} <span class="badge rounded-pill bg-danger"><i class="bi bi-people-fill me-2"></i>${room.users.length}</span></span>`
      : '<span class="text-danger">&mdash;</span>');
  }
  static updateChatRoomNotificationBadge() { 
    // console.log(CollabChannelTool.unreadMessageCount);
    if (CollabChatTool.unreadMessageCount) {
      $('#notification-message').show();
      $('#dd-message .count').html(CollabChatTool.unreadMessageCount);
    } else $('#notification-message').hide();
  }

}

