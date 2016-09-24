var AlchemyAPI = require('alchemy-api'),
    config = require('./config'),
    alchemy = new AlchemyAPI(config.alchemyApi.key);

/**
 * Se verifica que el servicio este habilitado en cofig.js
 * @param {function} botSend - Función que maneja los envios
 * @param {string} from - Representa al usuario que lanzo la petición
 */

function validarEstado(botSend, from, callback) {
	if (config.hangouts.services.alchemy) {
		if(callback && typeof callback === "function"){
			callback();
		} else {
			console.log("[ERROR][Alchemy] El Callback no esta presente o no es una función.");
		}
	} else {
		botSend(from, "Alchemy Api ha sido desactivada por el jefe");
	}
}

/**
 * Función que envía al solicitante el estado del API (errores, estado real)
 * @param {function} botSend - Función que maneja los envios
 * @param {string} from - Representa al usuario que lanzo la petición
 */
 
exports.estado = function(botSend, from) {
	validarEstado(botSend, from, function(){
		alchemy.apiKeyInfo({}, function(err, response) {
            if (err) {
                botSend(from, "Tenemos un error: \n" + err);
            } else {
                botSend(from, '- Estado: ' + response.status + '\n- Consumido: ' + response.consumedDailyTransactions + '\n- Limite: ' + response.dailyTransactionLimit);
            }
        });
	});
};



/**
 * Función que envía al solicitante el analisis de una fotografía (errores, famosos, datos biométricos)
 * Se cubren todos los posibles casos: fotos sin personas, personas famosas, personas no famosas, multiples personas...
 * @param {function} botSend - Función que maneja los envios
 * @param {string} from - Representa al usuario que lanzo la petición
 * @param {string} message - Representa el mensaje enviado por el usuario en la petición
 */

exports.reconocimientoFacial = function(botSend, from, message) {
    validarEstado(botSend, from, function(){

        alchemy.imageFaces(message, {}, function(err, response) {
            if (err) {
                console.log(err);
                botSend(from, err);
            } else {
                var imageFaces = response.imageFaces;

                if (response.status === "OK") {
                    if (imageFaces.length !== 0) {
                        // Información mínima disponible
                        var respuesta = "";
                        for (var i = 0; i < imageFaces.length; i++) {

                            if (imageFaces[i].identity) {
                                // Es un famoso
                                respuesta += "- " + imageFaces[i].identity.name + " (" + imageFaces[i].identity.score + "%) " + imageFaces[i].identity.disambiguated.subType[1];
                                respuesta += "\n";

                            } else {
                                //  No es un famoso
                                respuesta += "- Anónimo. Estimo una edad entorno a " + imageFaces[i].age.ageRange + " y es " + (imageFaces[i].gender.gender === 'MALE' ? 'Hombre' : 'Mujer');
                                respuesta += "\n";
                            }

                        }
                        botSend(from, "Yo veo... \n" + respuesta);
                    } else {
                        // Sin información mínima disponible
                        botSend(from, "¿De qué personas me hablas?");
                    }

                } else {
                    botSend(from, "Mala suerte!\nAlchemy me ha mandado datos incorrectos.");
                }
            }
        });

    });
};




/**
 * Función para detectar el idioma
 * @param {function} botSend - Función que maneja los envios
 * @param {string} from - Representa al usuario que lanzo la petición
 * @param {string} message - Representa el mensaje enviado por el usuario en la petición
 */

exports.idioma = function(botSend, from, message) {
    validarEstado(botSend, from, function(){
        alchemy.language(message, {}, function(err, response) {
            if (err) {
                // Error de Conexión
                console.log(err);
                botSend(from, err);
            } else {
                if (response.language === "unknown") {
                    botSend(from, "Que idioma es ese?!");
                } else {
                    botSend(from, "Eso es " + response.language);
                    if (response["iso-639-2"] && response["native-speakers"]) {
                        botSend(from, "- ISO 639: " + response["iso-639-2"] + "\n- Hablantes: " + response["native-speakers"]);
                    }
                    if (response.wikipedia) {
                        botSend(from, response.wikipedia);
                    }
                }
            }
        });
    });
};



/**
 * Función para detectar el sentimeinto
 * @param {function} botSend - Función que maneja los envios
 * @param {string} from - Representa al usuario que lanzo la petición
 * @param {string} message - Representa el mensaje enviado por el usuario en la petición
 */

exports.sentimiento = function(botSend, from, message) {
    validarEstado(botSend, from, function(){
        alchemy.sentiment(message, {}, function(err, response) {
            if (err) {
                console.log(err);
                botSend(from, err);
            } else {
                var sentiment = "";

                if (response.status === "OK") {
                    sentiment += "- Idioma: " + response.language;
                    if (response.docSentiment) {
                        sentiment += "\n- Tipo: " + response.docSentiment.type;
                        if (response.docSentiment.score) {
                            sentiment += " (" + response.docSentiment.score + ")";
                        }
                    }
                    botSend(from, sentiment);
                } else {
                    botSend(from, "Alchemy me ha mandado datos incorrectos.\n"+response.statusInfo);
                }
            }
        });
    });
};



/**
 * Función para detectar las emociones
 * @param {function} botSend - Función que maneja los envios
 * @param {string} from - Representa al usuario que lanzo la petición
 * @param {string} message - Representa el mensaje enviado por el usuario en la petición
 */

exports.emociones = function(botSend, from, message) {
    validarEstado(botSend, from, function(){
        alchemy.emotions(message, {}, function(err, response) {
            if (err) {
                console.log(err);
                botSend(from, err);
            } else {
                if (response.status === "OK") {
                    var emotionsData = "Mi análisis:\n";
                    emotionsData += "- Idioma: " + response.language + "\n";
                    emotionsData += "- Enfado (" + response.docEmotions.anger + ")\n";
                    emotionsData += "- Repugnancia (" + response.docEmotions.disgust + ")\n";
                    emotionsData += "- Miedo (" + response.docEmotions.fear + ")\n";
                    emotionsData += "- Alegría (" + response.docEmotions.joy + ")\n";
                    emotionsData += "- Tristeza (" + response.docEmotions.sadness + ")\n";
                    botSend(from, emotionsData);
                } else {
                    botSend(from, "Alchemy me ha mandado datos incorrectos.\n"+response.statusInfo);
                }
            }
        });
    });
};
