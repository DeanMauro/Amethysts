const Bizagi = require('../lib/bizagi.js');

module.exports = function(RED) {
    function BizagiRequestNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });
    }
    
    function BizagiConnectionNode(n) {
        RED.nodes.createNode(this);

        var creds = this.credentials;
        this.bizagi = new Bizagi(creds.clientID, creds.clientSecret, creds.url);
    }


/*=====================================================================================*/


    /*Register connection*/
    RED.nodes.registerType("bizagi-connection",BizagiConnectionNode, {
        credentials: {
            url: {type: "text"},
            clientId: {type: "text"},
            clientSecret: {type: "password"}
        }
    });

    RED.nodes.registerType("bizagi-request",BizagiRequestNode);
}