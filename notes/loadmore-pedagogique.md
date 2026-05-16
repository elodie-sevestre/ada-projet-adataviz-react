# Fiche pédagogique — `LoadMore.jsx`

## Ce que fait ce fichier

`LoadMore` est un composant React minimaliste : il affiche un bouton "Charger plus" ou rien du tout, selon une condition passée par le parent.
Il n'a pas d'état local — il reçoit tout ce dont il a besoin via ses props.

---

## Le fichier complet

```jsx
function LoadMore({ onLoadMore, displayLoadMore }) {
  if (!displayLoadMore) return null;
  return (
    <button className="btn" onClick={onLoadMore}>
      Charger plus
    </button>
  );
}

export default LoadMore;
```

---

## Décorticage ligne par ligne

### 1. Les props

```jsx
function LoadMore({ onLoadMore, displayLoadMore }) {
```

Ce composant reçoit deux props :

| Prop | Type | Rôle |
|---|---|---|
| `onLoadMore` | fonction | Appelée au clic — définie dans `App` |
| `displayLoadMore` | booléen | Détermine si le bouton est visible |

`LoadMore` ne sait pas **comment** charger plus de données — il sait juste **quand** appeler `onLoadMore`. C'est `App` qui gère la logique.

---

### 2. Le retour conditionnel

```jsx
if (!displayLoadMore) return null;
```

`null` est une valeur spéciale en React : retourner `null` signifie **n'afficher rien du tout**.

C'est une façon courante de conditionner l'affichage d'un composant entier :

```jsx
// Équivalent avec l'opérateur ternaire dans le parent :
{displayLoadMore && <LoadMore ... />}

// Ou géré à l'intérieur du composant lui-même :
if (!displayLoadMore) return null;
```

> **Comparaison vanilla JS** :
> ```js
> // Vanilla — on manipule le DOM directement
> moreLoadButton.classList.add("hidden");
>
> // React — on retourne null, React retire l'élément du DOM
> if (!displayLoadMore) return null;
> ```

---

### 3. Le bouton

```jsx
<button className="btn" onClick={onLoadMore}>
  Charger plus
</button>
```

Le `onClick` appelle directement `onLoadMore` sans fonction fléchée intermédiaire — c'est possible car on n'a pas besoin de passer d'arguments.

```jsx
// Avec argument → fonction fléchée obligatoire
onClick={() => onLoadMore(valeur)}

// Sans argument → référence directe suffisante
onClick={onLoadMore}
```

---

## Comparaison vanilla JS → React

| Vanilla JS | React |
|---|---|
| `button.classList.add("hidden")` | `if (!displayLoadMore) return null` |
| `button.classList.remove("hidden")` | `displayLoadMore` est `true` → le bouton s'affiche |
| `button.addEventListener("click", fn)` | `onClick={onLoadMore}` |
| Logique dans `pagination.js` | Logique dans `App`, `LoadMore` ne fait qu'afficher |

---

## Les concepts clés à retenir

| Concept | Définition courte |
|---|---|
| **Retourner `null`** | Ne rien afficher — React retire l'élément du DOM |
| **Retour conditionnel** | `if (!condition) return null` avant le return principal |
| **Composant sans état** | Pas de `useState` — tout vient des props |
| **Référence de fonction** | `onClick={onLoadMore}` sans `()` ni fléchée quand pas d'argument |
