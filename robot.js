// -- Dependencias --
var hangoutsBot = require("hangouts-bot"),
	exec = require('child_process').exec,
	config = require('./config'),
	bot = new hangoutsBot(config.botEmail, config.botPassword);

// -- Variables --
var masterUserRegex = new RegExp(config.usuarioId),
	masterUser = config.usuarioAutorizado,
	terminalRegex = /^[Tt]erminal /,
	holaRegex = /^[Hh]ola/;

bot.on('online', function() {
	bot.sendMessage(masterUser, "Hola de nuevo, Jefe!");
});

bot.on('message', function(from, message) {
	console.log(from + ">> " + message);
	if(message === "Quien eres?"){
		bot.sendMessage(from, "Soy un Robot... ayudo a desarrolladores que lo necesitan.");
	} else if (message === "Que version eres?"){
		bot.sendMessage(from, "Yo estoy en la version "+config.version);
	} else if (message === "Quien es tu creador?"){
		bot.sendMessage(from, "Mi creador es "+config.creador);
	} else if (message === "Quien soy?"){
		bot.sendMessage(from, "Yo te conozco como "+from);
	} else if (holaRegex.test(message)){
		bot.sendMessage(from, "Hola Humano! Qué tal?");
	} else if (message === "Timestamp"){
		bot.sendMessage(from, hora());
	} else if(terminalRegex.test(message)){
		if (masterUserRegex.test(from)){
			var comando = message.replace(terminalRegex,'');
			console.log(comando);
			
			exec(comando, function (err, stdout, stderr) {
				if(!err){
					bot.sendMessage(from, 'Respuesta: \n'+stdout);
				} else {
					bot.sendMessage(masterUser, 'Error: \n'+err);
				}
			});
		} else {
			bot.sendMessage(from, 'Buen intento.. pero con esas zapatillas no ejecutas comandos!');
			bot.sendMessage(masterUser, 'Intento de ejecutar código por parte de '+from+'\n Ha solicitado '+message);
		}
	} else {
		bot.sendMessage(from, "No te entiendo... Explicate mejor, Humano!");
	}
});

// -- Eventos --

// CONTROL + C
process.on('SIGINT', function() {
	bot.sendMessage(masterUser, "Me piro! Ya no me quieres como antes...");
    process.exit();
});

// Salida Normal
process.on('exit', function() {
	bot.sendMessage(masterUser, "Me piro! Vaciones por fín!");
    process.exit();
});

// Salida inesperada
process.on('uncaughtException', function() {
	bot.sendMessage(masterUser, "Me piro! Cierre inesperado...");
    process.exit();
});


// -- Funciones --
function hora (){
    var date = new Date();
    return (date.toLocaleString('es-ES'));
}

