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

	static Alerts(action) {
		return {
			GetAll: ["GET", "odata/Alerts"],
			GetUnreadCount: ["GET", "odata/Alerts/UiPath.Server.Configuration.OData.GetUnreadCount()"],
			MarkAsRead: ["POST", "odata/Alerts/UiPath.Server.Configuration.OData.MarkAsRead"],
			RaiseProcessAlert: ["POST", "/odata/Alerts/UiPath.Server.Configuration.OData.RaiseProcessAlert"]
		}[action]
	}
}

module.exports = Api;