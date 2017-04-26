import * as Handlebars from 'handlebars';

let addfile_tpl = `
<dialog class="mdl-dialog">
  <h4 class="mdl-dialog__title">Add file</h4>
  <div class="mdl-dialog__content">
    <form action="#">
      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input class="mdl-textfield__input" type="text" id="url_input" value="http://www.verovio.org/examples/downloads/Schubert_Lindenbaum.mei">
        <label class="mdl-textfield__label" for="url_input">URL...</label>
      </div>
    </form>
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="mdl-button mdl-button--accent" id="from_dropbox">Open from DropBox</button>
    <button type="button" class="mdl-button mdl-button--accent" id="from_url">Load from URL</button>
    <button type="button" class="mdl-button close">Cancel</button>
  </div>
</dialog>
`

export default Handlebars.compile(addfile_tpl);
