<div id="mta-nav" class="p-3 border-top">
  <div class="row g-3 align-items-center">
    <div class="col-auto">
      <input type="file" name="file" id="file">        
    </div>
    <div class="col-auto flex-fill">
      <!-- Drag and Drop container-->
      <div class="upload-area p-3 border border-dark rounded-3 d-inline-block text-center w-100" id="uploadfile">
        <span id="drag-info">Drag and Drop GPX file here or click to select file</span>
      </div>
    </div>
  </div>  
</div>
<div id="map" class="flex-fill"></div>
<div id="mta-controls" class="p-3 border-top">
  <button id="btn-clear-map" class="btn btn-primary">Clear</button>
</div>
<div id="mta-poly-context" class="p-3 position-absolute bg-white border border-dark rounded-3" style="display:none;">
  <select name="lid" id="input-line-id" class="form-select">
    <option value="0">Select Line</option>
  </select>
  <button id="btn-save-line" class="btn btn-sm btn-success text-light mt-2">Save</button>
</div>