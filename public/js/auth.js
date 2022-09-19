const miFormulario = document.querySelector("form");

var url = window.location.hostname.includes("localhost")
  ? "http://localhost:8081/api/auth/"
  : "https://restserver-magictipi.herokuapp.com/api/auth/";

//Evento
miFormulario.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const formData = {};

  for (let el of miFormulario.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value;
    }

    fetch(`${url}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    .then(resp => resp.json())
    .then(({msg, token}) => {
      console.log(token);
      if(msg !== 'Login ok'){
        return console.error(msg)
      }

      localStorage.setItem('token', token)
      window.location = 'chat.html';
    })
    .then(err => {
      console.log(err);
    })
  }
});

function handleCredentialResponse(response) {
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.
  //const responsePayload = decodeJwtResponse(response.credential);

  // TOKEN ID
  const body = {
    id_token: response.credential,
  };

  fetch(`${url}google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then(({ token }) => {
      console.log(token);
      localStorage.setItem("token", token);
      window.location = 'chat.html';
    })
    .catch(console.warn);

  const button = document.getElementById("google_signout");
  button.onclick = () => {
    console.log("aqui");
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
      localStorage.clear();
      location.reload();
    });
  };
}
