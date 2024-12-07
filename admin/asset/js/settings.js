class App {
  constructor() {
    this.ajax = Core.instance().ajax();
    App.ajax = this.ajax;
    this.handleEvent();
    this.onLoad();
  }
  handleEvent() {
    $('#list-app').on('click', '.bt-register-app', (e) => {
      let key = $(e.currentTarget).parents('.list-item').attr('data-key');
      let name = $(e.currentTarget).parents('.list-item').attr('data-name');
      let postvalue = {
        app: key,
        name: name
      }; // console.log(postvalue);
      this.ajax.post('settingsApi/registerApp', postvalue)
        .then(() => App.listRegisteredApps(), 
        error => (new CoreError(error).show()));
    });
    $('#list-registered-apps').on('click', '.bt-deregister-app', (e) => {
      let app = $(e.currentTarget).parents('.list-item').attr('data-app');
      let postvalue = {
        app: app
      }; // console.log(postvalue);
      this.ajax.post('settingsApi/deregisterApp', postvalue)
        .then(() => App.listRegisteredApps(), 
        error => (new CoreError(error).show()));
    });
    $('#list-registered-apps').on('click', '.bt-select-app', (e) => {
      let app = $(e.currentTarget).parents('.list-item').attr('data-app');
      App.getAppRoles(app);
      $('form#create-role input[name="app"]').val(app);
    });
    $('form#create-role').on('submit', (e) => {
      e.stopPropagation();
      e.preventDefault();
      let app = $('form#create-role input[name="app"]').val();
      let rid = $('form#create-role input[name="rid"]').val();
      let name = $('form#create-role input[name="name"]').val();
      let postvalue = {
        app:app,
        rid:rid,
        name:name
      }; console.log(postvalue);
      if (!app) {
        (new CoreError('App is not selected.')).show();
        return;
      }
      this.ajax.post('settingsApi/createRole', postvalue)
        .then(result => {
          App.getAppRoles(app);
        });
    });
    $('#list-role').on('click', '.bt-authorization', (e) => {
      let app = $('form#create-role input[name="app"]').val();
      let rid = $(e.currentTarget).parents('.list-item').attr('data-rid');
      let postvalue = {
        app: app,
        rid: rid
      }; // console.log(postvalue);
      $('.registered-menu-info').html('App ID: <code>' + app + '</code>, Role ID: <code>' + rid + '</code>');
      $('form#auth-menu input[name="app"]').val(app);
      $('form#auth-menu input[name="rid"]').val(rid);
      App.getAppMenu(app, rid);
    });
    $('#list-role').on('click', '.bt-users', (e) => {
      let app = $('form#create-role input[name="app"]').val();
      let rid = $(e.currentTarget).parents('.list-item').attr('data-rid');
      let postvalue = {
        app: app,
        rid: rid
      }; // console.log(postvalue);
      $('.registered-menu-info').html('App ID: <code>' + app + '</code>, Role ID: <code>' + rid + '</code>');
      $('form#auth-user input[name="app"]').val(app);
      $('form#auth-user input[name="rid"]').val(rid);
      $('form#auth-menu input[name="app"]').val(app);
      $('form#auth-menu input[name="rid"]').val(rid);
      App.getAppUsers(app, rid);
      App.getAppMenu(app, rid);
    });
    $('#list-role').on('click', '.bt-delete', (e) => {
      let app = $('form#create-role input[name="app"]').val();
      let rid = $(e.currentTarget).parents('.list-item').attr('data-rid');
      let row = $(e.currentTarget).parents('.list-item');
      let postvalue = {
        app: app,
        rid: rid
      }; console.log(postvalue);
      CUI.confirm('Delete this role?').positive((e) => {
        console.log('positive');
        App.deleteRole(app, rid).then(ok => {
          row.slideUp('fast', (e) => row.remove());
        }, err => CUI.error(err).show());
      }).negative((e) => {
        console.log('negative')
      }).show();
    });
    $('#list-menu').on('click', '.bt-authorize', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let app = $('form#auth-menu input[name="app"]').val();
      let rid = $('form#auth-menu input[name="rid"]').val();
      let mid = $(e.currentTarget).parents('.list-item').attr('data-mid');
      let postvalue = {
        app: app,
        rid: rid,
        mid: mid
      }; // console.log(postvalue);
      this.ajax.post('settingsApi/authorizeMenu', postvalue)
        .then(result => App.getAppMenu(app, rid));
    });
    $('#list-menu').on('click', '.bt-deauthorize', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let app = $('form#auth-menu input[name="app"]').val();
      let rid = $('form#auth-menu input[name="rid"]').val();
      let mid = $(e.currentTarget).parents('.list-item').attr('data-mid');
      let postvalue = {
        app: app,
        rid: rid,
        mid: mid
      }; // console.log(postvalue);
      this.ajax.post('settingsApi/deauthorizeMenu', postvalue)
        .then(result => App.getAppMenu(app, rid));
    });
    $('form#search-user').on('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let keyword = $('form#search-user input[name="keyword"]').val();
      let postvalue = { keyword: keyword }; // console.log(postvalue);
      let el = $('form#search-user .bt-search');
      let c = CUI.load(el, el.html());
      this.ajax.post('settingsApi/getUsers', postvalue)
        .then(users => { // console.log(users);
          App.listUser(users);
        }, err => CUI.error(err).show())
        .finally(() => CUI.done(el, c));
    });
    $('form#search-user').on('click', '.bt-create', (e) => {
      e.preventDefault();
      e.stopPropagation();
      $('form#user input[name="username"]').val('');
      $('form#user input[name="password"]').attr('required', 'required').val('');
      $('form#user input[name="name"]').val('');
      $('form#user input[name="id"]').val('');
      App.dialogUser = (new CoreWindow('#dialog-user', {
        draggable: true,
        width: '450px'
      })).show();
      App.dialogUser.username = null;
    });
    $('form#user').on('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let username = $('form#user input[name="username"]').val();
      let password = $('form#user input[name="password"]').val();
      let name = $('form#user input[name="name"]').val();
      let id = $('form#user input[name="id"]').val();
      let postvalue = {
        username: username,
        password: password,
        name: name,
        id: id
      }; // console.log(postvalue, e.currentTarget);
      if (/^\s*$/.test(id)) {
        delete postvalue.id;
        let el = $('form#user .bt-save');
        let c = CUI.load(el, 'Saving...');
        this.ajax.post('settingsApi/createUser', postvalue)
          .then(result => {
            $('form#search-user').trigger('submit');
            App.dialogUser.hide();
          }).finally(() => CUI.done(el, c));
      } else {
        let el = $('form#user .bt-save');
        let c = CUI.load(el, 'Saving...');
        this.ajax.post('settingsApi/updateUser', postvalue)
          .then(result => {
            $('form#search-user').trigger('submit');
            App.dialogUser.hide();
          }).finally(() => CUI.done(el, c));
      }
    });
    $('#list-user').on('click', '.bt-select', (e) => {
      let username = $(e.currentTarget).parents('.list-item').attr('data-username');
      let name = $(e.currentTarget).parents('.list-item').attr('data-name');
      let row = $(e.currentTarget).parents('.list-item');
      let app = $('form#authorization select[name="app"]').val();
      $('form#authorization .user-info').html(`${name} <code>${username}</code>`);
      $('form#authorization input[name="username"]').val(username);
      App.getAssignedRole(username, app);
    });
    $('#list-user').on('click', '.bt-delete', (e) => {
      let username = $(e.currentTarget).parents('.list-item').attr('data-username');
      let name = $(e.currentTarget).parents('.list-item').attr('data-name');
      let row = $(e.currentTarget).parents('.list-item');
      let postvalue = {
        username: username
      }; // console.log(postvalue);
      (new CoreConfirm(`Delete User: ${name} <code>${username}</code>?`))
        .positive(() => {
          this.ajax.post('settingsApi/deleteUser', postvalue)
            .then(() => row.fadeOut('fast', function(){$(this).remove()}));
        }).show();
    });
    $('#list-user').on('click', '.bt-edit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let username = $(e.currentTarget).parents('.list-item').attr('data-username');
      let postvalue = { username: username };
      this.ajax.post('settingsApi/getUser', postvalue)
        .then(user => { // console.log(user);
          $('form#user input[name="username"]').val(user.username);
          $('form#user input[name="password"]').removeAttr('required').val('');
          $('form#user input[name="name"]').val(user.name);
          $('form#user input[name="id"]').val(user.username);
          App.dialogUser = (new CoreWindow('#dialog-user', {
            draggable: true,
            width: '450px'
          })).show();
          App.dialogUser.username = username;
        });
    });
    $('form#authorization select[name="app"]').on('change', () => {
      let username = $('form#authorization input[name="username"]').val();
      let app = $('form#authorization select[name="app"]').val();
      App.getAssignedRole(username, app);
    });
    $('#list-assigned-role').on('click', '.bt-assign', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let username = $('form#authorization input[name="username"]').val();
      let app = $('form#authorization select[name="app"]').val();
      let rid = $(e.currentTarget).parents('.list-item').attr('data-rid');
      let postvalue = {
        username: username,
        app: app,
        rid: rid,
      }; // console.log(postvalue);
      this.ajax.post('settingsApi/assignRole', postvalue)
        .then(result => App.getAssignedRole(username, app), (error) => (new CoreError(error)).show());
    });
    $('#list-assigned-role').on('click', '.bt-deassign', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let username = $('form#authorization input[name="username"]').val();
      let app = $('form#authorization select[name="app"]').val();
      let rid = $(e.currentTarget).parents('.list-item').attr('data-rid');
      let postvalue = {
        app: app,
        rid: rid,
        username: username
      }; // console.log(postvalue);
      this.ajax.post('settingsApi/deassignRole', postvalue)
        .then(result => App.getAssignedRole(username, app), (error) => (new CoreError(error)).show());
    });
    $('#list-user-with-role').on('click', '.bt-revoke', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let app = $('form#auth-user input[name="app"]').val();
      let rid = $('form#auth-user input[name="rid"]').val();
      let username = $(e.currentTarget).parents('.list-item').attr('data-username');
      let postvalue = {
        app: app,
        rid: rid,
        username: username
      }; console.log(postvalue);
      (new CoreConfirm(`Cabut role <code>${rid}</code> dari user <code>${username}</code>?`))
        .positive(() => {
          this.ajax.post('settingsApi/deassignRole', postvalue)
            .then(result => {
              App.getAppUsers(app, rid);
            }, (error) => (new CoreError(error)).show());
        }).show();
    });
  }
  onLoad() {
    App.listRegisteredApps();
  }
}

App.listRegisteredApps = () => {
  App.ajax.post('settingsApi/getRegisteredApps').then(regedApps => { // console.log(regedApps);
    let html = ``;
    regedApps.forEach(app => {
      html += `<div class="list-item py-1 px-2 border-bottom d-flex justify-content-between" data-app="${app.app}">`;
      html += `<span><span class="me-2">${app.name}</span> <span class="badge bg-primary text-light">${app.app}</span></span>`;
      html += `<span>`;
      html += `<button class="btn btn-primary btn-sm px-2 py-1 bt-select-app text-light me-1"><i class="bi bi-list"></i> Select</button>`;
      // html += `<button class="btn btn-danger btn-sm px-2 py-1 bt-deregister-app text-light"><i class="bi bi-x-lg"></i> Deregister App</button>`;
      html += `</span>`;
      html += `</div>`;
    }); // var_dump($app);
    if (!regedApps.length) html = `<div class="py-1 px-2 border-bottom"><span class="text-danger">No apps registered</span></div>`;
    $('#list-registered-apps').html(html);
    html = ``;
    regedApps.forEach(app => {
      html += `<option value="${app.app}">${app.name}</option>`;
    }); // var_dump($app);
    $('form#authorization select[name="app"]').html(html);
  })
};
App.getAppRoles = (app) => {
  let postvalue = {
    app: app
  }; // console.log(postvalue);
  App.ajax.post('settingsApi/getAppRoles', postvalue)
  .then(roles => App.listRole(roles, app));
}
App.listRole = (roles, app) => { // console.log(roles);
  let html = ``;
  roles.forEach(role => {
    html += `<div class="list-item py-1 px-2 border-bottom d-flex justify-content-between" data-app="${app}"`;
    html += ` data-rid="${role.rid}" data-name="${role.name}">`;
    html += `<span><span class="me-2">${role.name}</span> <span class="badge bg-primary text-light">${role.rid}</span></span>`;
    html += `<span>`;
    html += `<button class="btn btn-sm btn-warning bt-users px-2 py-1 me-1">`;
    html += `<i class="bi bi-people"></i> Users`;
    html += `</button>`;
    html += `<button class="btn btn-sm btn-primary bt-authorization px-2 py-1 me-1">`;
    html += `<i class="bi bi-lock"></i> Authorization`;
    html += `</button>`;
    html += `<button class="btn btn-sm btn-danger text-light bt-delete px-2 py-1">`;
    html += `<i class="bi bi-x-lg"></i> Delete`;
    html += `</button>`;
    html += `</span>`;
    html += `</div>`;
  }); // var_dump($app);
  if (!roles.length) html = `<div class="py-1 px-2 border-bottom"><span class="text-danger">Selected app has no role definition.</span></div>`;
  $('#list-role').html(html);
  $('.registered-app-info').html('App ID: <code>' + app + '</code>');
}
App.deleteRole = (app, rid) => {
  return new Promise((resolve, reject) => {
    let postvalue = {
      app: app,
      rid: rid
    }; // console.log(postvalue);
    App.ajax.post('settingsApi/deleteRole', postvalue)
      .then(
        result => resolve(result), 
        error => reject(error)
      );
  });
}
App.getAppMenu = (app, rid) => {
  let postvalue = {
    app: app,
    rid: rid
  }; // console.log(postvalue);
  Promise.all([
    App.ajax.post('settingsApi/getAppAuthorizedMenu', postvalue),
    App.ajax.post('settingsApi/getAppMenu', postvalue)
  ]).then(results => {
      let authorizedMenus = results[0];
      let menus = results[1];
      App.listMenu(app, rid, menus, authorizedMenus);
    });
}
App.getAppUsers = (app, rid) => {
  let postvalue = {
    app: app,
    rid: rid
  }; // console.log(postvalue);
  Promise.all([
    // App.ajax.post('settingsApi/getAppAuthorizedMenu', postvalue),
    App.ajax.post('settingsApi/getAppUsers', postvalue)
  ]).then(results => {
      let users = results[0];
      App.listAppUser(app, rid, users);
    });
};
App.isMenuAuthorized = (menu, authorizedMenus) => {
  for(amenu of authorizedMenus) {
    if (menu.id == amenu.mid && menu.app == amenu.app && menu.rid == amenu.rid) 
      return true;
  };
  return false;
} 
App.listMenu = (app, rid, menus, authorizedMenus) => { // console.log(menus);
  let html = ``;
  menus.forEach(menu => {
    menu.app = app;
    menu.rid = rid;
    let authorized = App.isMenuAuthorized(menu, authorizedMenus);
    html += `<div class="list-item py-1 px-2 border-bottom d-flex justify-content-between" data-app=${app} data-rid=${rid} `;
    html += ` data-mid="${menu.id}" data-label="${menu.label}" data-icon="${menu.icon}">`;
    html += `<span><span class="me-2">${menu.label}</span> <span class="badge bg-primary text-light me-1">${menu.id}</span>`;
    if(authorized) html += `<span class="badge bg-success text-light"><i class="bi bi-check-lg"></i></span>`;
    else html += `<span class="badge bg-danger text-light"><i class="bi bi-x-lg"></i></span>`
    html += `</span>`;
    html += `<span>`;
    if(authorized) html += `<button class="btn btn-sm px-2 py-1 btn-danger text-light bt-deauthorize"><i class="bi bi-x-lg"></i></button>`;
    else html += `<button class="btn btn-sm px-2 py-1 btn-success text-light bt-authorize"><i class="bi bi-check-lg"></i> Authorize</button>`
    html += `</span>`;
    html += `</div>`;
  }); // var_dump($app);
  if (!menus.length) html = `<div class="py-1 px-2 border-bottom"><span class="text-danger">Selected app has no menu definition.</span></div>`;
  $('#list-menu').html(html);
}
App.listUser = (users) => {
  let html = ``;
  users.forEach(user => {
    html += `<div class="list-item py-1 px-2 border-bottom d-flex justify-content-between"`;
    html += ` data-username="${user.username}" data-name="${user.name}">`;
    html += `<span><span class="me-2">${user.name}</span>`;
    html += `<code class="">${user.username}</code></span>`;
    html += `<span class="text-nowrap">`;
    html += `<button class="btn btn-sm btn-warning text-dark bt-edit px-2 py-1 me-1">`;
    html += `<i class="bi bi-pencil-fill"></i>`;
    html += `</button>`;
    html += `<button class="btn btn-sm btn-danger text-light bt-delete px-2 py-1 me-1">`;
    html += `<i class="bi bi-x-lg"></i>`;
    html += `</button>`;
    html += `<button class="btn btn-sm btn-primary text-light bt-select px-2 py-1 me-1">`;
    html += `Pilih <i class="bi bi-arrow-right"></i>`;
    html += `</button>`;
    html += `</span>`;
    html += `</div>`;
  }); // var_dump($app);
  if (!users.length) html = `<div class="py-1 px-2 border-bottom"><span class="text-danger">No user data.</span></div>`;
  $('#list-user').html(html);
}
App.getAssignedRole = (username, app) => {
  let postvalue = {
    username: username,
    app: app
  }; // console.log(postvalue);
  Promise.all([
    App.ajax.post('settingsApi/getAppRoles', postvalue),
    App.ajax.post('settingsApi/getAssignedRoles', postvalue)
  ]).then(results => { // console.log(results);
    roles = results[0];
    rids = results[1];
    App.listAssignedRole(roles, rids);
  }); 
};
App.isRoleAssigned = (role, rids) => {
  for(rid of rids) if (role.rid == rid) return true;
  return false;
}
App.listAssignedRole = (roles, rids) => { // console.log(roles);
  let html = ``;
  roles.forEach(role => {
    let assigned = App.isRoleAssigned(role, rids); 
    html += `<div class="list-item py-1 px-2 border-bottom d-flex justify-content-between" `;
    html += ` data-rid="${role.rid}" data-name="${role.name}">`;
    html += `<span>`;
    html += `<span class="me-2">${role.name}</span> <span class="badge bg-primary text-light">${role.rid}</span>`;
    if(assigned) html += `<span class="badge bg-success text-light ms-1"><i class="bi bi-check-lg"></i></span>`;
    else html += `<span class="badge bg-danger text-light ms-1"><i class="bi bi-x-lg"></i></span>`;
    html += `</span>`;
    html += `<span>`;
    if(assigned) html += `<button class="btn btn-sm px-2 py-1 btn-danger text-light bt-deassign"><i class="bi bi-x-lg"></i></button>`;
    else html += `<button class="btn btn-sm px-2 py-1 btn-success text-light bt-assign"><i class="bi bi-check-lg"></i> Assign</button>`;
    html += `</span>`;
    html += `</div>`;
  });
  if (!roles.length) html = `<div class="py-1 px-2 border-bottom"><span class="text-danger">No assigned roles.</span></div>`;
  $('#list-assigned-role').html(html);
};
App.listAppUser = (app, rid, users) => {
  let html = ``;
  users.forEach(user => {
    html += `<div class="list-item py-1 px-2 border-bottom d-flex justify-content-between"`;
    html += ` data-username="${user.username}" data-name="${user.name}">`;
    html += `<span><span class="me-2">${user.name}</span>`;
    html += `<code class="">${user.username}</code></span>`;
    html += `<span>`;
    html += `<button class="btn btn-sm btn-danger text-light bt-revoke px-2 py-1 me-1">`;
    html += `<i class="bi bi-x-lg"></i> Revoke`;
    html += `</button>`;
    html += `</span>`;
    html += `</div>`;
  }); // var_dump($app);
  if (!users.length) html = `<div class="py-1 px-2 border-bottom"><span class="text-danger">No user data.</span></div>`;
  $('#list-user-with-role').html(html);
};

$(() => {
  new App();
});