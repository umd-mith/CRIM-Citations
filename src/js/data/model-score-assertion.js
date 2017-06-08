import * as Backbone from 'backbone';

class ScoreAssertion extends Backbone.Model {
  get defaults() {
    return {
      types : {}
    }
  }
  toJSON() {
    var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
    json.cid = this.cid;
    json.score = this.collection.score;
    return json;
  }
}

export default ScoreAssertion;
