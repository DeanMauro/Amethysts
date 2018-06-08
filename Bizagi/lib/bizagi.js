"use strict";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class Bizagi {
  
  constructor(clientID, clientSecret, url) {
    this.url = url;
    this.token = null;
    this.token = this.getToken(clientID, clientSecret);
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
    return arr["access_token"]
  }


  request(p) {
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
    if (!this.start || (Date.now() - this.start) >= 1500000)
      Bizagi.refresh(node);
  }


  static refresh(node) {
    var creds = node.credentials;
    var instance = new Bizagi(creds.clientID, 
                              creds.clientSecret,
                              creds.url);
    
    node.context().flow.set("bizagi", instance);
    console.log("Refreshed Token");
  }

}

module.exports = Bizagi;