import $ from 'jquery';
import * as Backbone from 'backbone'
import Scores from './data/coll-scores'
import ScoreView from './views/score'

class Router extends Backbone.Router {

    constructor () {
        super();
    }

    initialize() {
      let scores = new Scores
      let s1 = scores.add({mei: "./fakeData/mei/DC0101.xml", title: "DC0101"})
      let v1 = new ScoreView({model: s1})
      $("#create_edit .mdl-grid").append(v1.render())
      v1.renderContinuoScore()

      let s2 = scores.add({mei: "./fakeData/mei/DC0102.xml", title: "DC0102"})
      let v2 = new ScoreView({model: s2})
      $("#create_edit .mdl-grid").append(v2.render())
      v2.renderContinuoScore()
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
