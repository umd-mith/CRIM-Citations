import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import AddFile from './addFile';
import Scores from '../data/coll-scores';
import ScoreView from './score';

class AppView extends Backbone.View {

  initialize () {
    this.addFileDialog = new AddFile({el: "#dialogs"})
    this.scores = new Scores

    this.listenTo(Events, "addScore", this.addScore)

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

  render() {
    this.addFileDialog.render()
  }

}

export default AppView
