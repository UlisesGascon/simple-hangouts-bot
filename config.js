var pjson = require('./package.json');

var config = {
	version: pjson.version,
	creador: pjson.author,
	usuarioId: "",
	usuarioAutorizado: "",
	botEmail: "",
	botPassword: ""
};

module.exports = config;