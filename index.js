var hangouts = require("./robot");

hangouts.response({
    id: "ciao",
    condition: function(msg){
      return "ciao" === msg;
    },
    action: function(from, msg){
        return "Ciao... amigo!";
    },
    // Opcionales
    admin: false, // Requiere ser Admin?. Valor por defecto False.
    special: false, // Asíncrono? Valor por defecto False
    description: "Nos despedimos...",
    sample: "ciao"
});