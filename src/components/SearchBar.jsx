// ===================================== SearchBar.jsx ====================================

// Responsabilité : affiche un champ de recherche et un bouton
// Gère saisie user en local, puis remonte la valeur à App() qd recherche est déclenchée

// ---- IMPORT ----------------------------------------------------------------------------

import { useState } from "react";

// ---- COMPONENT -------------------------------------------------------------------------

// onSearch est une fct passée par le parent App()
// SearchBar ne sait pas ce que fait cette fonction : il l'appelle juste quand l'utilisateur lance une recherche
//! **Principe clé** : un composant enfant ne peut pas modifier l'état de son parent directement. Il doit remonter la valeur via une fonction passée en prop => flux de données unidirectionnel

function SearchBar({ onSearch }) {
  // input contrôlé : quand sa valeur est liée à un état
  // value={inputValue} : ce que l'input affiche = l'état
  // onChange={...} : met à jour l'état à chaque frappe
  // Sans onChange, l'input serait en lecture seule : l'utilisateur ne pourrait pas taper
  // event.target.value : valeur actuelle du champ de saisie, accessible via l'événement natif du navigateur

  // comparaison vanilla js
  // const valeur = input.value

  // React : la valeur est toujours synchronisée avec l'état
  const [inputValue, setInputValue] = useState("");
  return (
    <section id="search-zone">
      <input
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSearch(inputValue);
            setInputValue("");
          }
        }}
      />
      <button
        onClick={() => {
          onSearch(inputValue);
          setInputValue("");
        }}
      >
        Rechercher
      </button>
    </section>
  );
}

// ---- EXPORT ----------------------------------------------------------------------------

export default SearchBar;
