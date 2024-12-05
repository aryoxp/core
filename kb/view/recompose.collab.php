<div id="collab-control" class="btn-group btn-group-sm dropup me-2">
  <button id="dd-connection" type="button" class="dd bt-connection-status btn btn-warning dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" data-bs-offset="0,10" aria-expanded="true">
    <i class="bi bi-plug-fill"></i>
  </button>
  <ul id="dd-connection-menu" class="dropdown-menu dropdown-menu-end scroll-y py-2" data-popper-placement="top-end">
    <li><a class="dropdown-item d-flex align-items-center" href="#">
        <span id="notification-connection" class="p-2 badge rounded-pill me-2 bg-danger">
          <span class="visually-hidden">New alerts</span>
        </span>
        <span id="connection-status-text">Server is offline</span>
      </a>
      <div class="text-center text-danger"><em id="connection-status-reason">Error: xhr poll error</em></div>
    </li>
    <li>
      <hr class="dropdown-divider">
    </li>
    <li><a class="dropdown-item d-flex align-items-center" href="#">
        <span id="notification-app-connection" class="p-2 badge rounded-pill bg-danger me-2">
          <span class="visually-hidden">New alerts</span>
        </span>
        <span id="app-connection-status-text">App is disconnected</span></a>
      <small class="mx-auto d-block text-center"><code id="notification-app-socket-id"></code></small>
    </li>
    <li>
      <hr class="dropdown-divider">
    </li>
    <li><a class="bt-connect dropdown-item" href="#"><i class="bi bi-plug-fill text-success"></i> Connect</a></li>
    <li><a class="bt-disconnect dropdown-item disabled" href="#"><i class="bi bi-plug-fill text-danger"></i> Disconnect</a></li>
  </ul><button id="dd-channel" type="button" class="dd btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" data-bs-offset="40,15" aria-expanded="false">
    <i class="bi bi-chat-square-quote-fill"></i>
    <span id="notification-channel" class="position-absolute translate-middle badge rounded-pill bg-danger" style="display: none;">
      <span class="count">99+</span>
      <span class="visually-hidden">New alerts</span>
    </span>
  </button>
  <ul id="dd-channel-menu" class="dropdown-menu scroll-y py-2" style="max-height: 300px;">
    <li class="d-flex justify-content-between align-items-center px-3 py-1"><span class="text-primary">Channel</span><span class="badge rounded-pill bg-primary bt-refresh-channel ms-5" role="button">Refresh</span></li>
    <li class="channel-list"></li>
  </ul><button id="dd-message" type="button" class="dd btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" data-bs-offset="30,15" aria-expanded="false">
    <i class="bi bi-chat-dots-fill"></i>
    <span id="notification-message" class="position-absolute translate-middle badge rounded-pill bg-success" style="display: none;">
      <span class="count">99+</span>
      <span class="visually-hidden">New alerts</span>
    </span>
  </button>
  <ul id="dd-message-menu" class="dropdown-menu" style="width: 300px;">
    <li class="px-2">
      <div class="mb-2 text-muted">Room: <span class="room-name text-primary"><span class="text-danger">—</span></span></div>
      <div class="border rounded mb-2 scroll-y pt-1 overflow-hidden" style="min-height: 100px; max-height: 250px" id="chat-list"></div>
      <form class="chat" name="chat" autocomplete="off">
        <div class="input-group input-group-sm mb-2">
          <input type="text" class="form-control" id="input-message" placeholder="Type Message..." aria-label="Type Message..." aria-describedby="button-send-message">
          <button class="btn btn-primary" id="bt-send-message"><i class="bi bi-send"></i> Send</button>
        </div>
      </form>
    </li>
  </ul>
  <button id="dd-room" type="button" class="dd btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" data-bs-offset="0,15" aria-expanded="false">
    <i class="bi bi-people-fill"></i>
    <span id="notification-room" class="position-absolute top-0 start-100 translate-middle p-2 badge rounded-pill bg-danger" style="display: none;">
      <span class="visually-hidden">New alerts</span>
    </span>
  </button>
  <ul id="dd-room-menu" class="dropdown-menu" style="">
    <li class="px-3 mb-1 d-flex justify-content-between align-items-center flex-nowrap"><span class="me-3 text-nowrap text-dark">Connected Rooms</span><span class="badge rounded-pill bg-primary bt-refresh-rooms" role="button">Refresh</span></li>
    <li class="room-list bg-light"><em class="d-block text-muted text-center p-1">No Rooms</em></li>
    <li>
      <hr class="dropdown-divider">
    </li>
    <li class="published-room-list"><em class="d-block text-muted text-center p-1">No Rooms</em></li>
    <li>
      <hr class="dropdown-divider">
    </li>
    <li><a class="dropdown-item bt-create-room" href="#"><i class="bi bi-plus-lg me-2"></i> Create Room</a></li>
    <li class="px-2 pt-2 d-none bg-light">
      <form class="create-room input-group input-group-sm">
        <input type="text" class="form-control" id="input-room-name">
        <button type="text" class="bt-create btn btn-primary"><i class="bi bi-plus-lg"></i> Create</button>
      </form>
    </li>
  </ul>
</div>