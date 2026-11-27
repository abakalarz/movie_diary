import { fetchPopular } from "./api.js";
import { createMovieCard, setFavouriteButtonState } from "./ui.js";
import { isFavourite, addFavourite } from "./storage.js";

const container = document.querySelector("#movies-container");
const message = document.querySelector("#movies-message");

function showMessage(text) {
  message.textContent = text;
  message.classList.remove("hidden");
}

function hideMessage() {
  message.classList.add("hidden");
}

function handleFavourite(movie, button) {
  addFavourite(movie);
  setFavouriteButtonState(button, true);
}

async function loadPopularMovies() {
  showMessage("Beliebte Filme werden geladen …");

  try {
    const movies = await fetchPopular();

    if (movies.length === 0) {
      showMessage("Gerade sind keine Filme verfügbar.");
      return;
    }

    const cards = movies.map((movie) =>
      createMovieCard(movie, {
        isFavourite: isFavourite(movie.id),
        onFavourite: handleFavourite,
      }),
    );
    container.replaceChildren(...cards);
    hideMessage();
  } catch (error) {
    console.error(error);
    showMessage(
      "Die Filme konnten nicht geladen werden. Bitte lade die Seite neu.",
    );
  }
}

loadPopularMovies();
