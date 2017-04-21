import $ from 'jquery';
import * as Backbone from 'backbone';
import Router from './router';

class CRIMCitations {

    constructor () {
        new Router();
        Backbone.history.start();
        console.log('App started.')
    }

}

$(() => {
    new CRIMCitations();
});

export default CRIMCitations;
