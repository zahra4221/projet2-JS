/* ajout gallery*/

const response = await fetch("http://localhost:5678/api/works");
const workList = await response.json();

const categorySet = new Set();
categorySet.add("Tous");

generorWork(workList);

function generorWork(workList) {
  for (let i = 0; i < workList.length; i++) {
    const worksElement = document.createElement("article");
    const gallery = workList[i];
    const sectionGallery = document.querySelector(".gallery");
    const imageElement = document.createElement("img");
    imageElement.src = gallery.imageUrl;
    imageElement.crossOrigin = "anonymous";
    const titreElement = document.createElement("p");
    titreElement.innerText = gallery.title;
    imageElement.alt = gallery.title;
    /*rattachement*/
    sectionGallery.appendChild(worksElement);
    worksElement.appendChild(imageElement);
    worksElement.appendChild(titreElement);
    categorySet.add(gallery.category.name);
  }
}

//filtres

for (let filtresTypes of categorySet) {
  const filtres = document.createElement("div");
  const sectionFiltres = document.querySelector(".filtres");
  const boutonFiltres = document.createElement("p");
  boutonFiltres.id = filtresTypes;
  boutonFiltres.innerText = filtresTypes;
  sectionFiltres.appendChild(filtres);
  filtres.appendChild(boutonFiltres);
  document.getElementById(filtresTypes).addEventListener("click", function () {
    const tableau = [];
    document.querySelector(".gallery").innerHTML = "";
    let filtresId = document.getElementById(filtresTypes).id;
    for (let i = 0; i < workList.length; i++) {
      if (filtresId == workList[i].category.name) {
        tableau.push(workList[i]);
      } else if (filtresId == "Tous") {
        tableau.push(workList[i]);
      }
    }
    generorWork(tableau);
  });
}

//login-logout
let userId = localStorage.getItem("userId")
  ? JSON.parse(localStorage.getItem("userId"))
  : "";
