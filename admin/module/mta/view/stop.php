<div id="mta-nav" class="p-3 border-top">
  <div class="row g-3 align-items-cente justify-content-between">
    <div class="col-auto row g-3 mt-0">
      <div class="col-auto">
        <label for="input-line-id" class="col-form-label">Transport Line:</label>
      </div>
      <div class="col-auto">
        <select name="lid" id="input-line-id" class="form-select">
          <option value="0">Select Line</option>
        </select>
      </div>
      <div class="col-auto">
        <button id="btn-load-line" class="btn btn-primary fw-normal">Load</button>
        <button id="btn-open-line" class="btn btn-secondary fw-normal"><i class="bi bi-clipboard2-check"></i> Line Profile</button>
      </div>
    </div>
    <div class="col-auto">
      <button id="btn-new-line" class="btn btn-success text-white fw-normal"><i class="bi bi-plus"></i> New Line Profile</button>
    </div>
  </div>  
</div>
<div id="map" class="flex-fill"></div>
<div id="mta-controls" class="p-3 border-top">
  <button id="btn-clear-map" class="btn btn-primary">Clear</button>
</div>
<div id="mta-profile" class="card shadow" style="width: 500px; display:none;">
  <div class="card-header app-card-header"></div>
  <div class="card-body">
    <form>
      <div class="row mb-3">
        <label for="input-name" class="col-sm-3 col-form-label">Line Name</label>
        <div class="col-sm-9">
          <input type="text" class="form-control" id="input-name">
        </div>
      </div>
      <div class="row mb-3">
        <label for="input-color" class="col-sm-3 col-form-label">Color (Hex)</label>
        <div class="col-sm-9">
          <div class="input-group mb-3">
            <input type="text" class="form-control" id="input-color">
            <span class="input-color-preview border border-dark" style="width:42px;">&nbsp;</span>
          </div>
        </div>
      </div>
      <fieldset class="row mb-3">
        <legend class="col-form-label col-sm-3 pt-0">Direction</legend>
        <div class="col-sm-9">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="direction" id="input-direction-o" value="O" checked>
            <label class="form-check-label" for="input-direction-o">
              Outbound
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="direction" id="input-direction-i" value="I">
            <label class="form-check-label" for="input-direction-i">
              Inbound
            </label>
          </div>
        </div>
      </fieldset>
      <div class="row mb-3">
        <div class="col-sm-9 offset-sm-3">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="input-enabled">
            <label class="form-check-label" for="input-enabled">
              Enabled
            </label>
          </div>
        </div>
      </div>
    </form>
    <div class="d-flex justify-content-between">
      <button class="btn-delete btn btn-danger text-light fw-normal me-5"><i class="bi bi-exclamation-triangle"></i> DELETE</button>
      <span>
        <button class="app-btn-close-dialog btn btn-outline-secondary border border-secondary">Close</button>
        <button class="btn-save btn btn-success text-light fw-normal ms-2">Save</button>
      </span>
    </div>
  </div>
</div>
<div id="mta-marker-context" class="p-3 position-absolute bg-white border rounded-3" style="display:none;">
  <button id="btn-mark-stop" class="btn btn-sm btn-success text-light px-4">Mark as Stop</button>
  <button id="btn-unmark-stop" class="btn btn-sm btn-danger text-light px-4">Unmark from Stop</button>
</div>
<div id="mta-polyline-context" class="p-3 position-absolute bg-white border rounded-3" style="display:none;">
  <button id="btn-show-hide" class="btn btn-sm btn-primary text-light px-4"><i class="bi bi-eye"></i> Show/Hide</button>
</div>