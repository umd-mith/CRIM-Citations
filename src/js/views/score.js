import $ from 'jquery';
import * as Backbone from 'backbone';
import Continuo from 'continuo';
import score_tpl from '../templates/score-tpl'

class ScoreView extends Backbone.View {

  initialize (options) {
    this.page = 1
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
          "click .collapse_expand_button": this.toggle
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
    let scale = 35;
    let border = 20;

    let opts = {
        pageWidth: this.$el.width() * 100 / scale,
        pageHeight: 250 * 100 / scale,
        ignoreLayout: 1,
        adjustPageHeight: 1,
        border: border,
        scale: scale
    };

    this.continuo = new Continuo({
      el: score_path,
      meiString: this.model.get("mei"),
      verovioToolkit: ScoreView.verovioToolkit,
      verovioOptions: opts,
      paginate: true,
      showPageCtrls: false
    })

    this.continuo.render()

    // Adjust height to SVG
    this.$el.height(this.$el.find('svg').height() + 100)
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

}

// Class-level shared verovio toolkit
// N.B. verovio must be global
ScoreView.verovioToolkit = new verovio.toolkit();

export default ScoreView
