import * as Handlebars from 'handlebars';

let voice_tpl = `
<select class="dialog_select" name="{{type}}-voice{{pos}}" id="{{type}}-voice{{pos}}">
  {{#each voices}}
  <option value="{{this}}">{{this}}</option>
  {{/each}}
</select>
`

export default Handlebars.compile(voice_tpl);
