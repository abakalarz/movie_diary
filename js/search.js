// Suche mit Dialog (Person B). Wird in index.html als eigenes Modul geladen,
// main.js (Person A) muss dafür nicht angepasst werden.
import { searchMovies } from "./api.js";
import { createMovieCard, setFavouriteButtonState } from "./ui.js";
import { isFavourite, addFavourite } from "./storage.js";

const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const dialog = document.querySelector("#search-dialog");
const title = document.querySelector("#search-title");
const message = document.querySelector("#search-message");
const results = document.querySelector("#search-results");
const closeButton = document.querySelector("#search-close");

const MAX_RESULTS = 12;
let latestSearch = 0; // verhindert, dass eine alte Suche eine neuere überschreibt

function showMessage(text) {
  message.textContent = text;
  message.classList.remove("hidden");
}

function hideMessage() {
  message.classList.add("hidden");
}

function handleFavourite(movie, button) {
  if (!addFavourite(movie)) return;
  setFavouriteButtonState(button, true);
  // Gleiche Karte auf der Startseite ebenfalls aktualisieren
  document
    .querySelectorAll(`#movies-container [data-movie-id="${movie.id}"] button`)
    .forEach((homeButton) => setFavouriteButtonState(homeButton, true));
}

async function handleSearch(event) {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  const searchId = ++latestSearch;
  title.textContent = `Ergebnisse für „${query}“`;
  results.replaceChildren();
  showMessage("Suche läuft …");
  if (!dialog.open) dialog.showModal();

  try {
    const movies = await searchMovies(query);
    if (searchId !== latestSearch) return;

    if (movies.length === 0) {
      showMessage(`Keine Treffer für „${query}“. Versuche einen anderen Titel.`);
      return;
    }

    hideMessage();
    const cards = movies.slice(0, MAX_RESULTS).map((movie) =>
      createMovieCard(movie, {
        isFavourite: isFavourite(movie.id),
        onFavourite: handleFavourite,
      })
    );
    results.replaceChildren(...cards);
  } catch (error) {
    if (searchId !== latestSearch) return;
    console.error(error);
    showMessage("Die Suche ist fehlgeschlagen. Bitte versuche es gleich noch einmal.");
  }
}

form.addEventListener("submit", handleSearch);
closeButton.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close(); // Klick auf den Hintergrund
});
