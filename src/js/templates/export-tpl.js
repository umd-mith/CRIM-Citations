import * as Handlebars from 'handlebars';

let export_tpl = `
  <h4 class="mdl-dialog__title">Export relationships</h4>
  <div class="mdl-dialog__content">
    <p>Exporting will store your current work to the Omeka databse or to a file that you will be able to open and edit later.<br/>
       Your scores will remain open, but the relationships created will not be available until re-loaded. Continue?
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="mdl-button mdl-button--accent" id="expToDisk">Save to disk</button>
    <button type="button" class="mdl-button mdl-button--attention" id="expToOmeka">Save to Omeka databse</button>
    <button type="button" class="mdl-button close">Cancel</button>
  </div>
`

export default Handlebars.compile(export_tpl);
