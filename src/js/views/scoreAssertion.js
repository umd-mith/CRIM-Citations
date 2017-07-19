import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import score_assertion_tpl from '../templates/score_assertion-tpl';
import voice_tpl from '../templates/voice-tpl';
import dialogPolyfill from 'dialog-polyfill'

class ScoreAssertion extends Backbone.View {

  initialize(options){
    this.container = options.container
    this.score = options.score
  }

  template(tpl){
      return score_assertion_tpl(tpl);
  }

  get tagName(){
    return "dialog"
  }

  get className() {
    return "mdl-dialog score_assertion_dialog"
  }

  get events() {
      return {
          "click .close": this.close,
          "click .drop": this.showMusType,
          "change .cb": this.showMusTypeCh,
          "click #save_score_assertion": this.save,
          "click #cancel_score_assertion": this.cancel,
          "click .hide_button": this.hide,
          "click .addVoice": this.addVoice
      }
  }

  cancel() {
    if (Object.keys(this.model.get("types")).length == 0) {
        this.collection.remove(this.model.cid);
    }
    this.score.trigger("clearHighlight")
  }

  hide() {
    this.el.close()
    Events.trigger("startHideMode", this.el)
  }

  save(){
    // Now "set" all the things on this.model.
    if (this.ema){
      this.model.set("ema", this.ema)
    }
    if (this.title){
      this.model.set("title", this.title)
    }
    if (this.mei_ids){
      this.model.set("mei_ids", this.mei_ids)
    }
    // reset types
    this.model.set("types", {})
    this.model.set("comment", this.$el.find("#assert-comment").val())
    this.$el.find(".types").each((i, type) => {
      let $type = $(type)
      let $cb = $type.find(".cb")
      let DOMid = $cb.attr("id")
      if ($cb.prop("checked")) {
        let type_data = {
          "label" : $cb.next().text()
        }
        $type.find(".rest input, .rest textarea").each((j, input)=>{
          let $input = $(input)
          let key = $input.attr("id").split("-").pop()
          switch ($input.attr("type")) {
              case "text":
                type_data[key] = $input.val()
                break;
              case "radio":
              case "checkbox":
                type_data[key] = $input.prop("checked")
                break;
          }
        })
        type_data.options = []
        $type.find(".rest .group").each((j, group)=>{
          type_data.isSelect = true
          let grp = {}
          $(group).find("select option:selected").each((j, option)=>{
            let $option = $(option)
            let key = $option.parent().attr("id").split("-").pop()
            grp[key] = $option.val()
          })
          type_data.options.push(grp)
        })
        this.model.get("types")[DOMid] = type_data
      }
    })
    if (Object.keys(this.model.get("types")).length == 0) {
      let msg = this.$el.find(".messages").show().text("Please choose a musical type.")
    }
    else {
      this.close()
      this.model.collection.trigger("savedAssert")
    }
  }

  // Voice handling is ugly, but needed to be done hastily.
  // When (if) refactoring, use a collection and dedicated views.
  // Possibly types would need their own Coll and Model
  setDropdowns(){
    // Dropdowns need to be handled with JS (ie not by the template)

    this.$el.find("select").prop("disabled", true)


    let types = this.model.get("types")
    for (let type in types){
      if (types[type].isSelect) {
        for (let [grp_i, group] of types[type].options.entries()) {
          let $cnt = $("<span class='group'></span>")
          let $div = this.$el.find("#"+type).closest("div").find(".selectGroup")
          let addRemove = false
          $div.append($cnt)
          for (let key in group) {
            let $select = this.$el.find("#"+type+"-"+key)
            if ($select.length == 0){
              this.addVoiceTpl($cnt, type)
              addRemove = true
            }
            else {
              addRemove = false
            }
            this.$el.find("#"+type+"-"+key).prop("disabled", false)
            this.$el.find("#"+type+"-"+key+" option").each((i, opt)=>{
              if ($(opt).val() == types[type]["options"][grp_i][key]) {
                $(opt).prop("selected", true)
              }
            })
          }
          if (addRemove) this.addRemoveVoice($cnt)
        }
      }
    }
  }

  addVoiceTpl(cnt, type) {
    let $cnt = $(cnt)
    let pos = $cnt.closest(".selectGroup").find("select").length
    let tpl = {
      voices : this.voices,
      type : type,
      pos : pos+1
    }
    let el = voice_tpl(tpl)
    $cnt.append(el)
  }

  addRemoveVoice(div){
    let removebtn = $(`<button class="voiceremove mdl-button mdl-js-button mdl-button--icon">
      <i class="material-icons">close</i>
    </button>`)
    div.append(removebtn)
    removebtn.click(()=>{
      div.remove()
    })
  }

  addVoice(e) {
    e.preventDefault()
    let $a = $(e.target).closest("div")
    let $div = $a.prev("div")
    let type = $a.data("for")
    let $cnt = $("<span class='group'></span>")
    $div.append($cnt)
    this.addVoiceTpl($cnt, type)
    if ($a.data("pair")) {
      this.addVoiceTpl($cnt, type)
    }
    this.addRemoveVoice($cnt)
  }

  highlightNotation() {
    if (!this.score.get("hasSelection")){
      let mei_ids = this.model.get("mei_ids")
      mei_ids = mei_ids ? mei_ids : this.mei_ids
      this.score.trigger("highlight", mei_ids);
    }
  }

  showMusType(e) {
    $(e.target).closest('.types').find('.rest').toggle()
  }

  showMusTypeCh(e) {
    let box = $(e.target)
    let rest = box.closest('.types').find('.rest')
    if (box.prop("checked")) {
      // Assumes MDL
      rest.find("input, textarea, select, button").prop("disabled", false).parent().removeClass("is-disabled")
      rest.show()
    }
    else {
      rest.hide()
      rest.find("input, textarea, select, button").prop("disabled", true).parent().addClass("is-disabled")
    }
  }

  show() {
    // it it's detached, render.
    if (this.$el.parent().length == 0) {
      this.render()
      this.delegateEvents()
      // Assumes MDL JS
      if(!(typeof(componentHandler) == 'undefined')){
          componentHandler.upgradeAllRegistered();
      }
    }
    this.el.showModal();
  }

  close() {
    this.score.trigger("clearHighlight")
    this.el.close();
    Events.trigger("closedAssert")
    this.$el.detach();
  }

  render(assert) {
    if (assert) {
      this.model = this.collection.get(assert)
    }
    else {
      this.model = this.collection.add({})
    }
    let jmodel = this.model.toJSON()
    if (!this.model.get("ema")) {
      jmodel.ema = this.ema
    }
    if (!this.model.get("title")) {
      jmodel.title = this.title
    }
    jmodel.voices = this.voices
    this.container.append(this.$el.html(this.template(jmodel)))

    this.setDropdowns()

    if (! this.el.showModal) {
      dialogPolyfill.registerDialog(this.el);
    }

    this.highlightNotation()

  }

}

export default ScoreAssertion
