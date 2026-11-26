// Journal-Seite: zeigt alle gespeicherten Favoriten aus dem localStorage.

import { createMovieCard } from "./ui.js";
import { getFavourites, removeFavourite, updateNote } from "./storage.js";

// Wie lange die Rückmeldung "Notiz gespeichert" sichtbar bleibt (Millisekunden).
const FEEDBACK_DURATION = 2000;

const container = document.querySelector("#favourites-container");
const emptyMessage = document.querySelector("#empty-message");

function createRemoveButton(movie) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Entfernen";
  button.className = "w-full rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white";
  button.addEventListener("click", () => {
    removeFavourite(movie.id);
    renderJournal();
  });
  return button;
}

function createCardExtras(movie) {
  const wrapper = document.createElement("div");
  wrapper.className = "mt-auto flex flex-col gap-3";

  // --- Bereich 1: Notiz (Textfeld + Speichern + Rückmeldung) ---------------
  const textarea = document.createElement("textarea");
  textarea.value = movie.note ?? "";
  textarea.rows = 3;
  textarea.placeholder = "Deine Notiz …";
  textarea.className =
    "w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/20";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Speichern";
  saveButton.className = "rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-500";

  const feedback = document.createElement("p");
  feedback.className = "text-sm text-violet-400";

  let timeoutId;
  saveButton.addEventListener("click", () => {
    updateNote(movie.id, textarea.value);
    feedback.textContent = "Notiz gespeichert";
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      feedback.textContent = "";
    }, FEEDBACK_DURATION);
  });

  const saveRow = document.createElement("div");
  saveRow.className = "flex items-center gap-3";
  saveRow.append(saveButton, feedback);

  const noteSection = document.createElement("div");
  noteSection.className = "flex flex-col gap-2";
  noteSection.append(textarea, saveRow);

  // --- Bereich 2: Film entfernen, durch eine Linie getrennt ----------------
  const removeSection = document.createElement("div");
  removeSection.className = "border-t border-zinc-800 pt-3";
  removeSection.append(createRemoveButton(movie));

  wrapper.append(noteSection, removeSection);
  return wrapper;
}

function renderJournal() {
  const favourites = getFavourites();
  // Alte Karten entfernen, damit nichts doppelt erscheint.
  container.replaceChildren();
  emptyMessage.classList.toggle("hidden", favourites.length > 0);
  favourites.forEach((movie) => {
    const card = createMovieCard(movie, {
      showFavouriteButton: false,
      extraContent: createCardExtras(movie),
    });
    container.append(card);
  });
}

renderJournal();
