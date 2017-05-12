import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import score_relationship_tpl from '../templates/score_relationship-tpl';
import dialogPolyfill from 'dialog-polyfill'
import verovioToolkit from '../utils/verovioInstance';

class ScoreRelationship extends Backbone.View {

  initialize(options){
    this.container = options.container
  }

  template(tpl){
      return score_relationship_tpl(tpl);
  }

  get tagName(){
    return "dialog"
  }

  get className() {
    return "mdl-dialog score_relationship_dialog"
  }

  get events() {
      return {
          "click .close": this.close,
          "click .drop": this.showType,
          "change .cb": this.showTypeCh,
          "click #save_score_relationship": this.save,
          "click #cancel_score_relationship": this.cancel,
          "click .selection_preview": this.preview,
          "click .score_preview_close": this.closePreview
      }
  }

  cancel() {
    if (Object.keys(this.model.get("types")).length == 0) {
        this.collection.remove(this.model.cid);
    }
    this.scores[0].trigger("redoVerovioLayout")
  }

  save(){
    this.model.set("direction", this.$el.find("input[name=rel-dir]:checked").attr("id").split("-").pop())
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
    this.scores[0].trigger("redoVerovioLayout")
  }

  showType(e) {
    $(e.target).closest('.types').find('.rest').toggle()
  }

  showTypeCh(e) {
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

  preview(e) {

    let score_place = $(e.target).closest("li").data("score")
    let score = score_place == "A" ? this.scores[0] : this.scores[1]
    let mei_ids = this.model.get("score"+score_place+"_meiids")

    let opts = {
        pageWidth: 150 * 100 / 35,
        pageHeight: 150 * 100 / 35,
        border: 0,
        scale: 35
    };

    verovioToolkit.loadData(score.get("mei"))
    verovioToolkit.setOptions(opts)
    verovioToolkit.redoLayout()

    let page = verovioToolkit.getPageWithElement(mei_ids[0])
    let svg = verovioToolkit.renderPage(page)

    this.$el.find(".score_preview").html(svg)
    for (let id of mei_ids) {
        let el = this.$el.find("#"+id)
        if (el.length > 0) {
            el.get(0).setAttribute("class", "preview_selected")
        }
    }

    this.$el.find(".score_preview_cnt").show()

  }

  closePreview(){
    this.$el.find(".score_preview_cnt").hide()
    this.scores[0].trigger("redoVerovioLayout")
  }

  render(scores, rel) {
    this.scores = scores
    if (rel) {
      this.model = this.collection.get(rel)
    }
    else {
      this.model = this.collection.add({})
    }
    this.model.set("scoreA", scores[0].cid)
    this.model.set("scoreB", scores[1].cid)
    this.model.set("scoreA_ema", scores[0].get("ema"))
    this.model.set("scoreB_ema", scores[1].get("ema"))
    this.model.set("scoreA_meiids", scores[0].get("mei_ids"))
    this.model.set("scoreB_meiids", scores[1].get("mei_ids"))
    this.model.set("titleA", scores[0].get("title"))
    this.model.set("titleB", scores[1].get("title"))
    this.container.append(this.$el.html(this.template(this.model.toJSON())))
    if (! this.el.showModal) {
      dialogPolyfill.registerDialog(this.el);
    }
    // Assumes MDL JS
    if(!(typeof(componentHandler) == 'undefined')){
        componentHandler.upgradeAllRegistered();
    }
  }

}

export default ScoreRelationship
