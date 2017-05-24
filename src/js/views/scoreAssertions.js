import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import score_assertions_tpl from '../templates/score_assertions-tpl';
import dialogPolyfill from 'dialog-polyfill'
import verovioToolkit from '../utils/verovioInstance';

class ScoreAssertions extends Backbone.View {

  initialize(options){
    this.container = options.container
    this.score = options.score
  }

  template(tpl){
      return score_assertions_tpl(tpl);
  }

  get tagName(){
    return "dialog"
  }

  get className() {
    return "mdl-dialog score_assertions_dialog"
  }

  get events() {
      return {
          "click .close": this.close,
          "click .edit_assertion": this.edit,
          "click .selection_preview": this.preview,
          "click .rel_preview": this.relPreview,
          "click .edit_relationship": this.editRel,
          "click .score_preview_close": this.closePreview
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
    this.trigger("redoVerovioLayout")
  }

  edit(e) {
    let assertid = $(e.target).closest("li").data("assertionid")
    this.close()
    Events.trigger("edit_assertion", assertid)
  }

  editRel(e){
    let relid = $(e.target).closest("li").data("relid")
    this.close()
    Events.trigger("edit_relationship", relid)
  }

  preview(e) {

    let assert = this.collection.get($(e.target).closest("li").data("assertionid"))

    let opts = {
        pageWidth: 150 * 100 / 35,
        pageHeight: 150 * 100 / 35,
        border: 0,
        scale: 35
    };

    verovioToolkit.setOptions(opts)
    verovioToolkit.redoLayout()

    let page = verovioToolkit.getPageWithElement(assert.get("mei_ids")[0])
    let svg = verovioToolkit.renderPage(page)

    this.$el.find(".score_preview").html(svg)
    for (let id of assert.get("mei_ids")) {
        let el = this.$el.find("#"+id)
        if (el.length > 0) {
            el.get(0).setAttribute("class", "preview_selected")
        }
    }

    this.$el.find(".score_preview_cnt").show()

  }

  relPreview(e) {

  }

  closePreview(){
    this.$el.find(".score_preview_cnt").hide()
    this.trigger("redoVerovioLayout")
  }

  render() {
    // This is ugly but time constraint led me here.
    // A refactoring would move relationships and assertions under the same model
    return new Promise((resolve, reject)=>{
      new Promise((res, rej)=>{
        this.listenTo(Events, "response:relationships", (rels) => res(rels))
        Events.trigger("request:relationshipsFor", this.score)
      }).then((rels)=>{
        let json = {assertions: this.collection.toJSON(), relationships: (new Backbone.Collection(rels)).toJSON()}
        this.container.append(this.$el.html(this.template(json)))
        if (! this.el.showModal) {
          dialogPolyfill.registerDialog(this.el);
        }
        resolve()
      })
    })
  }

}

export default ScoreAssertions
