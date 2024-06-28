<div class="d-flex flex-column vh-100">
  <!-- <a class="position-absolute d-flex align-items-center text-white px-3 text-decoration-none" href="<?php echo $this->location('../home'); ?>">
    <i class="bi bi-house pe-2" style="font-size: 1.8rem;"></i> <span>Home</span>
  </a> -->
  <div class="app-navbar d-flex align-items-center p-2 ps-4">
    <div class="timer position-absolute h4 m-0 text-secondary">00:00:00</div>
    <div class="flex-fill">&nbsp;</div>
    <button class="bt-open-kit btn btn-sm btn-primary"><i class="bi bi-folder2-open"></i> Open Kit</button>
    <div class="btn-group btn-group-sm ms-2" id="recompose-readcontent">
      <button class="bt-content btn btn-sm btn-secondary" disabled><i class="bi bi-file-text-fill"></i> Contents</button>
    </div>
    <div class="btn-group btn-group-sm ms-2" id="recompose-saveload">
      <button class="bt-save btn btn-secondary"><i class="bi bi-download"></i> <?php echo Lang::l('save'); ?></button>
      <button class="bt-load btn btn-secondary"><i class="bi bi-upload"></i> <?php echo Lang::l('load'); ?></button>
    </div>
    <div class="btn-group btn-group-sm ms-2" id="recompose-reset">
      <button class="bt-reset btn btn-danger"><i class="bi bi-arrow-counterclockwise"></i> <?php echo Lang::l('reset'); ?></button>
    </div>
    <div class="btn-group btn-group-sm ms-2" id="recompose-feedbacklevel">
      <button class="bt-feedback btn btn-warning"><i class="bi bi-eye-fill"></i> Feedback <span class="count"></span></button>
      <button class="bt-clear-feedback btn btn-success" disabled><i class="bi bi-play-fill"></i> Resume Concept Mapping</button>
    </div>
    <div class="btn-group btn-group-sm ms-2">
      <button class="bt-submit btn btn-danger"><i class="bi bi-send"></i> Submit <span class="count"></span></button>
    </div>
    <div class="flex-fill">&nbsp;</div>
    <span></span>
  </div>
  <div class="d-flex flex-fill align-items-stretch p-2">
    <div class="kb-container d-flex flex-fill flex-column border bg-white rounded">
      <div class="kb-toolbar p-1 d-flex align-items-center justify-content-between bg-light border-bottom">
        <span class="left-stack"></span>
        <span class="center-stack"><span class="btn btn-sm">&nbsp;</span></span>
        <span class="right-stack"></span>
      </div>
      <div id="recompose-canvas" class="kb-cy flex-fill"></div>
    </div>
    <?php // $this->pluginView('kitbuild-ui', ["id" => "recompose-canvas"], 0); ?>
  </div>
  <div class="d-flex">
    <div class="status-panel flex-fill m-2 mt-0 d-flex" style="overflow-x: auto"></div>
    <div class="status-control text-end m-2 mt-0"><button class="btn btn-primary btn-sm opacity-0">&nbsp;</button></div>
  </div>
</div>
    
<form id="concept-map-open-dialog" class="card d-none">
  <div class="card-body">

    <h4 class="mx-3 my-2">Open Kit</h4>

    <div class="p-3 m-3 border bg-light">
      <div class="input-group mb-3">
        <input type="text" class="form-control" name="userid" placeholder="Enter your name or ID" />
        <div class="form-check input-group-text">
          <input class="me-2" type="checkbox" value="1" id="inputrememberme" checked>
          <label class="form-check-label" for="inputrememberme">Remember Me</label>
        </div>
      </div>
    </div>

    <hr>

    <div class="p-3 mx-3 border bg-light">
      <div class="px-3">
        <div class="input-group mb-3">
          <input type="text" class="form-control" name="mapid"
            placeholder="Enter concept map ID here"
            aria-label="Enter concept map ID here"
            aria-describedby="button-addon2" value="<?php if (isset($conceptMapId)) echo $conceptMapId; ?>">
          <a class="btn btn-primary bt-open-id" type="button"><i class="bi bi-folder2-open"></i> Open Map</a>
        </div>
      </div>
      <!-- <hr> -->
      <div class="px-3">
        <div class="input-group">
          <input type="text" class="form-control" name="mapurl"
            placeholder="Enter concept map URL here"
            aria-label="Enter concept map URL here"
            aria-describedby="button-addon2" value="<?php if (isset($conceptMapUrl)) echo $conceptMapUrl; ?>">
          <a class="btn btn-primary bt-open-url" type="button"><i class="bi bi-folder2-open"></i> Open from URL</a>
        </div>
        <!-- <input type="text" class="form-control" name="url" placeholder="Enter concept map data URL here" /> -->
      </div>
    </div>

    <hr>

    <div class="px-3">
      <div class="file-drop-area">
        <span class="fake-btn btn btn-primary me-3">Choose file</span>
        <span class="file-msg">or drop file here</span>
        <input class="file-input" type="file" multiple>
        <div class="item-delete me-4"></div>
      </div>
    </div>
    <div class="row">
      <div class="col text-end px-4 pt-3">
        <a class="bt-cancel btn btn-secondary" style="min-width: 6rem;"><?php echo Lang::l('cancel'); ?></a>
        <a class="bt-open btn btn-primary ms-1" style="min-width: 6rem;">
          <i class="bi bi-folder2-open"></i> Open from File<?php // echo Lang::l('open'); ?></a>
      </div>
    </div>

  </div>
  <!-- <div class="card-footer">
  </div> -->
</form>

<div id="kit-export-dialog" class="card d-none">
  <h6 class="card-header"><i class="bi bi-send"></i> Export</h6>
  <div class="card-body">
    <textarea class="form-control encoded-data" rows="5"></textarea>
  </div>
  <div class="card-footer text-end">
    <button class="btn btn-sm btn-secondary bt-cancel px-3"><?php echo Lang::l('cancel'); ?></button>
    <button class="btn btn-sm btn-primary ms-1 bt-clipboard px-3"><i class="bi bi-clipboard"></i> Copy to Clipboard</button>
  </div>
</div>

<div id="kit-content-dialog" class="card d-none">
  <h6 class="card-header d-flex">
    <span class="drag-handle flex-fill"><i class="dialog-icon bi bi-file-text"></i> <span class="dialog-title">Content</span></span>
    <i class="bi bi-x-lg bt-close bt-x" role="button"></i>
  </h6>
  <div class="card-body position-relative overflow-hidden overflow-scroll d-flex flex-fill mb-3">
    <div class="content text-secondary"></div>
  </div>
  <div class="card-footer d-flex justify-content-between align-items-center">
    <span>
      <span class="bt-scroll-top btn btn-sm ms-1 btn-primary px-3"><i class="bi bi-chevron-bar-up"></i> Back to Top</span>
      <span class="bt-scroll-more btn btn-sm ms-1 btn-primary px-3"><i class="bi bi-chevron-down"></i> More</span>
    </span>
    <span>
      <button class="btn btn-sm btn-secondary bt-close px-3"><?php echo Lang::l('close'); ?></button>
      <button class="btn btn-sm resize-handle pe-0 ps-3"><i class="bi bi-textarea-resize"></i></button>
    </span>
  </div>
</div>

<div id="feedback-reason-dialog" class="card d-none">
  <h6 class="card-header d-flex">
    <span class="drag-handle flex-fill"><i class="dialog-icon bi bi-file-text"></i> <span class="dialog-title">Request Feedback?</span></span>
    <i class="bi bi-x-lg bt-close bt-x" role="button"></i>
  </h6>
  <div class="card-body position-relative d-flex flex-column flex-fill">
    <p>Why do you need feedback this time?</p>
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="inputcorrect">
      <label class="form-check-label" for="inputcorrect">
        Check whether my last response was right or wrong
      </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="inputinformation">
      <label class="form-check-label" for="inputinformation">
        I need more information regarding my last response
      </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="inputunderstand">
      <label class="form-check-label" for="inputunderstand">
        I don't understand about my last response
      </label>
    </div>
    <div class="">
      <label for="inputotherreason" class="form-label">Other</label>
      <input type="text" class="form-control" id="inputotherreason" placeholder="write other reason...">
    </div>
  </div>
  <div class="card-footer d-flex justify-content-end align-items-center">
    <span>
      <button class="btn btn-sm btn-secondary bt-close px-3">Close</button>
      <button class="btn btn-sm btn-primary bt-get-feedback"><i class="bi bi-eye-fill"></i> Get Feedback</button>
    </span>
  </div>
</div>

<div id="feedback-nearby-dialog" class="card d-none">
  <h6 class="card-header d-flex">
    <span class="drag-handle flex-fill"><i class="dialog-icon bi bi-file-text"></i> 
    <span class="dialog-title">Get Feedback for This Node?</span></span>
    <i class="bi bi-x-lg bt-close bt-x" role="button"></i>
  </h6>
  <div class="card-body position-relative d-flex flex-column flex-fill">
    <p>Why do you need feedback for this node?</p>
    <div class="form-check">
      <input class="form-check-input inputinformation" type="checkbox" value="" id="inputinformationnearby">
      <label class="form-check-label" for="inputinformationnearby">
        I need more information regarding this node
      </label>
    </div>
    <div class="form-check">
      <input class="form-check-input inputunderstand" type="checkbox" value="" id="inputunderstandnearby">
      <label class="form-check-label" for="inputunderstandnearby">
        I don't understand about this node
      </label>
    </div>
    <div class="">
      <label for="inputotherreasonnearby" class="form-label">Other</label>
      <input type="text" class="form-control inputotherreason" id="inputotherreasonnearby" placeholder="write other reason...">
    </div>
  </div>
  <div class="card-footer d-flex justify-content-end align-items-center">
    <span>
      <button class="btn btn-sm btn-secondary bt-close px-3">Close</button>
      <button class="btn btn-sm btn-primary bt-get-feedback"><i class="bi bi-eye-fill"></i> Get Feedback</button>
    </span>
  </div>
</div>

<div id="feedback-dialog" class="card d-none">
  <h6 class="card-header d-flex">
    <span class="drag-handle flex-fill"><i class="dialog-icon bi bi-eye-fill me-2"></i> <span class="dialog-title">Quick Feedback</span></span>
    <i class="bi bi-x-lg bt-close bt-x" role="button"></i>
  </h6>
  <div class="card-body">
    <div class="feedback-content"></div>
  </div>
  <div class="card-footer text-end">
    <button class="btn btn-sm btn-secondary bt-cancel bt-close px-3"><?php echo Lang::l('ok'); ?></button>
    <button class="btn btn-sm btn-primary bt-modify px-3 ms-1">Modify My Map</button>
  </div>
</div>
