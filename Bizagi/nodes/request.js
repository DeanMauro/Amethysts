require('../lib/bizagi.js');
const Api = require('../lib/api.js');

module.exports = function(RED) {

    function BizagiRequestNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
         
            // Use connection to make calls
            var connection = RED.nodes.getNode(config.studio);

            // Check that connection exists
            if (!connection)
                errorOut(node, "Your request node is all alone! Please specify a connection before making requests.");
            else
                var biz = connection.bizagi;
            
            var body;
            var callback = function(x, status) { 
                                        if (status < 300) node.send({payload: x});
                                        else errorOut(node, x);
                                    };

            // Properties Input
            if (config.category != "UseInput") {
                try {
                    // Convert fields provided through msg variable
                    if (config.category.startsWith("Msg")) {
                        config.category = msg.payload.category;
                    }

                    // Select Params
                    if (config.params.length != 0)
                        body = convertParams(config.params, msg, node);
                    else if (msg.payload.params)
                        body = msg.payload.params;
                    else
                        body = {};

                    // Check that a category and action were specified
                    if (!config.category) throw "That request was rather vague. Please specify an action in the node's properties."

                    // Get endpoint info
                    var endpoint = Api['Actions'](config.category);

                    // Add path & query params if needed
                    var extension;
                    [extension, body] = Api.fillPath(endpoint[0], endpoint[1], body);

                    // Sanitize body
                    if (body && body["Id"]) body["Id"] = parseInt(body["Id"]);

                    // Fire!
                    biz.request({ type: endpoint[0], 
                                   extension: extension,
                                   body: JSON.stringify(body),
                                   callback: callback }, connection);
                } catch(e) {
                    errorOut(node, e);
                }
            }

            // JSON Input
            else if (msg.payload.action && msg.payload.extension) {
                
                biz.request({ type: msg.payload.action, 
                               extension: msg.payload.extension,
                               body: JSON.stringify(msg.payload.body) || "",
                               callback: callback }, connection);
            } 

            // Bad Input
            else {
                errorOut(this, "Bad input. Please refer to the info tab for formatting.");
            }
        });
    }


    function convertParams(params, msg, node) {
        var body = {};
        
        for (var p of params) {
            var val = p.value;

            switch(p.type) {
                case 'msg':
                    val = RED.util.getMessageProperty(msg, "msg." + p.value); break;
                case 'json':
                    val = JSON.parse(p.value); break;
                case 'flow':
                    val = node.context().flow.get(p.value); break;
                case 'global':
                    val = node.context().global.get(p.value); break;
                case 'date':
                    val = Date.now(); break;
                case 'jsonata':
                    try{
                        var prep = RED.util.prepareJSONataExpression(p.value, msg);
                        val = RED.util.evaluateJSONataExpression(prep, msg);
                    } catch(err) {
                        errorOut(node, "Invalid JSONata expression");
                        return;
                    }
                    break;
            }

            body[p.key] = val;
        }

        return body;
    }

    
    function errorOut(node, error) {
        node.error(error);
        node.send({ result: null,
                    success: false,
                    error: { message: "Error. Can't proceed." }
                 });
    }


/*=====================================================================================*/

    RED.nodes.registerType("bizagi-request",BizagiRequestNode);
}