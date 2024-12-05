class App {
  constructor() {
    App.manager = CollabManager.instance('kitbuild');
    App.manager.on('event', this.onManagerEvent.bind(this));
    this.manager = App.manager;
    App.clientIds = new Set();
    this.handleEvent();
  }

  static instance() {
    return new App();
  }

  handleEvent() {
    const drake = new dragula([
      document.querySelector('#all-client-list'),
      document.querySelector('#room-socket-list')
    ], {
      moves: function (el, container, handle) {
        return handle.classList.contains('handle');
      },
      copy: (el, source) => {
        return source === document.getElementById('all-client-list');
      },
      accepts: (el, target) => {
        return target !== document.getElementById('all-client-list');
      },
      removeOnSpill: true
    });
    
    drake.on('drag', (el, container) => {
      // console.log(el, container, $(el).attr(`data-socketid`));
    });
    drake.on('over', (el, container) => {
      // console.log(el, container, $(container).children(`.client[data-socketid]`));
    });
    drake.on('drop', (el, target, source, sibling) => {
      console.log('drop', el, target, source, sibling);
      let t = $(target).attr('id');
      let s = $(source).attr('id');
      let socketId = $(el).attr('data-socketid');
      let room = $('#room-socket-list').attr('data-room');
      switch(t) {
        case 'room-socket-list':
          let exists = $(target)
            .children(`.client[data-socketid="${socketId}"]`)
            .length > 1; // one is for the shadow
          // console.log(target, socketId, $(target)
          //   .children(`.client[data-socketid="${socketId}"]`), exists);
          if (exists) {
            UI.warning('User already in room.').show();
            drake.cancel(true);
            return;
          }
          if (!room) {
            UI.warning('Invalid room to invite.').show();
            drake.cancel(true);
            return;
          }
          App.manager.inviteUserToRoom(socketId, room).then(result => {
            if (result) {
              $('#room-socket-list').find(`.client[data-socketid="${socketId}"] .bt-invite`).removeClass('btn-outline-primary').addClass('btn-primary');
            } 
            console.log(result);
          });
          break;
      }
    });
    drake.on('remove', (el, container, source, target) => {
      console.log("remove", el, container, source, target);
      let socketId = $(el).attr('data-socketid');
      let room = $('#room-socket-list').attr('data-room');
      if (room && socketId) {
        if (socketId && room) {
          App.manager.letUserLeaveRoom(socketId, room).then(result => {
            if (result) UI.info(`User has been removed from room <strong>${room}</strong>.`).show();
          }, e => {
            UI.error(e).show();
            $('#room-socket-list').append(el);
          });
        } else {
          UI.warning('Invalid socket ID or room name.').show();
          $('#room-socket-list').append(el);
        }
      }
    });
    $('#bt-connect').on('click', e => {
      App.manager.connect();
    });
    $('#bt-disconnect').on('click', e => {
      App.manager.disconnect();
    });
    $('.bt-refresh-clients').on('click', e => {
      let cnt = Loading.load(e.currentTarget, "");
      App.manager.getAllClientSockets().then(clientIds => { 
        this.updateClientList(clientIds);
        Loading.done(e.currentTarget, cnt);
      }, e => UI.error(e).show());
    });
    $('.bt-refresh-sockets').on('click', e => {
      let cnt = Loading.load(e.currentTarget, "");
      let room = $(e.currentTarget).attr('data-room');
      console.warn('triggered');
      if (!room) {
        UI.warning('Room not selected.').show();
        Loading.done(e.currentTarget, cnt);
        console.error('end-triggered');
        return;
      }
      App.manager.getRoomSockets(room).then(sockets => { 
        console.warn(sockets);
        this.updateSocketList(sockets);
        Loading.done(e.currentTarget, cnt);
        console.error('end-triggered');
      }, e => UI.error(e).show());
    });
    $('#room-socket-list').on('click', '.bt-x', e => {
      let socketId = $(e.currentTarget).attr('data-socketid');
      let room = $('#room-socket-list').attr('data-room');
      if (socketId && room) {
        App.manager.letUserLeaveRoom(socketId, room).then(result => {
          if (result) {
            $(`#room-socket-list [data-socketid="${socketId}"]`).fadeOut('fast', () => {
              $(`#room-socket-list [data-socketid="${socketId}"]`).remove();
            });
          }
        }, e => UI.error(e).show());
      } else UI.warning('Invalid socket ID or room name.').show();
    });
    $('.bt-refresh-rooms').on('click', e => {
      let cnt = Loading.load(e.currentTarget, "");
      App.manager.getAllRooms().then(rooms => { // console.error(rooms);
        this.updateRoomList(rooms);
        Loading.done(e.currentTarget, cnt);
      }, e => UI.error(e).show());
    });
    $('#all-room-list').on('click', '.bt-room', e => {
      let room = $(e.currentTarget).attr('data-room');
      $('.bt-refresh-sockets').attr('data-room', room);
      $('#room-section .room-name').html(`${room}`);
      let cnt = Loading.load(e.currentTarget, room);
      App.manager.getRoomSockets(room).then(sockets => { // console.log(sockets);
        this.updateSocketList(sockets);
        Loading.done(e.currentTarget, cnt);
        $('#room-socket-list').attr('data-room', room);
      }, e => UI.error(e).show());
    });
    $('#room-list-section .input-room-name').on('keyup', e => {
      if (e.key == "Enter") 
        $('#room-list-section .bt-create-room').trigger('click');
    });
    $('#room-list-section .bt-create-room').on('click', () => {
      let name = $('#room-list-section .input-room-name').val().trim();
      if (name.length == 0) {
        UI.warning("Please enter a room name.").show();
        return;
      } 
      App.manager.createRoom(name).then(
        room => UI.success('Room has successfully created.').show(), 
        e => UI.error(e).show()
      );
    });
    $('#room-tools .bt-push-mapid').on('click', e => {
      let room = $('#room-socket-list').attr('data-room');
      let mapId = $('#room-tools .input-mapid').val().trim();
      App.manager.pushMapId(mapId, room);
    });
    
  }

  onManagerEvent(event, ...data) { console.log("Consuming event: ", event, data);
    switch(event) {
      case 'connect':
        $('.bt-refresh-rooms').trigger('click');
        break;
      case 'client-disconnect':
        let socketId = data.shift();
        let roomEl = $('#all-room-list').find(`.room[data-room="${socketId}"]`);
        roomEl.fadeOut('fast', () => roomEl.remove());
        break;
      case 'clients-updated':
        this.updateClientList(data.shift());
        break;
      case 'user-registered':
        let user = data.shift();
        let rooms = data.shift();
        this.updateClient(user);
        console.log(rooms);
        for(let room of rooms) this.updateRoom(room);
        break;
      case 'user-join-room': {
          let user = data.shift();
          let room = data.shift();
          console.log(user.name, room.name);
          this.updateRoom(room);
          let name = $('#room-socket-list').attr('data-room');
          if (name == room.name)
            this.addUser('#room-socket-list', user);
        } break;
      case 'user-leave-room': {
          let user = data.shift();
          let room = data.shift();
          console.log(user.name, room.name);
          let roomEl = $('#all-room-list').find(`.room[data-room="${room.name}"]`);
          let name = $('#room-socket-list').attr('data-room');
          App.manager.getRoomSockets(room.name).then(sockets => { // console.log(sockets);
            if (sockets.length == 0) 
              roomEl.fadeOut('fast', () => roomEl.remove());
            $('#all-room-list')
              .find(`.room[data-room="${room.name}"] .room-users-count`)
              .html(sockets.length);
            if (name == room.name) 
              this.removeUser('#room-socket-list', user);
          }, e => UI.error(e).show());
        } break;
      case 'join-room-request-rejected': {
        let room = data.shift();
        let user = data.shift();
        let name = $('#room-socket-list').attr('data-room');
        console.log(room, user, name);
        if (room == name)
          this.removeUser('#room-socket-list', user);
        UI.warning(`Join room requested has been rejected.<br>User ${user.name} of room ${room}.`).show();
      } break;
    }
  }


  updateClientList(users) {
    App.users = new Set(users);
    $('#all-client-list').html('');
    for(let user of users) { // console.log(user);
      this.addUser('#all-client-list', user);
    }
  }

  updateClient(user) {
    $('#all-client-list').find(`.client-name[data-socketid="${user.socketId}"]`).removeClass('bg-secondary').html(user.name);
  }

  updateRoomList(rooms) { // console.log(rooms);
    App.rooms = new Set(rooms);
    $('#all-room-list').html('');
    rooms = [...rooms].sort();
    for(let room of rooms) {
      if (App.clientIds.has(room)) continue;
      this.addRoom(room);
    } 
  }

  addRoom(room) { // console.log("Add room", room);
    let html = '';
    html += `<div class="d-inline-block">`;
    html += `<div class="room btn btn-sm btn-outline-secondary bt-room me-1 mt-1" data-room="${room.name}">`;
    html += `<span class="room-name">${room.name}</span>`;
    html += `<span class="room-users-count badge text-bg-primary ms-1">${room.users.length}</span>`;
    html += `</div>`;
    html += `</div>`;
    $(html).hide().appendTo('#all-room-list').fadeIn('fast');
  }

  updateSocketList(users) {
    $('#room-socket-list').html('');
    for(let user of users)
      this.addUser('#room-socket-list', user);
      // html += `<div><span class="me-2">${socket.user?.name ?? ''}</span><code>${socket.id}</code></div>`;
  }

  updateRoom(room) {
    let roomEl = $('#all-room-list').find(`.room[data-room="${room.name}"]`);
    if (roomEl.length == 0) this.addRoom(room);
    else {  
      $('#all-room-list')
        .find(`.room[data-room="${room.name}"] .room-users-count`)
        .html(room.users.length);
    }
  }

  addUser(container, user) { // console.log(user);
    let el = $(container)
      .find(`.client[data-socketid="${user.socketId}"]`);
    console.log(user, el);
    if (el.length > 0) {
      $(el).find('.bt-invite')
        .removeClass('btn-primary')
        .addClass('btn-success');
      setTimeout(() => {
        $(el).find('.bt-invite')
          .removeClass('btn-success')
          .addClass('btn-outline-primary');
      }, 3000);
      return;
    }

    let html = '';
    html += `<div data-socketid="${user.socketId}" class="client p-1 border rounded d-inline-flex mt-1 me-1 flex-nowrap mw-100">`;
    html += `<span class="d-flex text-truncate">`
    html += `<span class="client-name btn btn-sm me-1 ${user?.name ? '' : 'bg-secondary'} text-truncate" data-bs-toggle="dropdown" aria-expanded="false" data-socketid="${user.socketId}">${user?.name ?? '&nbsp;'}</span>`;
    html += `<ul class="dropdown-menu"><li class="px-2"><small><code>${user.socketId}</code></small></li></ul>`;
    html += `</span>`;
    html += `<span class="btn-group btn-group-sm">`;
    html += `<span class="bt-invite btn btn-sm btn-outline-primary text-nowrap" data-socketid="${user.socketId}"><i class="bi bi-envelope"></i><i class="ms-1 bi bi-plus-lg"></i></span>`;
    html += `<span class="bt-room btn btn-sm btn-outline-primary" data-socketid="${user.socketId}"><i class="bi bi-door-closed"></i></span>`;
    html += `</span>`;
    html += `<span class="bt-x btn btn-sm btn-outline-danger ms-1" data-socketid="${user.socketId}"><i class="bi bi-x-lg"></i></span>`;
    html += `<span class="handle btn btn-sm btn-warning ms-1 px-3" data-socketid="${user.socketId}"><i class="bi bi-arrows-move handle"></i></span>`;
    html += `</div>`;
    $(html).hide().appendTo(container).fadeIn('fast');
  }

  removeUser(container, user) {
    let el = $(container).find(`.client[data-socketid="${user.socketId}"]`);
    el.fadeOut('fast', ()=>el.remove());
  }

}

$(() => App.instance());