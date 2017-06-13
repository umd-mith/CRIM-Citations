import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import AddFile from './addFile';
import Import from './import';
import Scores from '../data/coll-scores';
import ScoreView from './score';
import Relationships from '../data/coll-relationships';
import RelationshipView from './scoreRelationship';
import HideModeComponent from './hideModeComponent';
import saveAs from 'save-as';

class AppView extends Backbone.View {

  initialize () {
    this.addFileDialog = new AddFile({container: $("#dialogs")})
    this.importDialog = new Import({container: $("#dialogs")})
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

    this.listenTo(Events, "import", this.importData)

  }

  get events() {
      return {
        "click #add_btn": this.showAddFileDialog,
        "click #export_btn": this.export,
        "click #import_btn": this.import
      }
  }

  addScore(fileInfo, createnew=true) {
    let title = fileInfo.filename
    if (fileInfo.title){
      title = fileInfo.composer + ": " + fileInfo.title
    }
    let scoreView = new ScoreView({model:
      this.scores.add({mei: fileInfo.string, title: title, url: fileInfo.url})
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

    let string = JSON.stringify(export_obj)

    let bb = new Blob([string], {"type":"application\/json"});
    saveAs(bb, 'crim.json');

    return export_obj
  }

  importMeiData(url){
      // Go via Omas to bypass CORS
      let omas_url = "http://mith.umd.edu/ema/"+encodeURIComponent(url)+"/all/all/@all"

      return (new Promise((res, rej)=>{
        $.get(omas_url, (data) => {
          res(data)
        }, 'text')
          .fail((msg)=>{
              console.log(msg);
              rej()
          })
      }))

  }

  importData(data) {
    for (let score of data.scores) {
      let s = this.scores.add(score)
      s.set("id", score.cid)
      s.cid = score.cid

      for (let assert of data.assertions){
        if (assert.score == s.cid) {
          let a = s.assertions.add(assert)
          a.set("id", assert.cid)
          a.cid = assert.cid
        }
      }

      // Get mei
      this.importMeiData(s.get("url")).then((mei)=>{
        s.set("mei", mei)
        let scoreView = new ScoreView({model: s})
        this.$el.find("#create_edit .mdl-grid").prepend(scoreView.render())
        scoreView.renderContinuoScore()
      })

    }

    for (let rel of data.relationships) {
        let r = this.relationships.add(rel)
        r.set("id", rel.cid)
        r.cid = rel.cid
    }

  }

  doImport(){
    this.relationships.reset()
    this.scores.each((s)=>{
      s.assertions.reset()
      s.trigger("close", true)
    })
    this.scores.reset()
    this.importDialog.show()
  }

  import() {
    // if a relationship exists, warn that it will be lost
    if (this.relationships.models.length > 0){
      let r = confirm("All open scores will be clsoed and unsaved relationships will be lost: continue?")
      if (r){
        this.doImport()
      }
    }
    else this.doImport()
  }

  removeRel(relid){
    let rel = this.relationships.get(relid)
    this.scores.trigger("delete_assertion", rel.get("scoreAassert"))
    this.scores.trigger("delete_assertion", rel.get("scoreBassert"))
    this.relationships.remove(relid)
  }

}

export default AppView
