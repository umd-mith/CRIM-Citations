import * as Backbone from 'backbone';
import ScoreAssertions from './coll-score-assertions'

class Score extends Backbone.Model {
  initialize() {
      this.assertions = new ScoreAssertions;
  }

  newAssertion() {
    let new_assert = this.assertions.add({})
    this.trigger("new_assertion", new_assert.cid)
    return new_assert
  }
}

export default Score;
