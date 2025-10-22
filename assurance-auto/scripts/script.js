window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-box");
  form.reset();

  const btnReset = document.getElementById("reset-btn");
  btnReset.addEventListener("click", () => {
    form.reset();
    zoneMontants.innerHTML = "";
    resultatAssurance.innerHTML = "";
  });

  const genreSelect      = document.getElementById("genre");
  const dateNaissance    = document.getElementById("date-naissance");
  const valeurVehicule   = document.getElementById("vehicule-valeur");
  const anneeVehicule    = document.getElementById("vehicule-annee");
  const kmParAn          = document.getElementById("vehicule-km");
  const cameraOui        = document.getElementById("vehicule-camera-oui");
  const cameraNon        = document.getElementById("vehicule-camera-non");
  const reclamationsOui  = document.getElementById("reclamations-oui");
  const reclamationsNon  = document.getElementById("reclamations-non");
  const nombreReclamations = document.getElementById("nombre-reclamations");
  const zoneMontants       = document.getElementById("zone-montants");
  const resultatAssurance  = document.getElementById("resultat-assurance");

  function gererAffichageReclamations() {
    if (reclamationsOui.checked) {
      nombreReclamations.parentElement.style.display = "block";
    } else {
      nombreReclamations.parentElement.style.display = "none";
      zoneMontants.innerHTML = "";
    }
    verifierAdmissibilite();
  }
  reclamationsOui.addEventListener("change", gererAffichageReclamations);
  reclamationsNon.addEventListener("change", gererAffichageReclamations);

  nombreReclamations.addEventListener("change", () => {
    zoneMontants.innerHTML = "";
    const nb = parseInt(nombreReclamations.value);
    if (!isNaN(nb) && nb > 0) {
      for (let i = 1; i <= nb; i++) {
        const label = document.createElement("label");
        label.textContent = `Montant de la réclamation #${i}: `;
        const input = document.createElement("input");
        input.type = "number";
        input.id = `reclamation-montant-${i}`;
        input.name = `reclamation-montant-${i}`;
        input.required = true;
        input.addEventListener("change", verifierAdmissibilite);
        label.appendChild(input);
        zoneMontants.appendChild(label);
        zoneMontants.appendChild(document.createElement("br"));
      }
    }
    verifierAdmissibilite();
  });

  function verifierAdmissibilite() {
    let messageExclusion = null;
    let genre = genreSelect.value || null;  
    let age   = null;

    if (genre && dateNaissance.value) {
      const dateN = new Date(dateNaissance.value + "T00:00:00");
      if (!isNaN(dateN.getTime())) {
        const now = new Date();
        age = now.getFullYear() - dateN.getFullYear();
        const mo = now.getMonth() - dateN.getMonth();
        if (mo < 0 || (mo === 0 && now.getDate() < dateN.getDate())) {
          age--;
        }
        if (genre === "femme" && age < 16) {
          messageExclusion = "Désolé, nous n’assurons pas les femmes de moins de 16 ans.";
        } else if (genre === "homme" && age < 18) {
          messageExclusion = "Désolé, nous n’assurons pas les hommes de moins de 18 ans.";
        } else if (genre === "non-binaire" && age < 18) {
          messageExclusion = "Désolé, nous n’assurons pas les personnes non-binaires de moins de 18 ans.";
        } else if (age >= 100) {
          messageExclusion = "Désolé, nous n’assurons pas les personnes de 100 ans ou plus.";
        }
      }
      else {
        messageExclusion = "Date de naissance invalide.";
      }
    }

    let ageVehicule = null;
if (anneeVehicule.value) {
  const fabDate = new Date(anneeVehicule.value + "T00:00:00");
  if (!isNaN(fabDate.getTime())) {
    const now = new Date();
    ageVehicule = now.getFullYear() - fabDate.getFullYear();
    if (ageVehicule > 25) {
      messageExclusion = "Désolé, nous n’assurons pas un véhicule de plus de 25 ans.";
    }
  }
}

let valeur = null;
if (valeurVehicule.value) {
  valeur = parseFloat(valeurVehicule.value);
  if (!isNaN(valeur) && valeur > 100000) {
    messageExclusion = "Désolé, nous n’assurons pas un véhicule qui vaut plus de 100 000$.";
  }
}

let nbRecl = 0;
let sumRecl = 0;
if (reclamationsOui.checked) {
  if (nombreReclamations.value) {
    nbRecl = parseInt(nombreReclamations.value) || 0;
    if (nbRecl > 4) {
      messageExclusion = "Désolé, nous n’assurons pas une personne avec plus de 4 réclamations.";
    }
    for (let i = 1; i <= nbRecl; i++) {
      const inp = document.getElementById(`reclamation-montant-${i}`);
      if (inp) {
        const valMontant = parseFloat(inp.value) || 0;
        sumRecl += valMontant;
      }
    }
    if (sumRecl > 35000) {
      messageExclusion = "Désolé, nous n’assurons pas une personne avec plus de 35 000$ en réclamations.";
    }
  }
}

let km = null;
if (kmParAn.value) {
  km = parseFloat(kmParAn.value);
  if (!isNaN(km) && km > 50000) {
    messageExclusion = "Désolé, nous n’assurons pas une personne qui parcourt plus de 50 000 km/an.";
  }
}

let camera = null;
if (cameraOui.checked) camera = true;
else if (cameraNon.checked) camera = false;
if (camera === false) {
  messageExclusion = "Désolé, nous n’assurons pas un véhicule sans caméra de recul.";
}

if (messageExclusion) {
  afficheMessage(messageExclusion, "red");
  return false;
}

if (
  !genre ||
  !dateNaissance.value ||
  !valeurVehicule.value ||
  !anneeVehicule.value ||
  !kmParAn.value ||
  camera === null
) {
  afficheMessage("Veuillez compléter tous les champs pour obtenir un calcul final.", "orange");
  return false;
}

if (reclamationsOui.checked && !nombreReclamations.value) {
  afficheMessage("Veuillez indiquer le nombre de réclamations.", "orange");
  return false;
}

const dateN = new Date(dateNaissance.value + "T00:00:00");
if (isNaN(dateN.getTime())) {
  afficheMessage("Date de naissance invalide.", "orange");
  return false;
}

const fabDate = new Date(anneeVehicule.value + "T00:00:00");
if (isNaN(fabDate.getTime())) {
  afficheMessage("Année de fabrication invalide.", "orange");
  return false;
}

valeur = parseFloat(valeurVehicule.value) || 0;
km = parseFloat(kmParAn.value) || 0;

let age2 = new Date().getFullYear() - dateN.getFullYear();
let mo2 = new Date().getMonth() - dateN.getMonth();
if (mo2 < 0 || (mo2 === 0 && new Date().getDate() < dateN.getDate())) {
  age2--;
}

const ageVeh2 = new Date().getFullYear() - fabDate.getFullYear();
let pourcentageBase = 0.015;
if ((genre === "homme" || genre === "non-binaire") && age2 < 25) {
  pourcentageBase = 0.05;
} else if (age2 >= 75) {
  pourcentageBase = 0.04;
}

const montantBase = valeur * pourcentageBase;
const supplReclam = 350 * nbRecl;
const supplKm = 0.02 * km;
let total = montantBase + supplReclam + supplKm;

if (sumRecl > 25000) {
  total += 700;
}

const primeAnnuelle = total;
const primeMensuelle = primeAnnuelle / 12;

afficheMessage(
  `<strong>Félicitations !</strong> Vous êtes assurable.<br>
   Montant annuel : ${primeAnnuelle.toFixed(2)} $<br>
   Montant mensuel : ${primeMensuelle.toFixed(2)} $`,
  "green"
);
return true;

  }

  function afficheMessage(msg, color) {
    resultatAssurance.style.color = color;
    resultatAssurance.innerHTML   = msg;
  }

  function exclure(msg) {
    afficheMessage(`<strong>${msg}</strong>`, "red");
  }

  genreSelect.addEventListener("change", verifierAdmissibilite);
  dateNaissance.addEventListener("change", verifierAdmissibilite);
  valeurVehicule.addEventListener("change", verifierAdmissibilite);
  anneeVehicule.addEventListener("change", verifierAdmissibilite);
  kmParAn.addEventListener("change", verifierAdmissibilite);
  cameraOui.addEventListener("change", verifierAdmissibilite);
  cameraNon.addEventListener("change", verifierAdmissibilite);
  reclamationsOui.addEventListener("change", verifierAdmissibilite);
  reclamationsNon.addEventListener("change", verifierAdmissibilite);
  nombreReclamations.addEventListener("change", verifierAdmissibilite);

});
