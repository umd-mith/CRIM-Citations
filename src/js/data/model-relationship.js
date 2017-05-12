import * as Backbone from 'backbone';

class Relationship extends Backbone.Model {
  get defaults() {
    return {
      types : {}
    }
  }
  toJSON() {
    var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
    json.cid = this.cid;
    json.boolDir = this.get("direction") == "a2b" ? true : false
    return json;
  }
}

export default Relationship;
