// ======================================= Card.jsx =======================================

// Responsabilité : affiche une borne wifi sous forme de carte

// ---- IMPORT ----------------------------------------------------------------------------

import { useState } from "react"; // useState est un hook

// ---- COMPONENT -------------------------------------------------------------------------

// Card(Prop) est un composant enfant et Prop est la donnée transmise par le parent
// Il sera appelé par le parent <Card result={hotspot}/> ds App()

function Card({ result }) {
  // état local qui retourne tableau avec deux éléments
  // displayDetails : valeur actuelle = false
  // setDisplayDetails : fct pr changer la valeur
  //! on utilise TJS la fct pr modifier la valeur

  const [displayDetails, setDisplayDetails] = useState(false);

  // un composant retourne tjs un seul élémt racine : ici div.card
  // () permet d'écrire le JSX sur +s lignes

  return (
    <div className="card">
      {/* {} : permet d'insérer une expression JS ds JSX
      ici on affiche ppté 'site' de l'objet 'result' */}

      <div className="card-title">{result.site}</div>

      {/* affichage conditionnel
      && : signifie "si... alors affiche"
      Si displayDetails = false : rien ne s'affiche
      Si displayDetails = true : 'div.details' s'affiche
      équivalent de 'classList.toggle("hidden")' en vanilla JS
      */}

      {displayDetails && (
        // ... || "" valeurs par défaut
        <div className="details">
          <p>
            {result.adresse || "Adresse inconnue"}
            <br />
            {result.code_postal || "—"} - {result.commune || "Commune inconnue"}
          </p>
        </div>
      )}

      {/* onClick attend une fct (pas un appel direct)
      () => crée une fct anonyme exécutée au clic
      !displayDetails inverse booléen "false" en "true" */}

      <button
        onClick={() => setDisplayDetails(!displayDetails)}
        className="btn"
      >
        {/* texte conditionnel du bouton avec opérateur ternaire
        condition . si vrai : si faux */}
        {displayDetails ? "Voir moins" : "Voir plus"}
      </button>
    </div>
  );
}

// ---- EXPORT ----------------------------------------------------------------------------

// rend composant enfant dispo pr les autres fichiers

export default Card;
