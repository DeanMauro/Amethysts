const Bizagi = require('../lib/bizagi.js');

module.exports = function(RED) {
    function BizagiRequestNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });
    }
    
    function BizagiStudioNode(n) {
        RED.nodes.createNode(this);
        var creds = this.credentials;
        
        
    }

    RED.nodes.registerType("bizagi-request",BizagiRequestNode);

    /*Register connection*/
    RED.nodes.registerType("bizagi-studio",BizagiStudioNode);
}

// 20 Min TIMEOUT