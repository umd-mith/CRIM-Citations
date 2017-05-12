import * as Backbone from 'backbone';
import ScoreAssertions from './coll-score-assertions'

class Score extends Backbone.Model {
  initialize() {
      this.assertions = new ScoreAssertions;
  }
}

export default Score;
