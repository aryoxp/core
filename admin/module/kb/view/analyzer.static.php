<div class="app-navbar d-flex p-2 border-bottom">
  <button class="bt-open btn btn-sm btn-primary"><i class="bi bi-folder2-open"></i> Open Concept Map</button>
  <button class="bt-teacher-map btn btn-sm btn-secondary ms-2"><i class="bi bi-person-video3"></i> Teacher Map</button>
  <button class="bt-student-map btn btn-sm btn-secondary ms-2"><i class="bi bi-person-video2"></i> Student Map</button>
  <button class="bt-compare-map btn btn-sm btn-success ms-2"><i class="bi bi-intersect"></i> Compare Map</button>
</div>

<div class="d-flex flex-fill align-items-stretch">
  <div class="analyzer-sidebar d-flex flex-column" style="flex-basis: 280px">
    <div class="px-1 ps-2 d-flex align-items-center my-1">
      <small>Kit</small>
      <select name="kid" id="select-kid" class="form-select form-select-sm ms-2">
        <option class="default">All Kits</option>
      </select>
    </div>
    <div class="d-flex align-items-center p-1 border-bottom text-smaller justify-content-end">
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-auto"> <label for="cb-lm-auto" class="mx-1">Autosave</label>
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-draft"> <label for="cb-lm-draft" class="mx-1">Draft</label>
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-feedback"> <label for="cb-lm-feedback" class="mx-1">Feedback</label>
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-final" checked> <label for="cb-lm-final" class="mx-1">Submitted</label>
    </div>
    <div class="d-flex align-items-center p-1 border-bottom text-smaller justify-content-end">
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-all"> <label for="cb-lm-all" class="mx-1">All</label>
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-first"> <label for="cb-lm-first" class="mx-1">First</label>
      <input type="checkbox" class="cb-score ms-1" id="cb-lm-last" checked> <label for="cb-lm-last" class="mx-1">Last</label>
    </div>
    <div class="d-flex justify-content-between align-items-center p-1 border-bottom text-smaller">
      <span>
        <span class="ms-1">Concept Map</span>
        <span class="ms-2 bt-download-xlsx" role="button">
          <i class="bi bi-download text-primary"></i>
          <span class="btn-link">Download (XLSX)</span>
        </span>
      </span>
      <span class="d-flex align-items-center">
        <input type="checkbox" id="cb-lm-score" class="me-1">
        <label for="cb-lm-score" class="me-1" role="button">Score</label>
      </span>
    </div>
    <!-- <div id="list-learnermap" class="text-smaller flex-fill bg-white overflow-scroll p-2">
    </div> -->
    <div class="flex-fill d-flex position-relative align-items-stretch">
      <div id="list-learnermap" class="bg-white position-absolute h-100 w-100 text-smaller scroll-y">
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
  <div class="d-flex flex-fill align-items-stretch">
    <!-- container of this layout template must have a display: flex style -->
    <!-- or add d-flex Bootstrap class to this layout's container/parent   -->
    <div class="kb-container d-flex flex-fill flex-column border bg-white rounded">
      <div class="kb-toolbar p-1 d-flex align-items-center justify-content-between bg-light border-bottom">
        <span class="left-stack"><span id="analyzer-canvas-compare">
            <div class="btn-group btn-group-sm">
              <button id="bt-dd-compare-switches" class="btn btn-outline-primary btn-sm dropdown-toggle dd-compare show" type="button" data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="true">
                <i class="bi bi-toggles"></i>
              </button>
              <div id="dd-menu-compare-switches" class="dropdown-menu p-2 show" style="min-width: 0px; position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(0px, 33px);" data-popper-placement="bottom-start">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="switch-match" checked="">
                  <label class="form-check-label" for="switch-match"><span class="badge rounded-pill bg-success text-truncate" style="width: 4rem">Match</span></label>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="switch-miss" checked="">
                  <label class="form-check-label" for="switch-miss"><span class="badge rounded-pill bg-danger text-truncate" style="width: 4rem">Miss</span></label>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="switch-excess" checked="">
                  <label class="form-check-label" for="switch-excess"><span class="badge rounded-pill bg-info text-dark text-truncate" style="width: 4rem">Excess</span></label>
                </div>
              </div>
            </div>
          </span></span>
        <span class="center-stack"><span id="analyzer-canvas-camera">
            <div class="btn-group ms-2">
              <button class="btn btn-sm btn-outline-secondary" disabled="">
                <i class="bi bi-camera-video"></i></button>
              <button class="bt-zoom-in btn btn-sm btn-outline-primary" data-tippy-content="">
                <i class="bi bi-zoom-in"></i></button>
              <button class="bt-zoom-out btn btn-sm btn-outline-primary" data-tippy-content="">
                <i class="bi bi-zoom-out"></i></button>
              <button class="bt-center-screen btn btn-sm btn-outline-primary" data-tippy-content="">
                <i class="bi bi-arrows-move"></i></button>
              <button class="bt-fit-screen btn btn-sm btn-outline-primary" data-tippy-content="">
                <i class="bi bi-arrows-fullscreen"></i></button>
              <button class="bt-reset btn btn-sm btn-outline-primary" data-tippy-content="">
                <i class="bi bi-arrow-counterclockwise"></i></button>
            </div>
          </span><span id="analyzer-canvas-utility">
            <div class="btn-group ms-2">
              <button class="btn btn-sm btn-outline-secondary" disabled="">
                <i class="bi bi-tools"></i>
              </button>
              <button class="bt-search btn btn-sm btn-outline-primary" data-tippy-content="Search" data-bs-auto-close="outside" data-bs-toggle="dropdown">
                <i class="bi bi-search"></i>
              </button>
              <div class="dropdown-menu kb-search-toolbar p-2" tabindex="-1" role="dialog" aria-hidden="true" style="width: 450px">
                <div class="input-group input-group-sm d-flex align-items-center">
                  <input type="text" class="form-control form-control-sm input-keyword" value="" placeholder="">
                  <button class="bt-find btn btn-sm btn-primary"><i class="bi bi-search"></i></button>
                  <btn class="search-status btn btn-sm btn-outline-secondary">No results</btn>
                  <button class="bt-next btn btn-sm btn-outline-secondary" disabled=""><i class="bi bi-chevron-down"></i></button>
                  <button class="bt-prev btn btn-sm btn-outline-secondary" disabled=""><i class="bi bi-chevron-up"></i></button>
                  <button class="bt-close btn btn-sm btn-outline-danger"><i class="bi bi-x-lg"></i></button>
                </div>
              </div>
              <button class="bt-screen-capture btn btn-sm btn-outline-primary" data-tippy-content="Save map as Image">
                <i class="bi bi-camera"></i>
              </button>

            </div>
          </span><span id="analyzer-canvas-layout">
            <div class="btn-group ms-2">
              <button class="btn btn-outline-primary btn-sm dropdown-toggle dd-layout" type="button" data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false">
                <i class="bi bi-grid-1x2"></i>
              </button>
              <div class="dropdown-menu fs-small px-2">
                <div class="d-flex flex-column">
                  <button class="btn btn-sm btn-primary bt-auto-layout">
                    <i class="bi bi-magic"></i> Auto Layout
                  </button>
                  <hr class="my-2">
                  <small class="text-center">Selection</small>
                  <button class="btn btn-sm btn-secondary bt-layout-select-graph my-1">
                    <i class="bi bi-bounding-box-circles"></i> Select Graph
                  </button>
                  <button class="btn btn-sm btn-secondary bt-layout-select-color my-1">
                    <i class="bi bi-palette-fill"></i> Select Color
                  </button>
                  <button class="btn btn-sm btn-secondary bt-layout-select-free-nodes my-1">
                    <i class="bi bi-grid"></i> Free Nodes
                  </button>
                  <button class="btn btn-sm btn-secondary bt-layout-select-free-concepts my-1">
                    <i class="bi bi-grid"></i> Free Concepts
                  </button>
                  <button class="btn btn-sm btn-secondary bt-layout-select-free-links my-1">
                    <i class="bi bi-grid"></i> Free Links
                  </button>
                  <hr class="my-2">
                  <small class="text-center">with Selection</small>
                  <button class="btn btn-sm btn-success bt-layout-selection mt-1">
                    <i class="bi bi-grid-1x2-fill"></i> Layout
                  </button>
                </div>
              </div>
            </div>
          </span></span>
        <span class="right-stack"></span>
      </div>
      <div id="analyzer-canvas" class="kb-cy flex-fill"></div>
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




<div id="proposition-dialog" class="card d-none">
  <h6 class="card-header d-flex">
    <span class="drag-handle flex-fill"><i class="dialog-icon bi bi-bezier me-2"></i> <span class="dialog-title">Propositions</span></span>
    <i class="bi bi-x-lg bt-close bt-x" role="button"></i>
  </h6>
  <div class="card-body">
    <div class="proposition-list"></div>
  </div>
  <div class="card-footer text-end">
    <button class="btn btn-sm btn-secondary bt-close px-5"><?php echo Lang::l('ok'); ?></button>
  </div>
</div>

<div id="proposition-author-dialog" class="card d-none">
  <h6 class="card-header d-flex">
    <span class="drag-handle flex-fill"><i class="dialog-icon bi bi-bezier me-2"></i> <span class="dialog-title">Proposition Authors</span></span>
    <i class="bi bi-x-lg bt-close bt-x" role="button"></i>
  </h6>
  <div class="card-body">
    <div class="author-list scroll-y" style="max-height: 150px;"></div>
  </div>
  <div class="card-footer text-end">
    <button class="btn btn-sm btn-secondary bt-close px-5"><?php echo Lang::l('ok'); ?></button>
  </div>
</div>