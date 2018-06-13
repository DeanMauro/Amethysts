const Bizagi = require('../lib/bizagi.js');

module.exports = function(RED) {

    function BizagiStartProcessNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
         
            // Use connection to make calls
            var connection = RED.nodes.getNode(config.connection);

            // Check required params
            if (!connection)
                errorOut(node, "Your 'Start Process' node is all alone! Please specify a connection before making requests.");
            if(!config.process)
                errorOut(node, "You have to tell your 'Start Process' node which process to run!");
            
            var body;
            var callback = function(x, status) { 
                                        if (status < 300) node.send({payload: x});
                                        else errorOut(node, x);
                                    };


            try {
                orch.request({ type: 'GET', 
                               extension: '/odata/data/processes',
                               body: '{}',
                               callback: callback });
            } catch(e) {
                errorOut(node, e);
            }
        });
    }

    function errorOut(node, error) {
        node.error(error);
        node.send({ result: null,
                    success: false,
                    error: { message: "Error. Can't proceed." }
                 });
    }


/*=====================================================================================*/

    RED.nodes.registerType("bizagi-startProcess",BizagiStartProcessNode);
}