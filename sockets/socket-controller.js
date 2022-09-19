const { validarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

// Instancia de nuestra Clase Chat
const chatMensajes = new ChatMensajes();
// IO es todo el server de sockets
const socketController = async (client, io) => {
  const token = client.handshake.headers["x-token"];
  const usuario = await validarJWT(token);
  if (!usuario) {
    return client.disconnect();
  }

  // Usuario Activos
  chatMensajes.conectarUsuario(usuario)
  io.emit('usuarios-activos', chatMensajes.usuariosArr );
  client.emit('recibir-mensajes', chatMensajes.ultimos);

  // Conectar Socket a una sala especial
  client.join(usuario.id); //TODO: Cada usuario ahora va a pertenecer a 3 salas: Global, Socket.id y usuario.id



  // Desconectar Usuario
  client.on('disconnect', () => {
    chatMensajes.desconectarUsuario(usuario.id);
    io.emit('usuarios-activos', chatMensajes.usuariosArr ); // emitimos a todos que alguien se desconecto
    console.log("Se desconecto: ", usuario.name);
  });

  client.on("enviar-mensaje", ({uid, mensaje}) => {
    
    //Validamos si el mensaje va a ser privado publico
    if(uid){
      //Mensaje Privado
      client.to(uid).emit('mensaje-privado', {from: usuario.name, mensaje});
    }else{
      chatMensajes.enviarMensaje(usuario.id, usuario.name, mensaje);
      io.emit('recibir-mensajes', chatMensajes.ultimos); // emitimos lo ultimos 10 mensajes
    }

  })

};

module.exports = {
  socketController,
};
