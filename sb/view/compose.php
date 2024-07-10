<div class="d-flex flex-column" style="height: 100%;">
  
  <div class="app-navbar d-flex p-2 border-bottom">
    <div class="timer position-absolute h4 m-0 text-secondary">00:00:00</div>
    <div class="flex-fill">&nbsp;</div>
    <div class="btn-group btn-group-sm me-2">
      <button class="bt-new btn btn-primary"><i class="bi bi-asterisk"></i> New</button>
      <!-- <button class="bt-open btn btn-sm btn-primary"><i class="bi bi-folder2-open"></i> Open</button> -->
    </div>
    <div class="btn-group btn-group-sm me-2">
      <button class="bt-import btn btn-outline-secondary"><i class="bi bi-arrow-right-short"></i><i class="bi bi-code-square"></i> Import</button>
      <button class="bt-export btn btn-outline-secondary"><i class="bi bi-send"></i> Export</button>
    </div>
    <div class="btn-group btn-group-sm ms-2" id="compose-saveload">
      <button class="bt-save btn btn-secondary"><i class="bi bi-download"></i> Save</button>
      <button class="bt-load btn btn-secondary"><i class="bi bi-upload"></i> Load</button>
    </div>
    <div class="btn-group btn-group-sm ms-2">
      <button class="bt-submit btn btn-danger"><i class="bi bi-send"></i> Submit <span class="count"></span></button>
    </div>
    <div class="btn-group btn-group-sm ms-2">
      <button class="bt-finalize btn btn-success"><i class="bi bi-flag-fill"></i> Finalize <span class="count"></span></button>
    </div>
    <div class="flex-fill">&nbsp;</div>
    <!-- <div class="btn-group btn-group-sm me-2">
      <button class="bt-save btn btn-outline-primary"><i class="bi bi-save"></i> Save</button>
      <button class="bt-save-as btn btn-outline-primary"><i class="bi bi-front"></i> Save As...</button>
    </div>
    <button class="bt-compose-kit btn btn-warning btn-sm" disabled><i class="bi bi-grid-1x2"></i><i class="bi bi-arrow-right-short"></i><i class="bi bi-layout-wtf"></i> Compose Kit</button> -->
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


  <!-- Dialogs -->
  
  <div id="concept-map-export-dialog" class="card d-none">
    <h6 class="card-header"><i class="bi bi-send"></i> Export</h6>
    <div class="card-body">
      <textarea class="form-control encoded-data" rows="5"></textarea>
    </div>
    <div class="card-footer text-end">
      <button class="btn btn-sm btn-secondary bt-cancel px-3">Cancel</button>
      <button class="btn btn-sm btn-primary ms-1 bt-clipboard px-3"><i class="bi bi-clipboard"></i> Copy to
        Clipboard</button>
      <button class="btn btn-sm btn-success ms-1 bt-download-cmap px-3"><i class="bi bi-download"></i> Download CMAP File</button>
    </div>
  </div>
  
  <div id="concept-map-import-dialog" class="card d-none">
    <h6 class="card-header"><i class="bi bi-arrow-right-short"></i><i class="bi bi-code-square"></i> Import</h6>
    <div class="card-body">
      <textarea class="form-control encoded-data" rows="5"></textarea>
      <div class="my-2">
        <div class="file-drop-area">
          <span class="fake-btn btn btn-primary me-3">Choose file</span>
          <span class="file-msg">or drop file here</span>
          <input class="file-input" type="file" multiple="">
          <div class="item-delete me-4"></div>
        </div>
      </div>
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
  
  <form id="concept-map-new-dialog" class="card d-none">
    <div class="card-body">

      <h4 class="mx-3 my-2">New Concept Map</h4>

      <div class="p-3 m-3 border bg-light">
        <div class="input-group">
          <input type="text" class="form-control" name="userid" placeholder="Enter your name or ID" />
          <div class="form-check input-group-text">
            <input class="me-2" type="checkbox" value="1" id="inputrememberme" checked>
            <label class="form-check-label" for="inputrememberme">Remember Me</label>
          </div>
        </div>
        <div class="input-group mt-2">
          <input type="text" class="form-control" name="title"
            placeholder="Concept map title"
            aria-label="Concept map title"
            aria-describedby="button-addon2" value="">
        </div>
        <div class="input-group mt-2">
          <input type="text" class="form-control" name="cmid"
            placeholder="Enter concept map ID here"
            aria-label="Enter concept map ID here"
            aria-describedby="button-addon2" value="">
          <a class="btn btn-primary bt-generate-uuid" type="button"><i class="bi bi-magic"></i></a>
        </div>
      </div>
      <!-- <hr>

      <div class="px-3">
        <div class="file-drop-area">
          <span class="fake-btn btn btn-primary me-3">Choose file</span>
          <span class="file-msg">or drop file here</span>
          <input class="file-input" type="file" multiple>
          <div class="item-delete me-4"></div>
        </div>
      </div> -->
      <div class="row">
        <div class="col text-end px-4 pt-3">
          <a class="bt-cancel btn btn-outline-secondary" style="min-width: 6rem;">Cancel</a>
          <a class="bt-new btn btn-success ms-1" style="min-width: 6rem;">
            <i class="bi bi-asterisk"></i> Create New Concept Map</a>
        </div>
      </div>

    </div>
    <!-- <div class="card-footer">
    </div> -->
  </form>
  
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
  
</div>
