import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import score_relationship_tpl from '../templates/score_relationship-tpl';
import dialogPolyfill from 'dialog-polyfill'
import verovioToolkit from '../utils/verovioInstance';

class ScoreRelationship extends Backbone.View {

  initialize(options){
    this.container = options.container

    this.listenTo(Events, "startHideMode", this.startHideMode)
    this.listenTo(Events, "closedAssert", this.stopHideMode)
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
          "click .score_preview_close": this.closePreview,
          "click .show-score-assertion": this.showsScoreAssertion,
          "click .hide_button": this.hide
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
    this.model.set("comment", this.$el.find("#rel-comment").val())
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
      else {
        delete this.model.get("types")[DOMid]
      }
    })

    if (Object.keys(this.model.get("types")).length == 0) {
      let msg = this.$el.find(".messages").show().text("Please choose a relationship type.")
    }
    else {
      this.scores[0].collection.trigger("clearScoreSelections")
      this.close()
      console.log(this.model.get("types"))
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
    this.scores[0].trigger("redoVerovioLayout")
  }

  hide() {
    Events.trigger("startHideMode", this.el)
  }

  startHideMode() {
    this.el.close()
    this.scores[0].trigger("redoVerovioLayout")
  }

  stopHideMode() {
    if (this.$el.parent() == length >0 && !this.$el.attr("open")) {
      this.el.showModal()
    }
  }

  showsScoreAssertion(e) {
    let score_place = $(e.target).closest('li').data('score')
    let score_idx = score_place == "A" ? 0 : 1
    let score = this.scores[score_idx]
    let score_assert_id = this.model.get("score"+score_place+"assert")
    let score_assert = score.assertions.get(score_assert_id)
    if (!score_assert) {
      let new_assert = score.newAssertion()
      this.model.set("score"+score_place+"assert", new_assert.cid)
    }
    else {
      // this.$el.find('.assert_types').html(
      //   "("+score.assertions.get(score_assert).get("types").join(", ")+")"
      // )
      score.trigger("edit_assertion", score_assert_id)
    }
  }

  updateAssert(){
    let assert_A_id = this.model.get("scoreAassert")
    let assert_B_id = this.model.get("scoreBassert")

    if (assert_A_id && this.scores[0].assertions.get(assert_A_id)) {
      let types = this.scores[0].assertions.get(assert_A_id).get("types")
      if (types) {
        let labels = []
        for (let type in types){
          labels.push(types[type].label)
        }
        this.$el.find(".assert_typesA").html("("+labels.join(", ")+")")
      }
    }
    if (assert_B_id  && this.scores[1].assertions.get(assert_B_id)) {
      let types = this.scores[1].assertions.get(assert_B_id).get("types")
      if (types) {
        let labels = []
        for (let type in types){
          labels.push(types[type].label)
        }
        this.$el.find(".assert_typesB").html("("+labels.join(", ")+")")
      }
    }
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

  highlightNotation() {
    if (!this.scores[0].get("hasSelection")){
      this.scores[0].trigger("highlight", this.model.get("scoreA_meiids"));
    }
    if (!this.scores[1].get("hasSelection")){
      this.scores[1].trigger("highlight", this.model.get("scoreB_meiids"));
    }
  }

  render(scores, rel) {
    this.scores = scores

    this.listenTo(scores[0].assertions, "savedAssert", this.updateAssert)
    this.listenTo(scores[1].assertions, "savedAssert", this.updateAssert)

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

    this.updateAssert()
    this.highlightNotation()
  }

}

export default ScoreRelationship
