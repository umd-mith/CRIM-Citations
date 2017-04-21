import * as Backbone from 'backbone';
import Score from './model-score.js';

class Scores extends Backbone.Collection {
    constructor() {
        super();
        this.model = Score;
    }

}

export default Scores;
