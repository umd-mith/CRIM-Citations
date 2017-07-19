import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import export_tpl from '../templates/export-tpl';
import dialogPolyfill from 'dialog-polyfill'
import saveAs from 'save-as';

class Export extends Backbone.View {

  initialize (options) {
    this.container = options.container;
    this.citation = options.citation;
  }

  get tagName(){
    return "dialog"
  }

  get className() {
    return "mdl-dialog export"
  }

  template(tpl){
      return export_tpl(tpl);
  }

  get events() {
      return {
          "click .close": this.close,
          "click #expToDisk": this.expToDisk,
          "click #expToOmeka": this.expToOmeka
      }
  }

  expToDisk() {
    let string = JSON.stringify(this.data)
    let bb = new Blob([string], {"type":"application\/json"});
    let filename = this.data.user ? "user"+this.data.user : "anonymous"
    filename = filename + "_" + this.data.created_at + ".json"
    saveAs(bb, filename);
    Events.trigger("resetData");
    this.close()
  }

  expToOmeka() {
    let string = JSON.stringify(this.data)

    if (this.citation){
      let r = confirm("This will overwrite an existing record in the Omeka database. Continue?")
      if (r) {
        // http://92.154.49.37/CRIM/api/meifiles/'+this.citation
        $.ajax({
          url: 'http://92.154.49.37/CRIM/api/meifiles/'+this.citation,
          type: 'PUT',
          data: string,
          dataType: 'text',
          contentType: 'text/plain',
          headers: {
            'Content-Type': 'text/plain'
          },
          success: () => {
            Events.trigger("resetData");
            this.$el.find(".mdl-dialog__content p").hide();
            this.$el.find(".mdl-dialog__content strong").show()
            setTimeout(()=>{
              this.$el.find(".mdl-dialog__content p").show();
              this.$el.find(".mdl-dialog__content strong").hide();
              this.close()
            }, '1100')
          },
          error: (err) => {
            this.$el.find(".mdl-dialog__content p").html("<strong>An error occured!</strong>")
            console.log(err)
          }
      });
      }
    }
    else {
      $.post( "http://92.154.49.37/CRIM/api/meifiles", string)
      .done(() => {
        Events.trigger("resetData");
        this.$el.find(".mdl-dialog__content p").hide();
        this.$el.find(".mdl-dialog__content strong").show()
        setTimeout(()=>{
          this.$el.find(".mdl-dialog__content p").show();
          this.$el.find(".mdl-dialog__content strong").hide();
          this.close()
        }, '1100')
      })
      .fail((err) => {
        this.$el.find(".mdl-dialog__content p").html("<strong>An error occured!</strong>")
        console.log(err)
      })
    }
  }

  show(data) {
    this.data = data
    // it it's detached, render.
    if (this.$el.parent().length == 0) {
      this.render()
      // Assumes MDL JS
      if(!(typeof(componentHandler) == 'undefined')){
          componentHandler.upgradeAllRegistered();
      }
    }

    this.el.showModal();
  }

  close() {
    this.el.close();
  }

  render() {
    this.container.append(this.$el.html(this.template()))
    if (! this.el.showModal) {
      dialogPolyfill.registerDialog(this.el);
    }
  }

}

export default Export
