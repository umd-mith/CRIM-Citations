import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import addfile_tpl from '../templates/addfile-tpl';
import dialogPolyfill from 'dialog-polyfill'
import '../../../lib/dropbox/dropins';

class AddFile extends Backbone.View {

  initialize (options) {
    Dropbox.appKey = "gwuog2373cwj45g";
    this.container = options.container;
    this.filebase = "http://92.154.49.37/CRIM/files/original/"
    this.scores = []
  }

  get tagName(){
    return "dialog"
  }

  get className() {
    return "mdl-dialog addFile"
  }

  template(tpl){
      return addfile_tpl(tpl);
  }

  get events() {
      return {
          "click .close": this.close,
          "click #openFile": this.open
          // "click #from_url": this.fromUrl,
          // "click #from_dropbox": this.fromDropbox,
      }
  }

  open(e) {
    if (this.$el.find("#crim-panel.is-active").length > 0){
      for (let score of this.$el.find("#crim-panel .mdl-checkbox__input:checked")){
        let $score = $(score)
        this.fromUrl($score.val(), $score.data("composer"), $score.data("title") )
      }
    }
    else {
      this.fromUrl()
    }
    this.close()
  }

  fromUrl(url, composer, title) {

    if (!url){
      url = this.$el.find("#url_input").val().trim();
    }
    // Go via Omas to bypass CORS
    let omas_url = "http://mith.umd.edu/ema/"+encodeURIComponent(url)+"/all/all/@all"

    let fileInfo = {
        "filename": url.replace(/^.*[\\\/]/, ''),
        "composer": composer,
        "title": title,
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
    // it it's detached, render.
    if (this.$el.parent().length == 0) {
      this.render().then(()=>{
        // Assumes MDL JS
        if(!(typeof(componentHandler) == 'undefined')){
            componentHandler.upgradeAllRegistered();
        }
        this.el.showModal();
      })
    }
    else this.el.showModal();
  }

  close() {
    this.el.close();
  }

  render() {

    // get files info
    return $.get("http://92.154.49.37/CRIM/api/meifiles", (data)=>{
      for (let score of data){
        let title = score.item_title
        let origf = score.files[0].original_filename
        origf = origf.match("Mass") ? origf.split(/[_\.]/)[3] : ""
        if (origf) {
          title = title + " (" + origf + ")"
        }

        let fileinfo = {
          title: title,
          composer: score.composer,
          url: this.filebase + score.files[0].filename,
          id: "s"+score.files[0].id
        }
        this.scores.push(fileinfo)
      }

      this.container.append(this.$el.html(this.template({scores:this.scores})))
      if (! this.el.showModal) {
        dialogPolyfill.registerDialog(this.el);
      }

    }, 'json')
  }

}

export default AddFile
