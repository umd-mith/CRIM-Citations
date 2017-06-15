import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import import_tpl from '../templates/import-tpl';
import dialogPolyfill from 'dialog-polyfill'
import '../../../lib/dropbox/dropins';

class Import extends Backbone.View {

  initialize (options) {
    Dropbox.appKey = "gwuog2373cwj45g";
    this.container = options.container;
  }

  get tagName(){
    return "dialog"
  }

  get className() {
    return "mdl-dialog import"
  }

  template(tpl){
      return import_tpl(tpl);
  }

  get events() {
      return {
          "click .close": this.close,
          "click #doImport": this.import,
          "click #from_dropbox": this.fromDropbox,
          "change #uploadBtn": (e)=>{this.$el.find("#uploadFile").val(e.target.files[0].name)}
      }
  }

  doImport(data){
    Events.trigger("import", data)
  }

  import(e){
    $("#loader").show()
    let tab = this.$el.find("div.mdl-tabs__panel.is-active").attr("id")
    if (tab == "local-panel"){
      this.fromLocal()
    }
    else if (tab == "url-panel"){
      this.fromUrl()
    }
    else {
      //no-op
    }
  }

  fromLocal() {
    this.close()

    let file = this.$el.find("#uploadBtn").get(0).files[0]

    // Only process json files.
    if (file.name.split(".").pop() != "json") {
        $status.text("Wrong file type");
    }
    else {
      let reader = new FileReader()
      reader.onload = (e) => {
        let text = e.target.result;
        let json = JSON.parse(text)
        this.doImport(json)
      }
      reader.readAsText(file)
    }

  }

  fromUrl() {

    this.close()

    let url = this.$el.find("#url_input").val().trim();

    $.get(url, (data) => {
      this.doImport(data)
    }, 'json')
      .fail((msg)=>{
          console.log(msg);

      })
  }

  fromDropbox() {
    this.close()
    let options = {
        // Required. Called when a user selects an item in the Chooser.
        success: function(files) {
            $.get(files[0].link, (data) => {
              this.doImport(data)
            }, 'json').fail((msg)=>{
                console.log(msg);
            })
        },

        // Optional. Called when the user closes the dialog without selecting a file
        // and does not include any parameters.
        cancel: function() {

        },
        linkType: "direct",
        multiselect: false,
        extensions: ['.json'],
    };

    Dropbox.choose(options);
  }

  show() {
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

export default Import
