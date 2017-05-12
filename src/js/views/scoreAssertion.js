import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import score_assertion_tpl from '../templates/score_assertion-tpl';
import dialogPolyfill from 'dialog-polyfill'

class ScoreAssertion extends Backbone.View {

  initialize(options){
    this.container = options.container
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
          "click #cancel_score_assertion": this.cancel
      }
  }

  cancel() {
    if (Object.keys(this.model.get("types")).length == 0) {
        this.collection.remove(this.model.cid);
    }
  }

  save(){
    // Now "set" all the things on this.model.
    this.model.set("ema", this.ema)
    this.model.set("mei_ids", this.mei_ids)
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
          // let name = $input.attr("name") ? $input.attr("name").split("-").pop() : ""
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
        this.model.get("types")[DOMid] = type_data
      }
    })
    this.close()
    Events.trigger("ema:reset")
  }

  showMusType(e) {
    $(e.target).closest('.types').find('.rest').toggle()
  }

  showMusTypeCh(e) {
    let box = $(e.target)
    let rest = box.closest('.types').find('.rest')
    if (box.prop("checked")) {
      // Assumes MDL
      rest.find("input, textarea").prop("disabled", false).parent().removeClass("is-disabled")
      rest.show()
    }
    else {
      rest.hide()
      rest.find("input, textarea").prop("disabled", true).parent().addClass("is-disabled")
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
    this.el.close();
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
    jmodel.ema = this.ema
    this.container.append(this.$el.html(this.template(jmodel)))
    if (! this.el.showModal) {
      dialogPolyfill.registerDialog(this.el);
    }
  }

}

export default ScoreAssertion
