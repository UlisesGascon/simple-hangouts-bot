var pjson = require('./package.json');

var config = {
	version: pjson.version,
	creador: pjson.author,
	// Habgouts
    hangouts: {
      	usuarioId: "",
    	usuarioAutorizado: "",
    	botEmail: "",
    	botPassword: "",
    	services: {
    		twitter: true,
    		alchemy: true
    	}
    },
    alchemyApi: {
    	key: ""
    },
    //Twitter
    twitter : {
      consumer_key: "", 
      consumer_secret: "",
      access_token_key: "",
      access_token_secret: ""
    }
};

module.exports = config;