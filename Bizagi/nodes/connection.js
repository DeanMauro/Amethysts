const Bizagi = require('../lib/bizagi.js');

module.exports = function(RED) {

    function BizagiConnectionNode(n) {
        RED.nodes.createNode(this);

        var creds = this.credentials;
        this.bizagi = new Bizagi(creds.clientID, creds.clientSecret, creds.url);
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