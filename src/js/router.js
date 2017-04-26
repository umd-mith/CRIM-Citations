import $ from 'jquery';
import * as Backbone from 'backbone'
import AppView from './views/app'

class Router extends Backbone.Router {

    constructor () {
        super();
    }

    initialize() {

      let app = new AppView({el: "body"})
      app.render()

    }

    routes () {
      return {
        '': 'create',
        'view': 'view'
      };
    }

    create () {
        console.log('Create')
    }

    view () {
        console.log('View')
    }

}

export default Router;
