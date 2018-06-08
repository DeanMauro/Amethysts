"use strict";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class Bizagi {
  
  constructor(clientID, clientSecret, url) {
    this.url = url;
    this.token = null;
    this.getToken(clientID, clientSecret);
    this.start = Date.now();
  }


  getToken(clientID, clientSecret) {
    var xhttp = new XMLHttpRequest();
    var encoded = btoa(clientID + ":" + clientSecret);

    // Compose request
    xhttp.withCredentials = true;
    xhttp.open('POST', this.url + '/oauth2/server/token', false);
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.setRequestHeader('Authorization', 'Basic ' + encoded);
    xhttp.send('grant_type=client_credentials&scope=api');
    
    // Authentication is synchronous. Return token
    let arr = JSON.parse(xhttp.responseText);
    this.token = arr["access_token"];
  }


  request(p, node) {
    // Refresh token if needed
    this.refreshToken(node);

  	var xhttp = new XMLHttpRequest();
  	xhttp.withCredentials = true;

  	// Calls are asynchronous. Use a callback to get the response
  	xhttp.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
        	let result = JSON.parse(this.responseText || "{\"status\":"+this.status+"}");
        	p["callback"](result, this.status);
		    }
    };

	  // Compose request
    xhttp.open(p["type"].toUpperCase(), this.url + p["extension"], true);
    xhttp.setRequestHeader('Content-Type', p["contentType"] || 'application/json');
  	xhttp.setRequestHeader('Authorization', 'Bearer ' + (this.token || '') );
    xhttp.send(p["body"]);
  }


  refreshToken(node) {
    if (!this.start || (Date.now() - this.start) >= 900000) {
      var creds = node.credentials;
      this.getToken(creds.clientID, creds.clientSecret);
      
      console.log("Refreshed Token");
    }
  }

}

module.exports = Bizagi;