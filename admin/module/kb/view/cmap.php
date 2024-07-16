<!-- <div id="viewerContainer" style="position: absolute">
  <div id="viewer" class="pdfViewer"></div>
</div> -->

<div class="app-navbar d-flex p-2 border-bottom">
  <div class="btn-group btn-group-sm me-2">
    <button class="bt-new btn btn-primary"><i class="bi bi-asterisk"></i> New</button>
    <button class="bt-open btn btn-sm btn-primary"><i class="bi bi-folder2-open"></i> Open</button>
  </div>
  <div class="btn-group btn-group-sm me-2">
    <button class="bt-content btn btn-primary"><i class="bi bi-file-richtext"></i> Content</button>
  </div>
  <div class="btn-group btn-group-sm me-2">
    <button class="bt-import btn btn-outline-secondary"><i class="bi bi-arrow-right-short"></i><i class="bi bi-code-square"></i> Import</button>
    <button class="bt-export btn btn-outline-secondary"><i class="bi bi-send"></i> Export</button>
  </div>
  <div class="btn-group btn-group-sm me-2">
    <button class="bt-save btn btn-outline-primary"><i class="bi bi-save"></i> Save</button>
    <button class="bt-save-as btn btn-outline-primary"><i class="bi bi-front"></i> Save As...</button>
  </div>
  <button class="bt-compose-kit btn btn-warning btn-sm" disabled><i class="bi bi-grid-1x2"></i><i class="bi bi-arrow-right-short"></i><i class="bi bi-layout-wtf"></i> Compose Kit</button>
</div>
<div class="d-flex flex-fill align-items-stretch">
  <?php // $this->pluginView('kitbuild-ui', ["id" => "goalmap-canvas"], 0); 
  ?>
  <!-- container of this layout template must have a display: flex style -->
  <!-- or add d-flex Bootstrap class to this layout's container/parent   -->
  <div class="kb-container d-flex flex-fill flex-column border bg-white rounded">
    <div class="kb-toolbar p-1 d-flex align-items-center justify-content-between bg-light border-bottom">
      <span class="left-stack"></span>
      <span class="center-stack"><span class="btn btn-sm">&nbsp;</span></span>
      <span class="right-stack"></span>
    </div>
    <div id="goalmap-canvas" class="kb-cy flex-fill"></div>
  </div>
</div>


<div id="concept-map-export-dialog" class="card d-none">
  <h6 class="card-header"><i class="bi bi-send"></i> Export</h6>
  <div class="card-body">
    <textarea class="form-control encoded-data" rows="5"></textarea>
  </div>
  <div class="card-footer text-end">
    <button class="btn btn-sm btn-secondary bt-cancel px-3">Cancel</button>
    <button class="btn btn-sm btn-primary ms-1 bt-clipboard px-3"><i class="bi bi-clipboard"></i> Copy to
      Clipboard</button>
  </div>
</div>

<div id="concept-map-import-dialog" class="card d-none">
  <h6 class="card-header"><i class="bi bi-arrow-right-short"></i><i class="bi bi-code-square"></i> Import</h6>
  <div class="card-body">
    <textarea class="form-control encoded-data" rows="5"></textarea>
  </div>
  <div class="card-footer d-flex text-end">
    <button class="btn btn-sm btn-secondary bt-cancel px-3">Cancel</button>
    <span class="flex-fill">&nbsp;</span>
    <button class="btn btn-sm btn-success bt-paste"><i class="bi bi-clipboard"></i> Paste</button>
    <button class="btn btn-sm btn-primary ms-1 bt-decode px-3"><i class="bi bi-clipboard"></i> Decode</button>
  </div>
</div>


<div id="concept-map-save-as-dialog" class="card d-none">
  <h6 class="card-header"><i class="bi bi-file-earmark-plus dialog-icon"></i> <span class="dialog-title">Save Concept Map As...</span></h6>
  <div class="card-body">
    <div class="row mb-1 align-items-center">
      <label for="input-fid" class="col-sm-2 col-form-label">ID</label>
      <div class="col-sm-10">
        <div class="input-group">
          <input type="text" class="form-control input-fid form-control-sm" placeholder="Concept Map ID" name="fid" id="input-fid" style="text-transform: lowercase;" required>
          <button class="bt-generate-fid btn btn-warning btn-sm"><i class="bi bi-magic"></i></button>
        </div>
        <small class="text-secondary">Required for identifying the concept map.<br>Do not include whitespace character on ID.</small>
      </div>
    </div>
    <div class="row align-items-center mb-1 mt-3">
      <label for="input-title" class="col-sm-2 col-form-label">Title</label>
      <div class="col-sm-10">
        <input type="text" name="title" class="form-control input-title" placeholder="Concept Map Title" id="input-title" required>
        <small class="text-secondary">Required for displaying the name of concept map.</small>
      </div>
    </div>
  </div>
  <div class="card-footer">
    <div class="row">
      <div class="col text-end">
        <button class="bt-cancel btn btn-sm btn-secondary" style="min-width: 6rem;">Cancel</button>
        <button class="bt-save btn btn-sm btn-primary ms-1" style="min-width: 6rem;">Save</button>
      </div>
    </div>
  </div>
</div>

<div id="concept-map-open-dialog" class="card d-none">
  <h6 class="card-header"><i class="bi bi-folder2-open"></i> Open Concept Map</h6>
  <div class="card-body">
    <ul class="nav nav-pills" id="open-concept-map-tab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link px-2 py-1 active" id="home-tab" data-bs-toggle="tab" data-bs-target="#database" type="button" role="tab" aria-controls="home" aria-selected="true"><small>Database</small></button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link px-2 py-1" id="profile-tab" data-bs-toggle="tab" data-bs-target="#decode" type="button" role="tab" aria-controls="profile" aria-selected="false"><small>Decode Map</small></button>
      </li>
    </ul>
    <hr class="my-2">
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="database" role="tabpanel" aria-labelledby="database-tab">
        <div class="row gx-2 mb-1">
          <div class="col d-flex">
            <span class="border-bottom px-2 py-1 flex-fill position-relative">Concept Map</span>
          </div>
        </div>
        <div class="row gx-2 mb-3">
          <div class="col list list-concept-map" style="min-height:150px;"></div>
        </div>
        <div class="badge rounded-pill bg-secondary bt-refresh-cmap-list" role="button">Refresh Concept Map List</div>
      </div>
      <div class="tab-pane fade" id="decode" role="tabpanel" aria-labelledby="decode-tab">
        <div class="mb-3">
          <label for="decode-textarea" class="form-label">Concept Map Data</label>
          <textarea class="form-control" id="decode-textarea" rows="4"></textarea>
          <div class="text-end mt-2">
            <button class="btn btn-sm btn-primary bt-paste"><i class="bi bi-clipboard"></i> Paste</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card-footer">
    <div class="row">
      <div class="col text-end">
        <button class="bt-cancel btn btn-sm btn-secondary" style="min-width: 6rem;"><?php echo Lang::l('cancel'); ?></button>
        <button class="bt-open btn btn-sm btn-primary ms-1" style="min-width: 6rem;"><?php echo Lang::l('open'); ?></button>
      </div>
    </div>
  </div>
</div>

<!-- <div id="assign-topic-dialog" class="card d-none">
  <h6 class="card-header d-flex">
    <span class="drag-handle flex-fill"><i class="dialog-icon bi bi-lightbulb me-2"></i> <span class="dialog-title"><?php echo Lang::l("cmap-assign-topic"); ?></span></span>
    <i class="bi bi-x-lg bt-close bt-x" role="button"></i>
  </h6>
  <div class="card-body">
    <div class="border-bottom mb-2 pb-2">
      <span class="h6">Concept Map Name: <span class="text-primary cmap-title"></span></span><br>
      <span class="h6">Current assigned topic: <span class="text-primary cmap-topic"></span></span>
    </div>
    <form class="row form-assign-search-topic g-3 needs-validation" novalidate>
      <div class="col">
        <div class="input-group input-group-sm mb-3">
          <input type="text" name="keyword" class="form-control w-50 input-keyword" placeholder="Search keyword" aria-label="Keyword">
          <select name="perpage" class="form-select flex-shrink-1 input-perpage">
            <option value="1">1</option>
            <option value="5" selected>5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
          <button class="btn btn-secondary bt-search"><i class="bi bi-search"></i></button>
        </div>
        <div class="list-topic"></div>
        <div class="list-topic-pagination pagination text-center"></div>
      </div>
    </form>
  </div>
  <div class="card-footer text-end">
    <button class="btn btn-sm btn-secondary bt-close px-4"><?php echo Lang::l('close'); ?></button>
  </div>
</div> -->

<div id="content-dialog" class="card d-none">
  <h6 class="card-header d-flex">
    <span class="drag-handle flex-fill">
      <i class="dialog-icon bi bi-file-earmark-font me-2"></i> 
      <span class="dialog-title">References</span></span>
    <i class="bi bi-x-lg bt-close bt-x" role="button"></i>
  </h6>
  <div class="card-body">
    <button class="btn btn-sm btn-success bt-refresh"><i class="bi bi-arrow-repeat"></i> Refresh</button>
    <div class="list-references mt-2"></div>
    <div class="file-drop-area mt-2">
      <span class="fake-btn btn btn-primary me-3">Choose file</span>
      <span class="file-msg">or drop file here</span>
      <input class="file-input" type="file" multiple>
      <div class="item-delete me-4"></div>
    </div>
  </div>
  <div class="card-footer text-end">
    <button class="btn btn-sm btn-secondary bt-close px-4"><?php echo Lang::l('close'); ?></button>
  </div>
</div>

<div id="pdf-dialog" class="card d-none rounded rounded-3 p-1">
  <div class="toolbar p-1 d-flex align-items-center justify-content-between bg-light border-bottom">
    <span class="left-stack"></span>
    <span class="drag-handle flex-fill">&nbsp;</span>
    <span class="center-stack">
      <span id="pdf-dialog-camera">
        <div class="btn-group ms-2">
          <button class="btn btn-sm btn-outline-secondary" disabled="">
            <i class="bi bi-camera-video"></i></button>
          <button class="bt-zoom-in btn btn-sm btn-outline-primary" data-tippy-content="">
            <i class="bi bi-zoom-in"></i></button>
          <button class="bt-zoom-out btn btn-sm btn-outline-primary" data-tippy-content="">
            <i class="bi bi-zoom-out"></i></button>
          <button class="bt-page-width btn btn-sm btn-outline-primary" data-tippy-content="">
            <i class="bi bi-arrows"></i></button>
          <button class="bt-page-height btn btn-sm btn-outline-primary" data-tippy-content="">
            <i class="bi bi-arrows-vertical"></i></button>
          <button class="bt-zoom-auto btn btn-sm btn-outline-primary" data-tippy-content="">
            <i class="bi bi-arrow-counterclockwise"></i></button>
        </div>
      </span><span id="pdf-dialog-utility">
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
              <button class="bt-close-search btn btn-sm btn-outline-danger"><i class="bi bi-x-lg"></i></button>
            </div>
          </div>
          <button class="bt-print btn btn-sm btn-outline-primary" data-tippy-content="">
            <i class="bi bi-printer"></i></button>
          <button class="bt-download btn btn-sm btn-outline-primary" data-tippy-content="">
            <i class="bi bi-download"></i></button>
        </div>
      </span>
    </span>
    <span class="drag-handle flex-fill">&nbsp;</span>
    <span class="right-stack">
      <button class="bt-close btn btn-sm" style="right:0;"><i class="bi bi-x-lg"></i></button>
    </span>
  </div>
  <div class="card-body d-flex align-items-stretch" style="height: 500px;">
    <div id="viewerContainer" class="overflow-auto position-absolute bg-secondary" style="width: calc(100% - 42px); height: calc(100% - 100px);">
      <div id="viewer" class="pdfViewer"></div>
    </div>
    <span class="pdf-info position-absolute pb-1 text-secondary" style="bottom:0; font-size:0.9rem;"><span class="page-info"></span></span>
    <button class="bt-resize btn btn-sm position-absolute" style="bottom:0; right:0;"><i class="bi bi-arrows-angle-expand"></i></button>
  </div>  
</div>

<!-- <div id="concept-map-copy-paste-dialog" class="card d-none">
  <h6 class="card-header"><i class="dialog-icon bi"></i> <span class="dialog-title"><?php echo Lang::l('copy'); ?></span></h6>
  <div class="card-body">
    <textarea class="form-control encoded-data" rows="5"></textarea>
  </div>
  <div class="card-footer text-end">
    <button class="btn btn-sm btn-secondary bt-cancel px-3"><?php echo Lang::l('cancel'); ?></button>
    <button class="btn btn-sm btn-secondary bt-paste px-3 ms-1"><i class="bi bi-clipboard"></i> Paste Clipboard</button>
    <button class="btn btn-sm btn-primary ms-1 bt-copy-paste px-3"><i class="dialog-icon bi"></i> <span class="dialog-action"><?php echo Lang::l('copy'); ?></span></button>
  </div>
</div> -->
