import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';

class HideModeComponent extends Backbone.View {

  get tageName() {
    return "button"
  }

  get className() {
    return "mdl-button mdl-js-button mdl-button--raised hide_mode mdl-button--attention"
  }

  get events() {
      return {
          "click": this.close
      }
  }

  close() {
    this.dialog.showModal()
    Events.trigger("stopHideMode")
    this.$el.detach();
  }

  render(dialog){
    this.dialog = dialog
    this.$el.text("Return to editing")
    return this.el
  }

}

export default HideModeComponent
