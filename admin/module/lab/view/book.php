<div class="container">
  <div class="row m-5">
    <div class="col">
      <h3><i class="bi bi-file-text text-primary me-3"></i> Digital Books and References</h3>
      <div class="row">
        <span class="mb-5 text-secondary col-8">MGM Lab repository for digital books and references.</span>
        <!-- <span class="col-4 text-end">
          <a class="bt-new-book btn btn-primary"><i class="bi bi-plus-lg me-2"></i>Create New Book</a>
        </span> -->
      </div>
      <form id="form-search" class="pb-3 mb-3 border-bottom">
        <div class="input-group mb-3">
          <input type="text" name="keyword" class="form-control w-50 input-keyword" placeholder="Search keyword" aria-label="Keyword">
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
      </form>
      <div class="book-list mb-3 row row-cols-4 g-3"></div>
      <div class="book-pagination"></div>

      <!-- <hr class="my-5">

      <h3><i class="bi bi-plus-lg me-3 text-primary"></i>
        <span class="form-title">New Book</span>
      </h3>

      <div class="container px-5 my-5">
        <form id="book-form" class="needs-validation" novalidate>
          <input type="hidden" id="cid" name="cid" value="">

          <div class="form-floating mb-3">
            <input class="form-control" id="title" type="text" placeholder="Title" data-sb-validations="required" required />
            <label for="title">Title</label>
            <div class="invalid-feedback">Title is required.</div>
          </div>
          <div class="form-floating mb-3">
            <input class="form-control" id="subtitle" type="text" placeholder="Sub-title (Optional)" />
            <label for="subtitle">Sub-title (Optional)</label>
          </div>
          <div class="row g-3 mb-3">
            <div class="col">
              <div class="form-floating">
                <input class="form-control" id="key" type="text" placeholder="Key" required />
                <label for="key">Book Key</label>
                <div class="invalid-feedback">Key is required.</div>
              </div>
            </div>
            <div class="col d-flex align-items-center px-3 rounded border bg-light me-2">
              <div class="px-3">
                <label class="form-label-inline me-3 fw-bold">Book Type</label>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" id="type_md" type="radio" name="type" value="md" checked />
                    <label class="form-check-label" for="type_md">Markdown</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" id="type_html" type="radio" name="type" value="html" />
                    <label class="form-check-label" for="type_html">HTML</label>
                </div>
              </div>
            </div>
          </div> 
          <div class="mb-3">

            <code-input template="syntax-highlighted" class="rounded fs-5" language="html"></code-input>
            <textarea class="form-control" id="book" type="text" placeholder="Book" style="height: 10rem;" data-sb-validations="required"></textarea>

          </div>
          <div class="d-none" id="submitSuccessMessage">
            <div class="text-center mb-3">
              <div class="fw-bolder">Form submission successful!</div>
            </div>
          </div>
          <div class="d-none" id="submitErrorMessage">
            <div class="text-center text-danger mb-3">Error sending message!</div>
          </div>
          <div class="text-end">
            <button class="bt-clear btn btn-secondary btn-lg px-5 me-2" id="clearButton" type="button">Clear</button>
            <button class="btn btn-primary btn-lg px-5" id="submitButton" type="submit">Save</button>
          </div>
        </form>
      </div> -->
    </div>
  </div>
</div>