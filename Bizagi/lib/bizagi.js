"use strict";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var btoa = require('btoa');

class Bizagi {
  
  constructor(clientId, clientSecret, url) {
    this.url = url.replace(/\/$/, "");
    this.token = null;
    this.getToken(clientId, clientSecret);
    this.start = Date.now();
  }


  getToken(clientId, clientSecret) {
    var xhttp = new XMLHttpRequest();
    var encoded = btoa(clientId + ":" + clientSecret);

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


  request(p, connection) {
    // Refresh token if needed
    this.refreshToken(connection);

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
    xhttp.open(p["type"].toUpperCase(), this.url + '/' + p["extension"], true);
    xhttp.setRequestHeader('Content-Type', p["contentType"] || 'application/json');
  	xhttp.setRequestHeader('Authorization', 'Bearer ' + (this.token || '') );
    xhttp.setRequestHeader('User-Agent', '' );
    xhttp.send(p["body"]);
  }


  refreshToken(connection) {
    var start = connection.bizagi
    if (!this.token || !this.start || (Date.now() - this.start) >= 900000) {
      var creds = connection.credentials;
      console.log(creds);
      this.getToken(creds.clientId, creds.clientSecret);

      console.log("Refreshed Token");
    }
  }

}

module.exports = Bizagi;