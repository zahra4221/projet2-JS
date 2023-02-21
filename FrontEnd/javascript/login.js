let form = document.getElementById("loginForm");
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
    .then(function (res) {
      if (res.token) {
        window.localStorage.setItem("userId", JSON.stringify(res));
        document.location.href = "./index.html";
      } else if (res.message) {
        alert("email incorrect");
      } else {
        alert("Mot de passe incorrect");
      }
    });
});
