import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import addfile_tpl from '../templates/addfile-tpl';
import dialogPolyfill from 'dialog-polyfill'
import '../../../lib/dropbox/dropins';

class AddFile extends Backbone.View {

  initialize () {
    Dropbox.appKey = "gwuog2373cwj45g";
  }

  template(tpl){
      return addfile_tpl(tpl);
  }

  get events() {
      return {
          "click .close": this.close,
          "click #from_url": this.fromUrl,
          "click #from_dropbox": this.fromDropbox,
      }
  }

  fromUrl() {

    this.close()

    let url = this.$el.find("input").val().trim();
    // Go via Omas to bypass CORS
    let omas_url = "http://mith.umd.edu/ema/"+encodeURIComponent(url)+"/all/all/@all"

    let fileInfo = {
        "filename": url.replace(/^.*[\\\/]/, ''),
        "url": url
    };

    $.get(omas_url, (data) => {
      fileInfo["string"] = data;
      Events.trigger('addScore', fileInfo);
    }, 'text')
      .fail((msg)=>{
          console.log(msg);
      })
  }

  fromDropbox() {
    this.close()
    let options = {
        // Required. Called when a user selects an item in the Chooser.
        success: function(files) {
            let fileInfo = {
                "filename": files[0].name,
                "url": files[0].link
            };
            $.get(files[0].link, (data) => {
              fileInfo["string"] = data;
              Events.trigger('addScore', fileInfo);
            }, 'text').fail((msg)=>{
                console.log(msg);
            })
        },

        // Optional. Called when the user closes the dialog without selecting a file
        // and does not include any parameters.
        cancel: function() {

        },
        linkType: "direct",
        multiselect: false,
        extensions: ['.xml', '.mei'],
    };

    Dropbox.choose(options);
  }

  show() {
    this.dialog.showModal();
  }

  close() {
    this.dialog.close();
  }

  render() {
    this.$el.append(this.template())
    this.dialog = this.$el.find('dialog').get(0)
    if (! this.dialog.showModal) {
      dialogPolyfill.registerDialog(this.dialog);
    }
  }

}

export default AddFile
