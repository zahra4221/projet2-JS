let form = document.getElementById("login");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let user = {
    email: email,
    password: password,
  };
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(function (resp) {
      if (resp.token) {
        window.localStorage.setItem("userid", JSON.stringify(resp));
        document.location.href = "./index.html";
      } else if (resp.message) {
        alert("email incorrect");
      } else {
        alert("Mot de passe incorrect");
      }
    });
});
