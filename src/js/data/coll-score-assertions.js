import * as Backbone from 'backbone';
import ScoreAssertion from './model-score-assertion.js';

class ScoreAssertions extends Backbone.Collection {
    constructor() {
        super();
        this.model = ScoreAssertion;
    }

}

export default ScoreAssertions;
