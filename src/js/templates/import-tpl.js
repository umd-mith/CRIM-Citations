import * as Handlebars from 'handlebars';

let import_tpl = `
  <h4 class="mdl-dialog__title">Import relationships</h4>
  <div class="mdl-dialog__content">
    <div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
      <div class="mdl-tabs__tab-bar">
          <a href="#local-panel" class="mdl-tabs__tab is-active">Local</a>
          <a href="#db-panel" class="mdl-tabs__tab">DropBox</a>
          <a href="#url-panel" class="mdl-tabs__tab">Web URL</a>
      </div>

      <div class="mdl-tabs__panel is-active" id="local-panel">
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--file">
          <input class="mdl-textfield__input" placeholder="File" type="text" id="uploadFile" readonly/>
          <div class="mdl-button mdl-button--primary mdl-button--icon mdl-button--file">
            <i class="material-icons">file_upload</i><input type="file" id="uploadBtn">
          </div>
        </div>
      </div>
      <div class="mdl-tabs__panel" id="db-panel">
        <button id="from_dropbox" class="mdl-button mdl-js-button mdl-button--raised">
          Open from DropBox
        </button>
      </div>
      <div class="mdl-tabs__panel" id="url-panel">
        <form action="#">
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" id="url_input">
            <label class="mdl-textfield__label" for="url_input">URL...</label>
          </div>
          <div class="info">
            N.B. To import from URL, the provider must allow this application to obtain the data.
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="mdl-button mdl-button--accent" id="doImport">Import</button>
    <button type="button" class="mdl-button close">Cancel</button>
  </div>
`

export default Handlebars.compile(import_tpl);
