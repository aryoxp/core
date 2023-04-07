<div id="mta-nav" class="p-3 border-top">
  <div class="row g-3 align-items-center">
    <div class="col-auto">
      <label for="input-line-id" class="col-form-label">Transport Line:</label>
    </div>
    <div class="col-auto">
      <select name="lid" id="input-line-id" class="form-select">
        <option value="0">Select Line</option>
      </select>
    </div>
    <div class="col-auto">
      <button id="btn-load-line" class="btn btn-primary">Load</button>
    </div>
  </div>  
</div>
<div id="map" class="flex-fill"></div>
<div id="mta-controls" class="p-3 border-top">
  <button id="btn-clear-map" class="btn btn-primary">Clear</button>
</div>
<div id="mta-poly-context" class="p-2 position-absolute bg-light border border-radius-3" style="display:none;">
  <button id="btn-save-line" class="btn btn-sm btn-success text-light">Save</button>
</div>