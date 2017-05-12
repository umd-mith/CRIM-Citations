import * as Handlebars from 'handlebars';

let score_assertion_tpl = `
  <h4 class="mdl-dialog__title">Score metadata</h4>
  <div class="mdl-dialog__content">
    <h4>Assertions</h4>
    {{#if assertions.length}}
    <ul class="mdl-list">
      {{#each assertions}}
      <li class="mdl-list__item" data-assertionid="{{this.cid}}">
        <span class="mdl-list__item-primary-content">
          <!--<i class="material-icons delete_assertion" title="delete">close</i>-->
          <span class="truncate">{{this.ema}}</span> <span class="truncate">({{#each this.types}}{{label}}{{#unless @last}},{{/unless}}{{/each}})</span>
        </span>
        <span class="mdl-list__item-secondary-action">
          <i class="material-icons edit_assertion clickable" title="edit assertion">mode_edit</i>
          <i class="material-icons selection_preview clickable" title="preview first measure">remove_red_eye</i>
        </span>
      </li>
      {{/each}}
    </ul>
    {{else}}
    <p>No assertions yet. Select music notation and click <i class="material-icons">playlist_add</i></p>
    {{/if}}
    <h4>Relationships</h4>
    {{#if relationships}}
      <ul class="mdl-list">
      {{#each relationships}}
        <li class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <span class="truncate truncate_short">{{this.titleA}}</span>
            <i class="material-icons">{{#if this.boolDir}}arrow_forward{{else}}arrow_back{{/if}}</i>
            <span class="truncate truncate_short">{{this.titleB}}</span>
            <span class="truncate truncate_short">({{#each this.types}}{{label}}{{#unless @last}},{{/unless}}{{/each}})</span>
          </span>
          <span class="mdl-list__item-secondary-action">
            <i class="material-icons edit_relationship clickable" title="edit relationship">mode_edit</i>
            <i class="material-icons selection_preview" title="preview first measure">remove_red_eye</i>
          </span>
        </li>
       {{/each}}
      </ul>
    {{else}}
    <p>No relationships yet.</p>
    {{/if}}
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="mdl-button close">Close</button>
  </div>
  <div class="score_preview_cnt mdl-shadow--2dp" style="display:none">
    <div class="score_preview"></div>
    <i class="material-icons score_preview_close">close</i>
  </div>
`

export default Handlebars.compile(score_assertion_tpl);
