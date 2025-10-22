document.addEventListener('DOMContentLoaded', () => {
    const formulaire = document.getElementById('adoptionForm');

    const champs = [
        {
            id: 'nom', erreur: 'nomError', etiquette: 'Nom',
            règles: [
                { test: v => v.trim().length > 0, message: 'Le nom est obligatoire.' },
                { test: v => v.trim().length >= 3, message: 'Le nom doit contenir au moins 3 caractères.' },
                { test: v => v.trim().length <= 20, message: 'Le nom ne peut pas dépasser 20 caractères.' },
                { test: v => !/[0-9]/.test(v), message: 'Le nom ne doit pas contenir de chiffres.' },
                { test: v => !/,/.test(v), message: 'Le nom ne doit pas contenir de virgule.' }
            ]
        },
        {
            id: 'espece', erreur: 'especeError', etiquette: 'Espèce',
            règles: [
                { test: v => v.trim().length > 0, message: 'L\'espèce est obligatoire.' },
                { test: v => !/[0-9]/.test(v), message: 'L\'espèce ne doit pas contenir de chiffres.' },
                { test: v => !/,/.test(v), message: 'L\'espèce ne doit pas contenir de virgule.' }
            ]
        },
        {
            id: 'race', erreur: 'raceError', etiquette: 'Race',
            règles: [
                { test: v => v.trim().length > 0, message: 'La race est obligatoire.' },
                { test: v => !/[0-9]/.test(v), message: 'La race ne doit pas contenir de chiffres.' },
                { test: v => !/,/.test(v), message: 'La race ne doit pas contenir de virgule.' }
            ]
        },
        {
            id: 'age', erreur: 'ageError', etiquette: 'Âge',
            règles: [
                { test: v => v.trim().length > 0, message: 'L\'âge est obligatoire.' },
                { test: v => !isNaN(v) && Number.isInteger(Number(v)), message: 'L\'âge doit être un entier.' },
                { test: v => Number(v) >= 0 && Number(v) <= 30, message: 'L\'âge doit être compris entre 0 et 30 ans.' }
            ]
        },
        {
            id: 'description', erreur: 'descriptionError', etiquette: 'Description',
            règles: [
                { test: v => v.trim().length > 0, message: 'La description est obligatoire.' },
                { test: v => !/,/.test(v), message: 'La description ne doit pas contenir de virgule.' }
            ]
        },
        {
            id: 'courriel', erreur: 'courrielError', etiquette: 'Courriel',
            règles: [
                { test: v => v.trim().length > 0, message: 'Le courriel est obligatoire.' },
                { test: v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), message: 'Format de courriel invalide.' }
            ]
        },
        {
            id: 'adresse', erreur: 'adresseError', etiquette: 'Adresse',
            règles: [
                { test: v => v.trim().length > 0, message: 'L\'adresse est obligatoire.' },
                { test: v => !/,/.test(v), message: 'L\'adresse ne doit pas contenir de virgule.' }
            ]
        },
        {
            id: 'ville', erreur: 'villeError', etiquette: 'Ville',
            règles: [
                { test: v => v.trim().length > 0, message: 'La ville est obligatoire.' },
                { test: v => !/,/.test(v), message: 'La ville ne doit pas contenir de virgule.' }
            ]
        },
        {
            id: 'cp', erreur: 'cpError', etiquette: 'Code postal',
            règles: [
                { test: v => v.trim().length > 0, message: 'Le code postal est obligatoire.' },
                { test: v => /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(v), message: 'Le code postal doit être au format A1A 1A1.' }
            ]
        }
    ];

    formulaire.addEventListener('submit', (event) => {
        let estValide = true;

        champs.forEach(champ => {
            const champDOM = document.getElementById(champ.id);
            const erreurDOM = document.getElementById(champ.erreur);
            const valeur = champDOM.value;

            for (const règle of champ.règles) {
                if (!règle.test(valeur)) {
                    erreurDOM.textContent = règle.message;
                    estValide = false;
                    break;
                } else {
                    erreurDOM.textContent = '';
                }
            }
        });

        if (!estValide) {
            event.preventDefault();
        }
    });

    champs.forEach(champ => {
        const champDOM = document.getElementById(champ.id);
        const erreurDOM = document.getElementById(champ.erreur);

        champDOM.addEventListener('input', () => {
            erreurDOM.textContent = '';
        });
    });
});