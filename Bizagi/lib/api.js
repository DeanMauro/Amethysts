"use strict";

class Api {

	static fillPath(action, path, params) {
		/*Path Params*/		
		for (var target of (path.match(/\[\w+\]/g) || [])) {
			var key = target.slice(1, -1);

			if (params[key])
				path = path.replace(target, params[key]);
			else
				throw "Path Parameter '" + key + "' is missing. Please add it and try again.";
		}

		/*Query Params*/
		if (action == "GET") {
			var qString = "?";

			// Combine all query params, which start with $
			for (var key of Object.keys(params).filter((key) => /\$.*/.test(key)))
				qString += (key + "=" + params[key] + "&");

			// If query params existed, remove last '&'' and append to path
			if (qString != "?") 
				path += qString.slice(0, -1)
		}

		return path;
	}

	static Processes(action) {
		return {
			GetAll: ["GET", "odata/data/processes"],
			GetOne: ["GET", "odata/data/processes([id_process])"],
			GetAllRelatedEntities: ["GET", "odata/data/processes([id_process])/relatedEntities"],
			GetOneRelatedEntity: ["GET", "odata/data/processes([id_process])/relatedEntities([id_related])"],
			GetAllValues: ["GET", "odata/data/processes([id_process])/relatedEntities([id_related])/values"],
			GetAllActions: ["GET", "odata/data/processes([id_process])/actions"],
			StartProcess: ["POST", "odata/data/processes([id_process])/start"],
			GetCases: ["GET", "odata/data/processes([id_process])/cases"],
			GetOneCase: ["GET", "odata/data/processes([id_process])/cases([id_case])"]
		}[action]
	}
}

module.exports = Api;