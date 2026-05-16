# Fiche pédagogique — `card.jsx`

## Ce que fait ce fichier

`Card` est un **composant React** : une fonction qui reçoit des données et retourne du JSX (du HTML dynamique).
Il affiche une borne wifi sous forme de carte, avec un bouton pour révéler ou masquer les détails.

---

## Le fichier complet

```jsx
import { useState } from "react";

function Card({ result }) {
  const [displayDetails, setDisplayDetails] = useState(false);

  return (
    <div className="card">
      <div className="card-title">{result.site}</div>

      {displayDetails && (
        <div className="details">
          <p>
            {result.adresse}
            <br />
            {result.code_postal} - {result.commune}
          </p>
        </div>
      )}

      <button
        onClick={() => setDisplayDetails(!displayDetails)}
        className="btn"
      >
        {displayDetails ? "Voir moins" : "Voir plus"}
      </button>
    </div>
  );
}

export default Card;
```

---

## Décorticage ligne par ligne

### 1. L'import

```jsx
import { useState } from "react";
```

On importe `useState` depuis la bibliothèque React.
`useState` est un **hook** : une fonction spéciale qui permet à un composant de mémoriser une valeur entre chaque affichage.

> **Règle** : tout hook doit être importé avant d'être utilisé.

---

### 2. La déclaration du composant et sa prop

```jsx
function Card({ result }) {}
```

- `Card` est une fonction JavaScript classique — c'est tout ce qu'est un composant React.
- `{ result }` est une **prop** (abréviation de _property_) : une donnée transmise par le composant parent.
- La destructuration `{ result }` est équivalente à écrire `props.result` — c'est juste plus court.

Le parent appellera ce composant ainsi :

```jsx
<Card result={uneBorne} />
```

---

### 3. L'état local avec `useState`

```jsx
const [displayDetails, setDisplayDetails] = useState(false);
```

Cette ligne crée un **état local** au composant. Elle retourne toujours un tableau de deux éléments :

| Élément             | Rôle                               | Valeur initiale |
| ------------------- | ---------------------------------- | --------------- |
| `displayDetails`    | La valeur actuelle                 | `false`         |
| `setDisplayDetails` | La fonction pour changer la valeur | —               |

> **Règle importante** : on ne modifie **jamais** `displayDetails` directement.
> On passe toujours par `setDisplayDetails()`, sinon React ne sait pas que l'état a changé et ne met pas à jour l'affichage.

---

### 4. Le return — ce que le composant affiche

```jsx
return <div className="card">...</div>;
```

- Un composant retourne **toujours un seul élément racine** — ici `div.card`.
- `className` remplace `class` en JSX (car `class` est un mot réservé en JavaScript).
- Les parenthèses `( )` permettent d'écrire le JSX sur plusieurs lignes.

---

### 5. Afficher une donnée de la prop

```jsx
<div className="card-title">{result.site}</div>
```

Les accolades `{ }` permettent d'insérer une expression JavaScript dans le JSX.
Ici on affiche la propriété `site` de l'objet `result`.

---

### 6. L'affichage conditionnel

```jsx
{
  displayDetails && (
    <div className="details">
      <p>
        {result.adresse}
        <br />
        {result.code_postal} - {result.commune}
      </p>
    </div>
  );
}
```

L'opérateur `&&` signifie **"si... alors affiche"** :

- Si `displayDetails` est `false` → rien n'est affiché
- Si `displayDetails` est `true` → le `div.details` est affiché

C'est l'équivalent React de `classList.toggle("hidden")` en vanilla JS — sauf qu'ici on ne touche pas au DOM, on change l'état et React met à jour l'affichage tout seul.

---

### 7. Le bouton et l'événement

```jsx
<button onClick={() => setDisplayDetails(!displayDetails)} className="btn">
  {displayDetails ? "Voir moins" : "Voir plus"}
</button>
```

**Le `onClick`** :

```jsx
onClick={() => setDisplayDetails(!displayDetails)}
```

- `onClick` attend une **fonction** (pas un appel de fonction directe)
- `() =>` crée une fonction anonyme exécutée au clic
- `!displayDetails` inverse le booléen : `false` devient `true`, et vice versa

**Le texte conditionnel** avec l'opérateur ternaire :

```jsx
{
  displayDetails ? "Voir moins" : "Voir plus";
}
//   condition   ? si vrai      : si faux
```

---

### 8. L'export

```jsx
export default Card;
```

Rend le composant disponible pour les autres fichiers.
Un autre fichier pourra alors l'importer :

```jsx
import Card from "./card.jsx";
```

---

## Comparaison vanilla JS → React

| Vanilla JS                             | React                                      |
| -------------------------------------- | ------------------------------------------ |
| `document.createElement("div")`        | JSX : `<div>` dans le `return`             |
| `element.classList.toggle("hidden")`   | `{condition && <div>}`                     |
| `button.textContent = "Voir plus"`     | `{condition ? "Voir moins" : "Voir plus"}` |
| `button.addEventListener("click", fn)` | `onClick={fn}`                             |
| Variable globale modifiable            | `useState` + setter                        |

---

## Les concepts clés à retenir

| Concept                    | Définition courte                     |
| -------------------------- | ------------------------------------- |
| **Composant**              | Fonction JS qui retourne du JSX       |
| **Prop**                   | Donnée transmise par le parent        |
| **JSX**                    | Syntaxe HTML dans du JavaScript       |
| **useState**               | Hook pour mémoriser un état local     |
| **Affichage conditionnel** | `{condition && <élément>}`            |
| **Opérateur ternaire**     | `{condition ? "si vrai" : "si faux"}` |
| **export default**         | Rend le composant importable          |
