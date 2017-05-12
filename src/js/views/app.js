import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import AddFile from './addFile';
import Scores from '../data/coll-scores';
import ScoreView from './score';
import Relationships from '../data/coll-relationships';
import RelationshipView from './scoreRelationship';

class AppView extends Backbone.View {

  initialize () {
    this.addFileDialog = new AddFile({container: $("#dialogs")})
    this.scores = new Scores
    this.relationships = new Relationships
    this.relationshipDialog = new RelationshipView({container: $("#dialogs"), collection: this.relationships})

    this.listenTo(Events, "addScore", this.addScore)
    this.listenTo(Events, "relDialog:open", this.openRelDialog)
    this.listenTo(this.scores, "change", this.hasDoubleSection)

    this.listenTo(Events, "request:selections", ()=>{Events.trigger("response:selections", this.requestSelections())})
    this.listenTo(Events, "request:relationshipsFor", (score)=>{Events.trigger("response:relationships", this.requestRelationshipsFor(score))})

  }

  get events() {
      return {
        "click #add_btn": this.showAddFileDialog
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
    this.relationshipDialog.render(scores, rel)
    this.relationshipDialog.show()
  }

  render() {

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

}

export default AppView
