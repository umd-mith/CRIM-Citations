import * as Handlebars from 'handlebars';

let score_relationship_tpl = `
  <h4 class="mdl-dialog__title">Score relationship</h4>
  <div class="mdl-dialog__content">
    <ul class="mdl-list">
      <li class="mdl-list__item" data-score="A">
        <span class="mdl-list__item-primary-content">
          <span class="truncate">{{titleA}}</span>&nbsp;<span class="truncate">{{scoreA_ema}}</span>
        </span>
        <span class="mdl-list__item-secondary-action">
          <i class="material-icons selection_preview" title="preview first measure">remove_red_eye</i>
        </span>
      </li>
      <li class="mdl-list__item" data-score="B">
        <span class="mdl-list__item-primary-content">
          <span class="truncate">{{titleB}}</span>&nbsp;<span class="truncate">{{scoreB_ema}}</span>
        </span>
        <span class="mdl-list__item-secondary-action">
          <i class="material-icons selection_preview" title="preview first measure">remove_red_eye</i>
        </span>
      </li>
    </ul>
    <h4>Direction</h4>
    <div>
      <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect for="rel-dir-a2b">
        <input type="radio" name="rel-dir" id="rel-dir-a2b" class="mdl-radio__button" checked>
        <span class="mdl-radio__label"><span class="truncate">{{titleA}}</span> <i class="material-icons">arrow_forward</i> <span class="truncate">{{titleB}}</span></span>
      </label>
      <br/>
      <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="rel-dir-b2a">
        <input type="radio" name="rel-dir" id="rel-dir-b2a" class="mdl-radio__button">
        <span class="mdl-radio__label"><span class="truncate">{{titleB}}</span> <i class="material-icons">arrow_forward</i> <span class="truncate">{{titleA}}</span></span>
      </label>
    </div>
    <h4>Relationship type</h4>
    <div class="mdl-shadow--2dp types">
      <label for="rt-q" class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
        <input type="checkbox" id="rt-q" class="mdl-checkbox__input cb">
        <span class="mdl-checkbox__label">Quotation</span>
      </label>
      <button class="mdl-button mdl-js-button mdl-button--icon drop">
        <i class="material-icons">arrow_drop_down</i>
      </button>
      <div class="rest" style="display:none">
        <div>
          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect for="rt-q-ex">
            <input type="radio" name="rt-q-opts" id="rt-q-ex" class="mdl-radio__button" checked disabled>
            <span class="mdl-radio__label">Exact</span>
          </label>
          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="rt-q-mo">
            <input type="radio" name="rt-q-opts" id="rt-q-mo" class="mdl-radio__button" disabled>
            <span class="mdl-radio__label">Monnayage</span>
          </label>
        </div>
      </div>
    </div>
    <div class="mdl-shadow--2dp types">
      <label for="rt-t" class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
        <input type="checkbox" id="rt-t" class="mdl-checkbox__input cb">
        <span class="mdl-checkbox__label">Transformation</span>
      </label>
      <button class="mdl-button mdl-js-button mdl-button--icon drop">
        <i class="material-icons">arrow_drop_down</i>
      </button>
      <div class="rest" style="display:none">
        <div>
          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect for="rt-t-m">
            <input type="radio" name="rt-t-opts" id="rt-t-m" class="mdl-radio__button" checked disabled>
            <span class="mdl-radio__label">Mechanical</span>
          </label>
          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="rt-t-nm">
            <input type="radio" name="rt-t-opts" id="rt-t-nm" class="mdl-radio__button" disabled>
            <span class="mdl-radio__label">Non-Mechanical</span>
          </label>
        </div>
      </div>
    </div>
    <div class="mdl-shadow--2dp types">
      <label for="rt-nm" class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
        <input type="checkbox" id="rt-nm" class="mdl-checkbox__input cb">
        <span class="mdl-checkbox__label">New Material</span>
      </label>
    </div>
    <div class="mdl-shadow--2dp types">
      <label for="rt-om" class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
        <input type="checkbox" id="rt-om" class="mdl-checkbox__input cb">
        <span class="mdl-checkbox__label">Omission</span>
      </label>
    </div>
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="mdl-button mdl-button--accent" id="save_score_relationship">Save</button>
    <button type="button" class="mdl-button close" id="cancel_score_relationship">Cancel</button>
  </div>
  <div class="score_preview_cnt mdl-shadow--2dp" style="display:none">
    <div class="score_preview"></div>
    <i class="material-icons score_preview_close">close</i>
  </div>
`

export default Handlebars.compile(score_relationship_tpl);
