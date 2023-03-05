// on récupère les éléments du DOM
let gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filtres");

// on récupère les catégories depuis l'API
fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {
    // on crée un bouton pour chaque catégorie
    categories.forEach((category) => {
      const filterButton = document.createElement("button");
      filterButton.textContent = category.name;
      filterButton.classList.add("filter-button");
      filterButton.setAttribute("data-category-id", category.id);
      // on ajoute un évenement click pour chaque bouton
      filterButton.addEventListener("click", (event) => {
        const categoryId = event.target.getAttribute("data-category-id");
        // on filtre les travaux en fonction de la catégorie sélectionnée
        const filteredWorks = data.filter(
          (work) => work.categoryId == categoryId
        );
        // on supprime les travaux affichés qui ne correspondent pas
        removeWorks();
        //  et on affiche les travaux filtrés
        filteredWorks.forEach((work) => {
          const workElement = createWorkElement(work);
          gallery.appendChild(workElement);
        });
      });
      filters.appendChild(filterButton);
    });

    const allButton = document.querySelector(".buttonTous");
    //on ajoute un évenement click pour le bouton "Tous"
    allButton.addEventListener("click", () => {
      removeWorks();
      data.forEach((work) => {
        const workElement = createWorkElement(work);
        gallery.appendChild(workElement);
      });
    });
  })
  .catch((error) => console.log(error));

// on récupère les travaux depuis l'API
let data;
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((works) => {
    data = works;
    // on affiche tous les travaux par défaut
    data.forEach((work) => {
      const workElement = createWorkElement(work);
      gallery.appendChild(workElement);
    });
  })
  .catch((error) => console.log(error));

// on crée l'élément HTML pour les images
function createWorkElement(work) {
  const workElement = document.createElement("div");
  workElement.classList.add("work");

  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;
  imageElement.alt = work.title;
  workElement.appendChild(imageElement);

  const titleElement = document.createElement("h3");
  titleElement.textContent = work.title;
  workElement.appendChild(titleElement);

  return workElement;
}
// Suppression des travaux affichés selon le click
function removeWorks() {
  while (gallery.firstChild) {
    gallery.removeChild(gallery.firstChild);
  }
}
//login-logout

// Récupération des données utilisateur dans le localStorage
let userId = localStorage.getItem("userId")
  ? JSON.parse(localStorage.getItem("userId"))
  : "";

//  on récupère les éléments du DOM
let hidden = document.querySelectorAll(".hidden");
let modeEdition = document.getElementById("modeEdition");
let connecter = document.getElementById("connecter");
let logout = document.getElementById("logout");

// on vérifie si l'utilisateur est connecté
if (userId.token) {
  hidden.forEach(function (info) {
    info.style.visibility = "visible";
  });
  connecter.style.display = "none";
  modeEdition.style.display = "flex";
} else {
  console.log("vous n'etes pas connectés");
}

// on crée un événement "click" sur le bouton "logout" afin de demander confirmation avant la déconnexion
logout.addEventListener("click", function () {
  if (confirm("Voulez-vous vous déconnecter?")) {
    // Suppression des données utilisateur du localStorage et rechargement de la page
    localStorage.removeItem("userId");
    location.reload();
    localStorage.clear();
  }
});

//modale
//on récupère les éléments du DOM
let openModal = document.querySelectorAll(".openModal");
let modale = document.querySelector(".modale");
let closeButton = document.querySelectorAll(".closeButton");
let fenetreModale = document.querySelector(".fenetreModale");

// boucle afin de pouvoir enlever le mode caché de la modale si click
for (let i = 0; i < openModal.length; i++) {
  openModal[i].addEventListener("click", () => {
    modale.classList.remove("hidden");
  });
}
// boucle afin de pouvoir remettre le mode caché de la modale si click
for (let i = 0; i < closeButton.length; i++) {
  closeButton[i].addEventListener("click", () => {
    modale.classList.add("hidden");
  });
}

//on ajoute un événement "click" sur la fenêtre modale pour que l'ombre sur autour de la modale disparaisse quand on ferme
fenetreModale.addEventListener("click", () => {
  modale.classList.add("hidden");
});

// on effectue une requête GET
fetch("http://localhost:5678/api/works")
  .then((res) => res.json())
  .then((modalImage) => {
    imageDisplay(modalImage);
  });

let imageDisplay = (data) => {
  data.forEach((element) => {
    NewImageModel(element);
  });

  //on récupère les éléments du DOM
  let figure = document.querySelector(".editerPhoto figure");
  //on crée un nouvel élément "div" avec la classe "arrowfleche"
  let arrowfleche = document.createElement("div");
  arrowfleche.classList.add("arrowfleche");
  arrowfleche.innerHTML =
    '<i class="fa-solid fa-arrows-up-down-left-right"></i>';
  figure.appendChild(arrowfleche);
};

//supprimer
// on fait appel à une fonction pour l'évenement clique sur la poubelle pour supprimer une photo
const OnTrashClick = (event) => {
  // On récupère l'élément parent qui a un attribut "userId"
  let parentTrash = event.target.closest("[userId]");
  //On envoie une requête DELETE à l'API pour supprimer la photo correspondante en utilisant l'ID utilisateur
  fetch(
    "http://localhost:5678/api/works/" + parentTrash.getAttribute("userId"),
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + userId.token,
      },
    }
  ).then(() => {
    //On supprime la photo de la galerie et de la modal en parcourant tous les éléments correspondants
    let galleryFigure = document.querySelectorAll(".gallery figure");
    let editerPhoto = document.querySelectorAll(".editerPhoto figure");
    for (let i = 0; i < galleryFigure.length; i++) {
      let figure = galleryFigure[i];
      if (
        figure.getAttribute("userId") === parentTrash.getAttribute("userId")
      ) {
        figure.remove();
      }
    }
    for (let i = 0; i < editerPhoto.length; i++) {
      let modalFigure = editerPhoto[i];
      if (
        modalFigure.getAttribute("userId") ===
        parentTrash.getAttribute("userId")
      ) {
        modalFigure.remove();
      }
    }
  });
};
// Cette fonction permet de créer un bouton "éditer" et un bouton de suppression( avec l'icone trash)
const NewImageModel = (datas) => {
  let figure = document.createElement("figure");
  figure.setAttribute("userId", datas.id);
  document.querySelector(".editerPhoto").appendChild(figure);
  let img = document.createElement("img");
  img.src = datas.imageUrl;
  img.crossOrigin = "anonymous";
  figure.appendChild(img);
  let figcaption = document.createElement("figcaption");
  figcaption.innerText = "éditer";
  figure.appendChild(figcaption);
  let div = document.createElement("div");
  div.classList.add("trash");
  div.addEventListener("click", OnTrashClick);
  div.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
  figure.appendChild(div);
};

//ajout
// on récupère des éléments du DOM
let galleryPhoto = document.querySelector(".galleryPhoto");
let ajoutPhoto = document.querySelector(".ajoutPhoto");
let arrowLeft = document.querySelector(".arrowLeft");

// on crée un évenement lorsqu'on clique sur le bouton d'ajout de photo
ajoutPhoto.addEventListener("click", () => {
  galleryPhoto.scrollLeft += 630; // (fait défiler la galerie de 600 pixels vers la droite)
});
arrowLeft.addEventListener("click", () => {
  galleryPhoto.scrollLeft -= 630; // fait défiler la galerie de 600 pixels vers la gauche
});

// on récupère des éléments du DOM
let boutonAjout = document.querySelector("#boutonAjout");
let ajoutImage = document.getElementById("ajoutImage");

// on cree un évenement clic lorsqu'on ajoute une image
boutonAjout.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    // // crée une URL pour l'image sélectionnée
    let src = URL.createObjectURL(e.target.files[0]);
    const previewPhoto = document.querySelector("#previewPhoto");
    //on affiche l'image sélectionnée dans la zone de prévisualisation
    previewPhoto.src = src;
    //on affiche la zone de prévisualisation
    previewPhoto.style.display = "block";
    let boutonAjouter = document.querySelector(".boutonAjout");
    boutonAjouter.style.display = "none"; // on cache le bouton d'ajout
    ajoutImage.addEventListener("submit", () => {
      src = URL.revokeObjectURL(e.target.files[0]); // on révoque l'URL de l'image sélectionnée
      previewPhoto.style.display = "none"; //on cache la zone de prévisualisation
      boutonAjouter.style.display = "block"; // on affiche le bouton d'ajout
      ajoutImage.reset(); //on réinitialise le formulaire
      galleryPhoto.scrollLeft -= 600; //on fait défiler la galerie de 600 pixels vers la gauche
    });
  }
});

// Action lorsqu'on soumet le formulaire pour ajouter une image
ajoutImage.addEventListener("submit", (e) => {
  e.preventDefault(); // empêche la page de se recharger
  let formData = new FormData(ajoutImage); // récupère les données du formulaire
  fetch("http://localhost:5678/api/works", {
    // envoie les données du formulaire au serveur
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + userId.token, // ajoute le token de l'utilisateur pour l'authentification
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      createajoutImage(data); // on crée un élément image dans la galerie
      NewImageModel(data); // on crée un modèle pour éditer l'image
    });
});

// on appelle une fonction afin de pouvoir afficher dans la galerie la photo ajoutée par la modale .
const createajoutImage = (datas) => {
  let figure = document.createElement("figure");
  figure.setAttribute("userId", datas.id);
  figure.setAttribute("boutonFiltres", datas.categoryId);
  figure.classList.add("imageElement");
  document.querySelector(".gallery").appendChild(figure);
  let img = document.createElement("img");
  img.src = datas.imageUrl;
  img.crossOrigin = "anonymous";
  figure.appendChild(img);
  let figcaption = document.createElement("figcaption");
  figcaption.innerHTML = datas.title;
  figure.appendChild(figcaption);
};
