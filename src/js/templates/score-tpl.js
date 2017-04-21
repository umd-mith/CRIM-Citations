import * as Handlebars from 'handlebars';

let pag_tpl = `
<div class="score_header">
  <div class="mdl-layout__header-row">
    <button class="mdl-button mdl-js-button mdl-button--icon">
      <i class="material-icons">vertical_align_center</i>
    </button>
    <span class="mdl-layout-title">{{title}}</span>
    <div class="mdl-layout-spacer"></div>
    <nav class="mdl-navigation">
      <button class="mdl-button mdl-js-button mdl-button--icon prevPage">
        <i class="material-icons">navigate_before</i>
      </button>
      <button class="mdl-button mdl-js-button mdl-button--icon nextPage">
        <i class="material-icons">navigate_next</i>
      </button>
    </nav>
  </div>
</div>
<div class="score"></div>
`

export default Handlebars.compile(pag_tpl);
