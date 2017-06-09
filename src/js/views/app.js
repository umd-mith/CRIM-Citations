import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import AddFile from './addFile';
import Scores from '../data/coll-scores';
import ScoreView from './score';
import Relationships from '../data/coll-relationships';
import RelationshipView from './scoreRelationship';
import HideModeComponent from './hideModeComponent';

class AppView extends Backbone.View {

  initialize () {
    this.addFileDialog = new AddFile({container: $("#dialogs")})
    this.scores = new Scores
    this.relationships = new Relationships
    this.relationshipDialog = new RelationshipView({container: $("#dialogs"), collection: this.relationships})
    this.hideModeComponent = new HideModeComponent()

    this.listenTo(Events, "addScore", this.addScore)
    this.listenTo(Events, "relDialog:open", this.openRelDialog)
    this.listenTo(Events, "edit_relationship", (relid)=>{this.openRelDialog(undefined, relid)})
    this.listenTo(Events, "delete_relationship", this.removeRel)
    this.listenTo(this.scores, "change", this.hasDoubleSection)

    this.listenTo(Events, "request:selections", ()=>{Events.trigger("response:selections", this.requestSelections())})
    this.listenTo(Events, "request:relationshipsFor", (score)=>{Events.trigger("response:relationships", this.requestRelationshipsFor(score))})

    this.listenTo(Events, "startHideMode", this.startHideMode)
    this.listenTo(Events, "stopHideMode", this.stopHideMode)

  }

  get events() {
      return {
        "click #add_btn": this.showAddFileDialog,
        "click #export_btn": this.export
      }
  }

  addScore(fileInfo) {
    let scoreView = new ScoreView({model:
      this.scores.add({mei: fileInfo.string, title: fileInfo.filename, url: fileInfo.url})
    })
    this.$el.find("#create_edit .mdl-grid").prepend(scoreView.render())
    scoreView.renderContinuoScore()
  }

  showAddFileDialog() {
    this.addFileDialog.show()
  }

  openRelDialog(scores, rel) {
    if (!scores && rel){
      let mrel = this.relationships.get(rel)
      scores = [this.scores.get(mrel.get("scoreA")), this.scores.get(mrel.get("scoreB"))]

      // Add selections to the scores...
      let scoreA_ema = mrel.get("scoreA_ema")
      let scoreB_ema = mrel.get("scoreB_ema")

    }
    this.relationshipDialog.render(scores, rel)
    this.relationshipDialog.show()
  }

  startHideMode(dialog) {
    this.scores.trigger("disableButtons")
    this.$el.find(".crim_header").prepend(this.hideModeComponent.render(dialog))
  }

  stopHideMode() {
    this.scores.trigger("renableButtons")
  }

  requestSelections(){
    return this.scores.filter((score)=>{
      return score.get("hasSelection")
    })
  }

  requestRelationshipsFor(score){
    return this.relationships.filter((rel)=>{
      return rel.get("scoreA") == score || rel.get("scoreB") == score
    })
  }

  hasDoubleSection(changed_score) {
    let scores_with_selection = this.scores.filter((score)=>{
      return score.get("hasSelection")
    })
    if (scores_with_selection.length == 2) {
      for (let score of scores_with_selection) {
        score.trigger("showRelationshipButton", scores_with_selection)
      }
    }
    else this.scores.trigger("hideRelationshipButtons")
  }

  export(){
    let export_obj = {
      relationships : this.relationships.toJSON(),
      scores: this.scores.export(),
      assertions: this.scores.exportAssertions()
    }
    console.log(export_obj)
    return export_obj
    // let scores_info = this.scores.export()
  }

  removeRel(relid){
    let rel = this.relationships.get(relid)
    this.scores.trigger("delete_assertion", rel.get("scoreAassert"))
    this.scores.trigger("delete_assertion", rel.get("scoreBassert"))
    this.relationships.remove(relid)
  }

}

export default AppView
