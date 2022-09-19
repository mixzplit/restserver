const Mensaje = require("./mensaje");

class ChatMensajes {
  constructor() {
    this.mensajes = [];
    this.usuarios = {};
  }

  get ultimos() {
    this.mensajes = this.mensajes.splice(0, 10); //Ultimos 10 mensajes
    return this.mensajes;
  }

  get usuariosArr() {
    return Object.values(this.usuarios); // obtenemos todos los valores que tenga usuarios y return un ARRAY
  }

  enviarMensaje(uid, nombre, mensaje) {
    this.mensajes.unshift(new Mensaje(uid, nombre, mensaje));
  }

  conectarUsuario(usuario) {
    this.usuarios[usuario.id] = usuario;
  }

  desconectarUsuario(id) {
    delete this.usuarios[id];
  }
}

module.exports = ChatMensajes;
