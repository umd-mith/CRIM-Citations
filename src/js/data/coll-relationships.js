import * as Backbone from 'backbone';
import Relationship from './model-relationship';

class Relationships extends Backbone.Collection {
    constructor() {
        super();
        this.model = Relationship;
    }

}

export default Relationships;
