const Bizagi = require('../lib/bizagi.js');

module.exports = function(RED) {

    function BizagiConnectionNode(n) {
        RED.nodes.createNode(this, n);
        var creds = this.credentials;

        this.bizagi = new Bizagi(creds.clientId, creds.clientSecret, creds.url);
    }

    
    /*Register connection*/
    RED.nodes.registerType("bizagi-connection",BizagiConnectionNode, {
        credentials: {
            url: {type: "text"},
            clientId: {type: "text"},
            clientSecret: {type: "password"}
        }
    });

}