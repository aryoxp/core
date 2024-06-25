<div class="app-navbar d-flex p-2 border-bottom">  
  <button class="bt-open btn btn-sm btn-primary"><i class="bi bi-folder2-open"></i> Open Concept Map</button>
  <div class="btn-group btn-group-sm ms-2">
    <button class="bt-teacher-map btn btn-primary"><i class="bi bi-person-video3"></i> Teacher Map</button>
    <button class="bt-proposition-set-analysis btn btn-primary"><i class="bi bi-intersect"></i> Proposition Set Analysis</button>
  </div>
  <div class="btn-group btn-group-sm ms-2">
    <button class="bt-student-map btn btn-primary"><i class="bi bi-person-video2"></i> Student Map</button>
    <button class="bt-map-dev-chart btn btn-primary"><i class="bi bi-graph-up-arrow"></i> Map Development Chart</button>
  </div>
</div>

<div class="d-flex flex-fill align-items-stretch">
  <div class="analyzer-sidebar d-flex flex-column" style="flex-basis: 280px">
    <div class="px-1 ps-2 d-flex align-items-center my-1">
      <small>Kit</small>
      <select name="kid" id="select-kid" class="form-select form-select-sm ms-2">
        <option class="default">All Kits</option>
      </select>
    </div>
    <!-- <div class="d-flex align-items-center p-1 border-bottom text-smaller justify-content-end">
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-auto"> <label for="cb-lm-auto" class="mx-1">Autosave</label>
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-draft"> <label for="cb-lm-draft" class="mx-1">Draft</label>
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-feedback"> <label for="cb-lm-feedback" class="mx-1">Feedback</label>
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-final" checked> <label for="cb-lm-final" class="mx-1">Final</label>
    </div> -->
    <div class="d-flex align-items-center p-1 border-bottom text-smaller justify-content-end">
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-all"> <label for="cb-lm-all" class="mx-1">All</label>
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-first"> <label for="cb-lm-first" class="mx-1">First</label>
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-last" checked> <label for="cb-lm-last" class="mx-1">Last</label>
    </div>
    <div class="d-flex justify-content-between align-items-center p-1 border-bottom text-smaller">
      <span class="ms-1">Session</span>
      <span class="d-flex align-items-center">
        <!-- <input type="checkbox" id="cb-lm-score" class="me-1"> -->
        <label for="cb-lm-score" class="me-1" role="button">Duration</label>
      </span>
    </div>
    <!-- <div id="list-session" class="text-smaller flex-fill bg-white overflow-scroll p-2">
    </div> -->
    <div class="flex-fill d-flex position-relative align-items-stretch">
      <div id="list-session" class="bg-white position-absolute h-100 w-100 text-small scroll-y">
      </div>
    </div>
    <div id="group-map-tools">
      <div class="p-2">
        <button class="bt-group-map btn btn-sm btn-primary">Group Map</button>
        <small class="ms-4">Range: <span id="min-max-range" class="fw-bold text-primary">0 ~ 0</span></small>
      </div>
      <div class="p-2 pt-0">
        <span class="d-flex align-items-center">
          <span class="text-smaller text-center" style="flex-basis: 45px">Min</span>
          <input type="range" class="form-range" id="group-min-val" min="0" max="0">
          <span class="text-smaller text-center" id="group-min-val-label" style="flex-basis: 35px">0</span>
        </span>
        <span class="d-flex align-items-center">
          <span class="text-smaller text-center" style="flex-basis: 45px">Max</span>
          <input type="range" class="form-range" id="group-max-val" min="0" max="0">
          <span class="text-smaller text-center" id="group-max-val-label" style="flex-basis: 35px">0</span>
        </span>
      </div>
    </div>
  </div>
  <div class="d-flex flex-column flex-fill align-items-stretch">
    <!-- container of this layout template must have a display: flex style -->
    <!-- or add d-flex Bootstrap class to this layout's container/parent   -->
    <div class="kb-container d-flex flex-fill flex-column border bg-white rounded">
      <div class="kb-toolbar p-1 d-flex align-items-center justify-content-between bg-light border-bottom">
        <span class="left-stack"></span>
        <span class="center-stack"><span class="btn btn-sm">&nbsp;</span></span>
        <span class="right-stack"></span>
      </div>
      <div id="analyzer-canvas" class="kb-cy flex-fill"></div>
    </div>
    <div class="p-1">
      <span class="d-block text-smaller"><span class="fw-bold me-2">Info:</span><span class="timeline-info"></span></span>
      <span class="d-flex align-items-center">
        <span class="text-smaller text-center" id="timeline-min-val-label" style="flex-basis: 45px">Min</span>
        <input type="range" class="form-range" id="timeline-range" min="0" max="0">
        <span class="text-smaller text-center" id="timeline-max-val-label" style="flex-basis: 45px">0</span>
      </span>
    </div>
  </div>
</div>






<form id="concept-map-open-dialog" class="card d-none">
  <h6 class="card-header"><i class="bi bi-folder2-open"></i> Open/Create Kit of a Concept Map</h6>
  <div class="card-body">
    <!-- <ul class="nav nav-pills" id="open-concept-map-tab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link px-2 py-1 active" id="home-tab" data-bs-toggle="tab" data-bs-target="#database" type="button" role="tab" aria-controls="home" aria-selected="true"><small>Database</small></button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link px-2 py-1" id="profile-tab" data-bs-toggle="tab" data-bs-target="#decode" type="button" role="tab" aria-controls="profile" aria-selected="false"><small>Decode</small></button>
      </li>
    </ul> -->
    <!-- <hr class="my-2"> -->
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="database" role="tabpanel" aria-labelledby="database-tab">
        <div class="input-group mb-3" id="form-search-concept-map">
          <input type="text" class="form-control" name="keyword" placeholder="Keyword" aria-label="Search keyword" aria-describedby="button-search-cmap">
          <button class="btn btn-outline-secondary" type="button" id="button-search-cmap"><i class="bi bi-search"></i></button>
        </div>
        <div class="row gx-2 mb-1">
          <div class="col d-flex text-center text-primary">
            <span class="border-bottom px-2 py-1 flex-fill position-relative">Concept Map</span>
          </div>
        </div>
        <div class="row gx-2 mb-3">
          <div class="col list-concept-map scroll-y" style="height:150px;"></div>
        </div>
        <div class="badge rounded-pill bg-success bt-refresh-cmap-list px-3" role="button">Refresh Concept Map List
        </div>
      </div>
      <div class="tab-pane fade" id="decode" role="tabpanel" aria-labelledby="decode-tab">
        <div class="mb-3">
          <label for="decode-textarea" class="form-label">Concept Map Data</label>
          <textarea class="form-control" id="decode-textarea" rows="4"></textarea>
        </div>
      </div>
    </div>
  </div>
  <div class="card-footer">
    <div class="row">
      <div class="col text-end">
        <button class="bt-cancel btn btn-sm btn-secondary" style="min-width: 6rem;"><?php echo Lang::l('cancel'); ?></button>
        <button class="bt-open btn btn-sm btn-primary ms-1" style="min-width: 6rem;">
          <i class="bi bi-folder2-open"></i> <?php echo Lang::l('open'); ?></button>
      </div>
    </div>
  </div>
</form>


<div id="devchart-dialog" class="card d-none" style="min-height:500px;">
  <h6 class="card-header"><i class="bi bi-folder2-open"></i> Concept Map Development Chart</h6>
  <div class="card-body">
    <canvas id="analyzer-chart"></canvas>
  </div>
  <div class="card-footer">
    <div class="row">
      <div class="col text-end">
        <button class="bt-cancel btn btn-sm btn-secondary" style="min-width: 6rem;"><?php echo Lang::l('cancel'); ?></button>
        <button class="bt-open btn btn-sm btn-primary ms-1" style="min-width: 6rem;">
          <i class="bi bi-folder2-open"></i> <?php echo Lang::l('open'); ?></button>
      </div>
    </div>
  </div>
</div>