import * as Handlebars from 'handlebars';

let pag_tpl = `
<div class="score_header">
  <div class="mdl-layout__header-row">
    <button class="mdl-button mdl-js-button mdl-button--icon collapse_expand_button">
      <i class="material-icons collapse_icon">vertical_align_center</i>
      <i class="material-icons expand_icon" style="display:none">fullscreen</i>
    </button>
    <span class="mdl-layout-title">{{title}}</span>
    <div class="mdl-layout-spacer"></div>
    <nav class="mdl-navigation">
      <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--attention show-score-relationship" style="display:none">
        <i class="material-icons">compare_arrows</i>
      </button>
      <!--<button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--attention show-score-assertion" style="display:none">
        <i class="material-icons">playlist_add</i>
      </button>-->
      <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored show-score-assertions">
        <i class="material-icons">toc</i>
      </button>
      <div class="score_pagination">
        <button class="mdl-button mdl-js-button mdl-button--icon prevPage">
          <i class="material-icons">navigate_before</i>
        </button>
        <button class="mdl-button mdl-js-button mdl-button--icon nextPage">
          <i class="material-icons">navigate_next</i>
        </button>
      </div>
    </nav>
  </div>
</div>
<div class="score"></div>
`

export default Handlebars.compile(pag_tpl);
