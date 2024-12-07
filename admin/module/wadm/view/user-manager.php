<div class="container">

  <div class="row m-5">
    <div class="col">
    <h3 class="mb-5"><i class="bi bi-people-fill text-primary me-3"></i> User Manager</h3>
    </div>
  </div>

  <!-- <div class="row m-5">
    <div class="col">
      <form id="form-search" class="mb-3">
        <div class="input-group mb-3">
          <input type="text" name="keyword" class="form-control w-50 input-keyword" placeholder="Search keyword"
            aria-label="Keyword">
          <select name="perpage" class="form-select flex-shrink-1 input-perpage">
            <option value="1">1</option>
            <option value="5">5</option>
            <option value="10" selected="">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
          </select>
          <button class="btn btn-secondary bt-search"><i class="bi bi-search"></i></button>
        </div>
        <div class="pegawai-list mb-3"></div>
        <div class="pegawai-pagination"></div>
      </form>
    </div>
  </div> -->
  
  <div class="row m-5">
    <div class="col">
      <h5 class="mb-3">Apps Registered</h5>
      <div id="list-registered-apps"></div>
    </div>
  </div>
  <div class="row m-5">
    <div class="col">
      <h5 class="mb-3">Roles</h5>
      <div class="registered-app-info mb-3 px-4 py-3 border rounded bg-light"></div>
      <div id="list-role" class="mb-3"></div>
      <form id="create-role" method="post" class="px-4 py-3 border border-3 rounded bg-white">
        <input type="hidden" name="app" />
        <div class="input-group">
          <input type="text" name="rid" class="form-control" placeholder="Role ID">
          <input type="text" name="name" class="form-control w-25" placeholder="Role Name">
          <button class="btn btn-success text-light btn-sm bt-create">
          <i class="bi bi-universal-access"></i><i class="bi bi-plus"></i> Create
          </button>
        </div>
      </form>
      <h5 class="my-3">Users with Role</h5>
      <div class="registered-menu-info mb-3 px-4 py-3 border rounded bg-light"></div>
      <form id="auth-user" method="post">
        <input type="hidden" name="app" />
        <input type="hidden" name="rid" />
        <div id="list-user-with-role" class="overflow-auto" style="max-height: 300px;"></div>
      </form>
    </div>
    <div class="col">
      <h5 class="mb-3">Menus</h5>
      <div class="registered-menu-info mb-3 px-4 py-3 border rounded bg-light"></div>
      <form id="auth-menu" method="post">
        <input type="hidden" name="app" />
        <input type="hidden" name="rid" />
        <div id="list-menu"></div>
      </form>
    </div>
  </div>
  <div class="row m-5">
    <div class="col-12">
      <h4 class="py-2 mb-3 border-bottom text-primary">User Manager</h4>
    </div>
    <div class="col">
      <h5 class="mb-3">Users</h5>
      <form id="search-user" method="post" class="mb-3">
        <input type="hidden" name="app">
        <div class="input-group">
          <input type="text" name="keyword" class="form-control" placeholder="Keyword">
          <button class="btn btn-secondary text-light btn-sm bt-search">
            <i class="bi bi-search"></i>
          </button>
          <button class="btn btn-success text-light btn-sm bt-create">
            <i class="bi bi-person-plus-fill"></i> Create
          </button>
        </div>
      </form>
      <div id="list-user" class="overflow-auto" style="max-height: 300px;"></div>
    </div>
    <div class="col">
      <h5 class="mb-3">Application Roles</h5>
      <form id="authorization" method="post">
        <div class="user-info mb-3 px-4 py-3 border rounded bg-light"></div>
        <input type="hidden" name="username"/>
        <div class="input-group">
          <select name="app" class="form-select"></select>
        </div>
        <div id="list-assigned-role" class="my-3"></div>
      </form>
    </div>
  </div>
  <div id="dialog-user" class="border rounded shadow p-4 bg-white" style="display:none;">
    <h5 class="mb-3">User</h5>
    <div>
      <form id="user" method="post">
        <input type="hidden" name="id" />
        <div class="form-group row mb-2">
          <label for="input-username" class="col-4 col-form-label">Username</label>
          <div class="col-8">
            <input type="text" name="username" class="form-control" id="input-username" required="required" autocomplete="one-time-code" />
          </div>
        </div>
        <div class="form-group row mb-2">
          <label for="input-password" class="col-4 col-form-label">Password</label>
          <div class="col-8">
            <input id="input-password" name="password" placeholder="" type="password" autocomplete="one-time-code" class="form-control">
            <span id="input-passwordHelpBlock" class="form-text text-muted">Kosongkan jika password tidak diubah.</span>
          </div>
        </div>
        <div class="form-group row mb-2">
          <label for="input-name" class="col-4 col-form-label">Name</label>
          <div class="col-8">
            <input id="input-name" name="name" placeholder="" type="text" class="form-control" required="required">
            <span id="input-nameHelpBlock" class="form-text text-muted">Full Name</span>
          </div>
        </div>
        <hr>
        <div class="text-end">
          <button class="app-btn-close-dialog btn btn-outline-secondary border border-secondary">Close</button>
          <button class="btn-save btn btn-success text-light fw-normal ms-2">Save</button>
        </div>
      </form>
    </div>
  </div>
</div>
