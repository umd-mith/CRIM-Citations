import $ from 'jquery';
import * as Backbone from 'backbone';
import Continuo from 'continuo';
import Events from '../utils/backbone-events';
import score_tpl from '../templates/score-tpl'
import ScoreAssertionView from './scoreAssertion';
import ScoreAssertionsView from './scoreAssertions';
import verovioToolkit from '../utils/verovioInstance';

class ScoreView extends Backbone.View {

  initialize (options) {
    this.page = 1
    this.scoreAssertionDialog = new ScoreAssertionView({container: $("#dialogs"), collection: this.model.assertions, score: this.model})
    this.scoreAssertionsDialog = new ScoreAssertionsView({container: $("#dialogs"), collection: this.model.assertions, score: this.model.cid})

    this.listenTo(this.model.assertions, "edit_assertion", this.showAssertion)
    this.listenTo(this.model.assertions, "delete_assertion", this.deleteAssertion)
    this.listenTo(this.model.collection, "delete_assertion", this.deleteAssertion)
    this.listenTo(this.model, "edit_assertion", this.showAssertion)
    this.listenTo(this.model, "new_assertion", this.newAssertion)
    this.listenTo(this.model, "close", this.close)
    this.listenTo(this.scoreAssertionsDialog, "redoVerovioLayout", this.doVerovioLayout)
    this.listenTo(this.model, "redoVerovioLayout", this.doVerovioLayout)
    this.listenTo(this.model, "highlight", this.highlight)
    this.listenTo(this.model, "clearHighlight", ()=>{this.setData(); this.continuo.clearHighlight()})
    this.listenTo(this.model, "showRelationshipButton", ()=>{this.$el.find(".show-score-relationship").show()})
    this.listenTo(this.model.collection, "hideRelationshipButtons", ()=>{this.$el.find(".show-score-relationship").hide()})
    this.listenTo(this.model.collection, "clearScoreSelections", this.clearScoreSelections)
    this.listenTo(this.model.collection, "storeSelections", this.storeSelection)
    this.listenTo(this.model.collection, "disableButtons", this.disableButtons)
    this.listenTo(this.model.collection, "renableButtons", this.renableButtons)

    // Eveytime the score container is touched, re-load its MEI data into Verovio (all score boxes are sharing ONE Verovio instance)
    this.$el.on("mousedown", ()=>{
      this.setData()
    })
  }

  get className() {
      return "mdl-cell mdl-cell--12-col mdl-shadow--2dp score_container";
  }

  template(tpl){
      return score_tpl(tpl);
  }

  get events() {
      return {
          "click .nextPage": this.nextPage,
          "click .prevPage": this.prevPage,
          "click .collapse_expand_button": this.toggle,
          "click .show-score-assertions": this.showAssertions,
          // "click .show-score-assertion": this.newAssertion,
          "click .show-score-relationship": this.showRelationship,
          "click .close_score_button": this.close
      }
  }

  render() {

    // Update id from model
    let score_id = 'score-' + this.model.cid
    this.$el.prop("id", score_id);

    this.$el.html(this.template({title: this.model.get("title")}));

    Events.trigger("scoreRendered")

    $("#loader").hide()

    return this.$el

  }

  get verovioOpts() {
    let scale = 35;
    let border = 20;

    return {
        pageWidth: this.$el.width() * 100 / scale,
        pageHeight: 250 * 100 / scale,
        ignoreLayout: 1,
        adjustPageHeight: 1,
        border: border,
        scale: scale
    };
  }

  doVerovioLayout() {
    verovioToolkit.setOptions(this.verovioOpts)
    verovioToolkit.redoLayout()
  }

  renderContinuoScore() {
    let score_path = "#score-" + this.model.cid + " .score"

    this.continuo = new Continuo({
      el: score_path,
      meiString: this.model.get("mei"),
      verovioToolkit: verovioToolkit,
      verovioOptions: this.verovioOpts,
      paginate: true,
      showPageCtrls: false
    })

    this.continuo.render()

    // Adjust height to SVG
    this.$el.height(this.$el.find('svg').height() + 100)

    this.listenTo(this.continuo, "selected", ()=>{
      // show assertion button
      // this.$el.find(".show-score-assertion").show()
      this.model.set("hasSelection", true)
    })
    this.listenTo(this.continuo, "deselected", ()=>{
      if (this.continuo.selectedElements.length == 0) {
        // hide assertion button
        // this.$el.find(".show-score-assertion").hide()
        this.model.set("hasSelection", false)
      }
    })
    this.listenTo(this.continuo, "clearedSelection", ()=>{
      // hide assertion button
      // this.$el.find(".show-score-assertion").hide()
      this.model.set("hasSelection", false)
    })

  }

  setData(){
    if (ScoreView.verovioData != this.model.cid) {
        verovioToolkit.loadData(this.model.get("mei"))
        ScoreView.verovioData = this.model.cid
    }
  }

  clearScoreSelections(){
    this.continuo.clearSelection()
    this.$el.find(".show-score-relationship").hide()
  }

  highlight(ids){
    this.setData()
    this.continuo.highlight(ids)
  }

  nextPage() {
    if (ScoreView.verovioData != this.model.cid) {
        verovioToolkit.loadData(this.model.get("mei"))
        ScoreView.verovioData = this.model.cid
    }
    if (this.page + 1 <= verovioToolkit.getPageCount()) {
        this.page = this.page +1;
        this.continuo.renderPage(this.page)
    }
  }

  prevPage() {
    if (ScoreView.verovioData != this.model.cid) {
        verovioToolkit.loadData(this.model.get("mei"))
        ScoreView.verovioData = this.model.cid
    }
    if (this.page - 1 > 0) {
        this.page = this.page - 1;
        this.continuo.renderPage(this.page)
    }
  }

  toggle() {
    if (this.$el.hasClass('score_collapsed')) {
      this.$el.removeClass('score_collapsed')
    }
    else {
      this.$el.addClass('score_collapsed')
    }
    this.$el.find(".collapse_icon").toggle()
    this.$el.find(".expand_icon").toggle()
  }

  deleteAssertion(assert) {
    this.model.assertions.remove(assert)
  }

  showAssertions() {
    this.scoreAssertionsDialog.render().then(()=>{
      // Assumes MDL JS
      if(!(typeof(componentHandler) == 'undefined')){
          componentHandler.upgradeAllRegistered();
      }
      this.scoreAssertionsDialog.show()
    })
  }

  showAssertion(assert) {
    if (!this.scoreAssertionDialog.voices){
      this.scoreAssertionDialog.voices = this.model.get("voices")
    }
    this.scoreAssertionDialog.render(assert)
    // Assumes MDL JS
    if(!(typeof(componentHandler) == 'undefined')){
        componentHandler.upgradeAllRegistered();
    }
    this.scoreAssertionDialog.show()
  }

  newAssertion(new_assert){
    this.scoreAssertionDialog.ema = this.$el.find(".cnt-emaexpr-expr").text()
    if (!this.scoreAssertionDialog.ema) {
      this.scoreAssertionDialog.ema = this.model.get("ema")
    }
    // this.scoreAssertionDialog.score = this.model
    this.scoreAssertionDialog.title = this.model.get("title")
    this.scoreAssertionDialog.voices = this.model.get("voices")
    this.scoreAssertionDialog.mei_ids = this.continuo.selectedElements
    if (this.scoreAssertionDialog.mei_ids.length == 0) {
      this.scoreAssertionDialog.mei_ids = this.model.get("mei_ids")
    }
    this.showAssertion(new_assert)
    // this.continuo.clearSelection()
    // this.$el.find(".show-score-assertion").hide()
  }

  getSelections(){
    return new Promise((res, rej)=> {
      this.listenTo(Events, "response:selections", (sel) => res(sel))
      Events.trigger("request:selections")
    })
  }

  showRelationship() {
    this.model.collection.trigger("storeSelections")
    this.getSelections().then((sel)=>{
      Events.trigger("relDialog:open", sel)
    })
    // this.model.collection.trigger("clearScoreSelections")
  }

  storeSelection(){
    this.model.set("ema", this.$el.find(".cnt-emaexpr-expr").text())
    this.model.set("mei_ids", this.continuo.selectedElements)
  }

  disableButtons(){
    this.$el.find(".show-score-relationship").attr("disabled", true)
    this.$el.find(".show-score-assertions").attr("disabled", true)
    // find a way to cover .cnt-container to stop click events on it
    let $score = this.$el.find(".score")
    let $mask = $("<div class='mask'></div>")
    $mask.width($score.width())
    $mask.height($score.height()-45)
    $score.prepend($mask)
  }

  renableButtons(){
    this.$el.find(".show-score-relationship").attr("disabled", false)
    this.$el.find(".show-score-assertions").attr("disabled", false)
    this.$el.find(".mask").remove()
  }

  close(force=false){
    // only close if it's not a target of a relationship or assertion
    new Promise((res, rej)=>{
      this.listenTo(Events, "response:relationships", (rels) => res(rels))
      Events.trigger("request:relationshipsFor", this.model.cid)
    }).then((rels)=>{
      if (this.model.assertions.models.length == 0 && rels.length == 0) {
        let r = false
        if (!force) {
          r = confirm("Are you sure you want to close this score?")
        }
        if (r || force) {
          this.remove()
          this.$el.detach()
          this.$el.remove()
        }
      }
      else {
        alert("Cannot close this score because it contains relationships or assertions.")
      }
    })
  }

}

// Class-level shared verovio data info
ScoreView.verovioData = false;

export default ScoreView
