// Journal-Seite: zeigt alle gespeicherten Favoriten aus dem localStorage.

import { createMovieCard } from "./ui.js";
import { getFavourites, removeFavourite } from "./storage.js";

const container = document.querySelector("#favourites-container");
const emptyMessage = document.querySelector("#empty-message");

function createRemoveButton(id) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Entfernen";
  button.className = "mt-auto rounded-lg border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800";
  button.addEventListener("click", () => {
    removeFavourite(id);
    renderJournal();
  });
  return button;
}

function renderJournal() {
  const favourites = getFavourites();
  // Alte Karten entfernen, damit nichts doppelt erscheint.
  container.replaceChildren();
  emptyMessage.classList.toggle("hidden", favourites.length > 0);
  favourites.forEach((movie) => {
    const card = createMovieCard(movie, {
      // Im Journal brauchen wir "Add to favourites" nicht.
      showFavouriteButton: false,
      // Der Entfernen-Button wird unten an die Karte gehängt.
      extraContent: createRemoveButton(movie.id),
    });
    container.append(card);
  });
}

renderJournal();
