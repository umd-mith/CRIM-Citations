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
    this.scoreAssertionDialog = new ScoreAssertionView({container: $("#dialogs"), collection: this.model.assertions})
    this.scoreAssertionsDialog = new ScoreAssertionsView({container: $("#dialogs"), collection: this.model.assertions, score: this.model.cid})

    this.listenTo(Events, "edit_assertion", this.showAssertion)
    this.listenTo(this.scoreAssertionsDialog, "redoVerovioLayout", this.doVerovioLayout)
    this.listenTo(this.model, "redoVerovioLayout", this.doVerovioLayout)
    this.listenTo(this.model, "showRelationshipButton", ()=>{this.$el.find(".show-score-relationship").show()})
    this.listenTo(this.model.collection, "hideRelationshipButtons", ()=>{this.$el.find(".show-score-relationship").hide()})
    this.listenTo(this.model.collection, "clearScoreSelections", ()=>{this.continuo.clearSelection(); this.$el.find(".show-score-relationship").hide()})
    this.listenTo(this.model.collection, "storeSelections", this.storeSelection)

    // Eveytime the score container is touched, re-load its MEI data into Verovio (all score boxes are sharing ONE Verovio instance)
    this.$el.on("mousedown", ()=>{
      if (ScoreView.verovioData != this.model.cid) {
          verovioToolkit.loadData(this.model.get("mei"))
          ScoreView.verovioData = this.model.cid
      }
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
          "click .show-score-assertion": this.newAssertion,
          "click .show-score-relationship": this.showRelationship
      }
  }

  render() {

    // Update id from model
    let score_id = 'score-' + this.model.cid
    this.$el.prop("id", score_id);

    this.$el.html(this.template({title: this.model.get("title")}));

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
      this.$el.find(".show-score-assertion").show()
      this.model.set("hasSelection", true)
    })
    this.listenTo(this.continuo, "deselected", ()=>{
      if (this.continuo.selectedElements.length == 0) {
        // hide assertion button
        this.$el.find(".show-score-assertion").hide()
        this.model.set("hasSelection", false)
      }
    })
    this.listenTo(this.continuo, "clearedSelection", ()=>{
      // hide assertion button
      this.$el.find(".show-score-assertion").hide()
      this.model.set("hasSelection", false)
    })

  }

  nextPage() {
    if (this.page + 1 <= verovioToolkit.getPageCount()) {
        this.page = this.page +1;
        this.continuo.renderPage(this.page)
    }
  }

  prevPage() {
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
    this.scoreAssertionDialog.render(assert)
    // Assumes MDL JS
    if(!(typeof(componentHandler) == 'undefined')){
        componentHandler.upgradeAllRegistered();
    }
    this.scoreAssertionDialog.show()
  }

  newAssertion(){
    this.scoreAssertionDialog.ema = this.$el.find(".cnt-emaexpr-expr").text()
    this.scoreAssertionDialog.mei_ids = this.continuo.selectedElements
    this.showAssertion()
    this.continuo.clearSelection()
    this.$el.find(".show-score-assertion").hide()

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
    this.model.collection.trigger("clearScoreSelections")
  }

  storeSelection(){
    this.model.set("ema", this.$el.find(".cnt-emaexpr-expr").text())
    this.model.set("mei_ids", this.continuo.selectedElements)
  }

}

// Class-level shared verovio data info
ScoreView.verovioData = false;

export default ScoreView