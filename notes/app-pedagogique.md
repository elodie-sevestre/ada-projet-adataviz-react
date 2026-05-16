# Fiche pédagogique — `App.jsx`

## Ce que fait ce fichier

`App` est le composant racine de l'application. Il centralise tout l'état global, orchestre les appels API, et distribue les données aux composants enfants via les props.
C'est l'équivalent React de `state.js` + `loader.js` + `main.js` réunis.

---

## Le fichier complet

```jsx
import { useState, useEffect } from "react";
import { requestAPI, initResultToShow } from "./api.js";
import SearchBar from "./components/SearchBar.jsx";
import Card from "./components/Card.jsx";
import LoadMore from "./components/LoadMore.jsx";
import "./App.css";

function App() {
  const [hotspots, setHotspots] = useState([]);
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const displayLoadMore = offset + initResultToShow < totalCount;

  const fetchData = async (query, offset, append) => {
    const data = await requestAPI(query, offset);
    if (append) {
      setHotspots((prev) => [...prev, ...data.results]);
    } else {
      setHotspots(data.results);
    }
    setTotalCount(data.total_count);
  };

  useEffect(() => {
    fetchData(query, offset);
  }, []);

  const handleSearch = async (value) => {
    setQuery(value);
    setOffset(0);
    fetchData(value, 0);
  };

  const handleLoadMore = async () => {
    const newOffset = offset + initResultToShow;
    setOffset(newOffset);
    fetchData(query, newOffset, true);
  };

  return (
    <>
      <header className="section" id="top">
        <h1 id="app-title">Besoin de vous connecter gratuitement?</h1>
        <h6>#radins4ever</h6>
      </header>
      <main className="section" id="data">
        <SearchBar onSearch={handleSearch} />
        {query && (
          <p className="search-results" id="counter">
            "{totalCount} borne(s) trouvée(s)"
          </p>
        )}
        <div className="cards" id="born-list">
          {hotspots.map((hotspot) => (
            <Card key={hotspot.site} result={hotspot} />
          ))}
        </div>
        <LoadMore
          onLoadMore={handleLoadMore}
          displayLoadMore={displayLoadMore}
        />
      </main>
      <footer className="section">
        <a href="#top" className="btn" id="back-to-top">
          ↑ Haut de page
        </a>
        <p>© 2026 Elodie Sevestre — Ada Tech School</p>
        <a id="api-url" href="https://data.nantesmetropole.fr">
          Données Nantes Métropole Open Data
        </a>
      </footer>
    </>
  );
}

export default App;
```

---

## Décorticage section par section

### 1. Les imports

```jsx
import { useState, useEffect } from "react";
import { requestAPI, initResultToShow } from "./api.js";
import SearchBar from "./components/SearchBar.jsx";
import Card from "./components/Card.jsx";
import LoadMore from "./components/LoadMore.jsx";
import "./App.css";
```

| Import | Provenance | Rôle |
|---|---|---|
| `useState`, `useEffect` | react | Hooks pour l'état et les effets |
| `requestAPI` | api.js | Fonction de fetch vers l'API |
| `initResultToShow` | api.js | Constante : nombre de résultats par page |
| `SearchBar`, `Card`, `LoadMore` | components/ | Composants enfants |
| `App.css` | local | Styles |

---

### 2. L'état global

```jsx
const [hotspots, setHotspots] = useState([]);
const [query, setQuery] = useState("");
const [offset, setOffset] = useState(0);
const [totalCount, setTotalCount] = useState(0);
```

Ces quatre états remplacent entièrement `state.js` du projet vanilla :

| État | Type | Valeur initiale | Rôle |
|---|---|---|---|
| `hotspots` | tableau | `[]` | Les bornes affichées |
| `query` | string | `""` | La recherche en cours |
| `offset` | number | `0` | Point de départ pagination |
| `totalCount` | number | `0` | Total renvoyé par l'API |

---

### 3. La variable calculée `displayLoadMore`

```jsx
const displayLoadMore = offset + initResultToShow < totalCount;
```

Ce n'est pas un état — c'est une valeur **calculée** à partir des états existants.
Elle est recalculée automatiquement à chaque rendu.

```
Exemple :
  offset = 0, initResultToShow = 8, totalCount = 25
  0 + 8 < 25 → true → le bouton est visible

  offset = 16, initResultToShow = 8, totalCount = 25
  16 + 8 < 25 → false → le bouton est caché
```

> **Règle** : si une valeur peut être calculée depuis des états existants, on ne crée pas un nouvel état — on calcule directement.

---

### 4. `fetchData` — la fonction de chargement

```jsx
const fetchData = async (query, offset, append) => {
  const data = await requestAPI(query, offset);
  if (append) {
    setHotspots((prev) => [...prev, ...data.results]); // ajoute
  } else {
    setHotspots(data.results); // remplace
  }
  setTotalCount(data.total_count);
};
```

Le paramètre `append` contrôle comment les nouvelles bornes sont intégrées :

| `append` | Comportement | Quand |
|---|---|---|
| `false` (ou absent) | Remplace `hotspots` | Chargement initial, nouvelle recherche |
| `true` | Ajoute à `hotspots` | Bouton "Charger plus" |

L'opérateur spread `...` permet de fusionner deux tableaux :
```js
// prev = bornes déjà affichées
// data.results = nouvelles bornes
[...prev, ...data.results] // → les deux tableaux mis bout à bout
```

---

### 5. `useEffect` — le chargement initial

```jsx
useEffect(() => {
  fetchData(query, offset);
}, []);
```

- `[]` vide → s'exécute **une seule fois** au montage du composant
- Remplace le `loading(query, offset, true)` de `main.js` en vanilla

> **Pourquoi ne pas appeler `fetchData` directement dans la fonction ?**
> Parce que `App` se ré-exécute à chaque changement d'état. Sans `useEffect`, le fetch se relancerait en boucle infinie.

---

### 6. `handleSearch` — la recherche

```jsx
const handleSearch = async (value) => {
  setQuery(value);
  setOffset(0);
  fetchData(value, 0);
};
```

Reçoit la valeur depuis `SearchBar` via la prop `onSearch`.

> **Pourquoi passer `value` et `0` directement à `fetchData` plutôt que `query` et `offset` ?**
> Parce que `setQuery` et `setOffset` sont asynchrones — les états ne sont pas encore mis à jour à la ligne suivante. Il faut utiliser les valeurs locales `value` et `0`.

---

### 7. `handleLoadMore` — la pagination

```jsx
const handleLoadMore = async () => {
  const newOffset = offset + initResultToShow;
  setOffset(newOffset);
  fetchData(query, newOffset, true);
};
```

- Calcule le nouvel offset avant de mettre à jour l'état (même raison qu'au-dessus)
- Passe `true` à `fetchData` pour **ajouter** les résultats à la liste

---

### 8. Le return — l'arbre JSX

```jsx
return (
  <>
    <header>...</header>
    <main>
      <SearchBar onSearch={handleSearch} />
      {query && <p>{totalCount} borne(s) trouvée(s)</p>}
      <div className="cards">
        {hotspots.map((hotspot) => (
          <Card key={hotspot.site} result={hotspot} />
        ))}
      </div>
      <LoadMore onLoadMore={handleLoadMore} displayLoadMore={displayLoadMore} />
    </main>
    <footer>...</footer>
  </>
);
```

Points clés :

- **`<>...</>`** — fragment React, remplace la `<div>` racine sans ajouter d'élément dans le DOM
- **`hotspots.map()`** — crée un `<Card />` pour chaque borne
- **`key={hotspot.site}`** — identifiant unique obligatoire pour chaque élément de liste
- **Props descendantes** — `App` passe ses fonctions aux enfants qui les appellent en retour

---

## Comparaison vanilla JS → React

| Vanilla JS | React |
|---|---|
| `state.js` — variables globales | `useState` dans `App` |
| `loader.js` — `loading()` | `fetchData()` dans `App` |
| `main.js` — `loading(query, offset, true)` | `useEffect(() => fetchData(), [])` |
| `search.js` — `search()` | `handleSearch()` dans `App` |
| `pagination.js` — `moreLoadButton` | `handleLoadMore()` dans `App` |
| `render.js` — `renderList()` | `hotspots.map(() => <Card />)` |

---

## Les concepts clés à retenir

| Concept | Définition courte |
|---|---|
| **État global** | `useState` dans le composant racine, partagé via props |
| **Valeur calculée** | Dérivée d'états existants, pas besoin de `useState` |
| **useEffect** | Exécute du code au montage ou quand des dépendances changent |
| **Flux descendant** | `App` passe données et fonctions aux enfants via props |
| **Flux remontant** | Les enfants appellent les fonctions reçues en prop |
| **append** | Paramètre qui contrôle remplacement vs ajout dans la liste |
| **Opérateur spread** | `[...a, ...b]` fusionne deux tableaux |
