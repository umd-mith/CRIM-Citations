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
    $("dialog").filter((i, d)=>{return $(d).data("hiding") === "true"}).each((i, d)=>{
      d.showModal()
    })
    Events.trigger("stopHideMode")
    this.$el.detach();
  }

  render(){
    this.$el.text("Return to editing")
    return this.el
  }

}

export default HideModeComponent
