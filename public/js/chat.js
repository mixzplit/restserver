var url = window.location.hostname.includes("localhost")
  ? "http://localhost:8081/api/auth/"
  : "https://restserver-magictipi.herokuapp.com/api/auth/";

let usuario = null
let socket = null


// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');


// Agregar Listenes al campo de txtMensaje y desde aqui
// mandamos el mensaje, lo emitimos
txtMensaje.addEventListener('keyup', ({keyCode}) => {
  console.log(keyCode);
  const mensaje =  txtMensaje.value;
  const uid =  txtUid.value;

  if(keyCode !== 13){ return; }
  if(mensaje.length === 0) { return; }
  socket.emit("enviar-mensaje", {mensaje, uid});
  txtMensaje.value = ''; //Limpiamos el campo despues de enviar el mensaje


});

// Validar Token LocalStorage
const validarJWT = async() => {
  const token = localStorage.getItem('token') || '';
  

  if(token.length <= 10){
    window.location = 'index.html';
    throw new Error('No hay token generado');
  }

  const resp = fetch( url, {
    headers: { 'x-token': token}
  })

  const {usuario: userDB, token: tokenDB} = await (await resp).json();
  console.log(userDB, tokenDB);
  //Si queremos renovar el token seteamos el nuevo valor en el localStorage
  localStorage.setItem('token', tokenDB);
  // Informacion del usuario
  usuario = userDB;
  document.title = usuario.name;

  await conectarSocket();

}

const main = async () => {
  await validarJWT();
}

main();


const conectarSocket = async() => {
  socket = io({
    'extraHeaders': {
      'x-token': localStorage.getItem('token')
    }
  });

  // Offline / Online
  socket.on('connect', () => {
    console.log('Sockets online');
  })
  socket.on('disconnect', () => {
    console.log('Sockts offline');
  })  
  //Recibir mensajes
  socket.on('recibir-mensajes', (payload) => {
    dibujarMensajes(payload);
  });

  socket.on('usuarios-activos', (payload) => {
    dibujarUsuarios(payload);
  });

  socket.on('mensaje-privado', (payload) => {
    console.log("Mensaje Privado: ", payload);
  });
}

const dibujarUsuarios = (usuarios = []) => {
  let usersHtml = ''
  usuarios.forEach(({name, uid}) => {
    usersHtml += `
      <li>
          <p>
              <h5 class="text-success">${name}</h5>
              <span class="fs-6 text-muter">${uid}</span>
          </p>
      </li>
    `;
  });

  ulUsuarios.innerHTML = usersHtml;
}


const dibujarMensajes = (mensajes = []) => {
  let msgsHtml = ''
  mensajes.forEach(({mensaje, nombre, uid}) => {
    msgsHtml += `
      <li>
          <p>
              <span class="text-success">${nombre}:</span>
              <span class="fs-6 text-muter">${mensaje}</span>
          </p>
      </li>
    `;
  });

  ulMensajes.innerHTML = msgsHtml;
}
