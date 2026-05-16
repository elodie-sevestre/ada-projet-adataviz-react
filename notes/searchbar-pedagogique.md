# Fiche pédagogique — `SearchBar.jsx`

## Ce que fait ce fichier

`SearchBar` est un composant React qui affiche un champ de recherche et un bouton.
Il gère la saisie de l'utilisateur en local, puis **remonte** la valeur à son composant parent (`App`) quand la recherche est déclenchée.

---

## Le fichier complet

```jsx
import { useState } from "react";

function SearchBar({ onSearch }) {
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

export default SearchBar;
```

---

## Décorticage ligne par ligne

### 1. La prop `onSearch`

```jsx
function SearchBar({ onSearch }) {
```

`onSearch` est une **fonction** passée par le parent (`App`).
`SearchBar` ne sait pas ce que fait cette fonction — il l'appelle juste quand l'utilisateur lance une recherche.

Le parent l'utilisera ainsi :
```jsx
<SearchBar onSearch={handleSearch} />
```

> **Principe clé** : un composant enfant ne peut pas modifier l'état de son parent directement.
> Il doit **remonter** la valeur via une fonction passée en prop.
> C'est ce qu'on appelle le flux de données **unidirectionnel** en React.

---

### 2. L'input contrôlé

```jsx
const [inputValue, setInputValue] = useState("");

<input
  value={inputValue}
  onChange={(event) => setInputValue(event.target.value)}
/>
```

En React, un input est dit **contrôlé** quand sa valeur est liée à un état :

| Attribut | Rôle |
|---|---|
| `value={inputValue}` | Ce que l'input affiche = l'état |
| `onChange={...}` | Met à jour l'état à chaque frappe |

Sans `onChange`, l'input serait en lecture seule — l'utilisateur ne pourrait pas taper.

`event.target.value` c'est la valeur actuelle du champ de saisie, accessible via l'événement natif du navigateur.

> **Comparaison vanilla JS** :
> ```js
> // Vanilla — on lit la valeur au moment du clic
> const valeur = input.value;
>
> // React — la valeur est toujours synchronisée avec l'état
> const [inputValue, setInputValue] = useState("");
> ```

---

### 3. La touche Entrée avec `onKeyDown`

```jsx
onKeyDown={(event) => {
  if (event.key === "Enter") {
    onSearch(inputValue);
    setInputValue("");
  }
}}
```

`onKeyDown` se déclenche à chaque appui de touche.
On vérifie si la touche est `"Enter"` avant d'agir.

Quand c'est le cas, on fait deux choses :
1. `onSearch(inputValue)` — remonte la valeur à `App`
2. `setInputValue("")` — vide le champ après la recherche

---

### 4. Le bouton avec `onClick`

```jsx
<button
  onClick={() => {
    onSearch(inputValue);
    setInputValue("");
  }}
>
  Rechercher
</button>
```

Le `onClick` fait exactement la même chose que `onKeyDown` avec `"Enter"` — c'est intentionnel : les deux chemins mènent au même résultat.

Quand il y a **plusieurs instructions** dans un `onClick`, on utilise un bloc avec accolades `{ }` :

```jsx
// ✅ Une instruction → pas besoin d'accolades
onClick={() => onSearch(inputValue)}

// ✅ Plusieurs instructions → accolades obligatoires
onClick={() => {
  onSearch(inputValue);
  setInputValue("");
}}
```

---

## Le flux de données — schéma

```
App
  │  possède : query, hotspots, offset...
  │  définit : handleSearch(valeur) → met à jour query → refetch
  │
  └── SearchBar
        │  reçoit : onSearch={handleSearch}
        │  possède : inputValue (état local)
        │
        └── utilisateur tape → onChange met à jour inputValue
            utilisateur clique / appuie Entrée → onSearch(inputValue) remonte la valeur à App
```

---

## Comparaison vanilla JS → React

| Vanilla JS | React |
|---|---|
| `document.getElementById("search-input")` | `const [inputValue, setInputValue] = useState("")` |
| `input.value` lu au moment du clic | `inputValue` toujours synchronisé avec l'état |
| `input.value = ""` pour vider | `setInputValue("")` |
| `searchInput.addEventListener("keydown", ...)` | `onKeyDown={(event) => ...}` |
| `searchButton.addEventListener("click", ...)` | `onClick={() => ...}` |
| État global dans `state.js` | Remontée via prop `onSearch` |

---

## Les concepts clés à retenir

| Concept | Définition courte |
|---|---|
| **Flux unidirectionnel** | Les données descendent via les props, remontent via des fonctions |
| **Input contrôlé** | La valeur de l'input est liée à un état React |
| **event.target.value** | La valeur actuelle d'un champ de saisie |
| **onKeyDown** | Événement déclenché à chaque appui de touche |
| **Bloc de fonction** | `() => { ... }` quand il y a plusieurs instructions |
| **Remonter une valeur** | Appeler une fonction prop passée par le parent |
