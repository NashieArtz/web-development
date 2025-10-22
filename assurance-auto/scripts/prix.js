function toggleDropdown(dropdownTitle) {
    // On récupère l'élément suivant (nextElementSibling),
    // censé être <div class="dropdown-prix-content"> dans ton HTML.
    const content = dropdownTitle.nextElementSibling;
  
    // Vérifie si on a bien un .dropdown-prix-content juste après
    if (content && content.classList.contains('dropdown-prix-content')) {
      // Bascule la classe .show pour afficher/masquer
      content.classList.toggle('show');
  
      // Bascule la classe .active sur le bloc cliqué,
      // afin de faire pivoter la flèche (▼) en CSS.
      dropdownTitle.classList.toggle('active');
    }
  }