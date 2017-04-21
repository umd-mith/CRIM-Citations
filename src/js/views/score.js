import $ from 'jquery';
import * as Backbone from 'backbone';
import Continuo from 'continuo';
import score_tpl from '../templates/score-tpl'

class ScoreView extends Backbone.View {

  initialize (options) {
    this.mei = options.mei
    this.page = 1
  }

  get className() {
      return "mdl-cell mdl-cell--12-col mdl-shadow--2dp";
  }

  template(tpl){
      return score_tpl(tpl);
  }

  get events() {
      return {
          "click .nextPage": this.nextPage,
          "click .prevPage": this.prevPage
      }
  }

  render() {

    // Update id from model
    let score_id = 'score-' + this.model.cid
    this.$el.prop("id", score_id);

    this.$el.html(this.template({title: this.model.get("title")}));

    return this.$el

  }

  renderContinuoScore() {
    let score_path = "#score-" + this.model.cid + " .score"

    let opts = {
        pageWidth: this.$el.width() * 100 / 35,
        pageHeight: 250 * 100 / 35,
        ignoreLayout: 1,
        adjustPageHeight: 1,
        border: 20,
        scale: 35
    };

    this.continuo = new Continuo({
      el: score_path,
      mei: this.model.get("mei"),
      verovioToolkit: ScoreView.verovioToolkit,
      verovioOptions: opts,
      paginate: true,
      showPageCtrls: false
    })

    this.continuo.render()
  }

  nextPage() {
    if (this.page + 1 <= ScoreView.verovioToolkit.getPageCount()) {
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

}

// Class-level shared verovio toolkit
// N.B. verovio must be global
ScoreView.verovioToolkit = new verovio.toolkit();

export default ScoreView
