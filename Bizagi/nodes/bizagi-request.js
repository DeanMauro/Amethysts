module.exports = function(RED) {
    function BizagiRequestNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });
    }
    RED.nodes.registerType("bizagi-request",BizagiRequestNode);
}