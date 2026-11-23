// Zuständig: Person A
// Karten werden mit document.createElement gebaut.
// Kein innerHTML mit API-Daten.

// createMovieCard(movie, options)
// Parameter:
//   movie: Movie-Objekt oder Favorit
//   options: Objekt, optional, mit diesen Feldern:
//     showFavouriteButton: boolean, Standard true
//     isFavourite: boolean, Standard false
//                  (true: Button zeigt "Gespeichert ✓" und ist deaktiviert)
//     onFavourite: Funktion (movie, button), wird beim Klick auf
//                  "Add to favourites" aufgerufen
//     extraContent: HTMLElement oder null, wird unten an die Karte gehängt
//                   (Journal: Entfernen-Button und Notiz)
// Rückgabe: HTMLElement der Karte
// Die Karte hat data-movie-id="<id>" und zeigt Poster (Platzhalter wenn
// poster_path null ist), Titel, Erscheinungsjahr, Bewertung mit einer
// Nachkommastelle und die auf 120 Zeichen gekürzte Beschreibung.
export function createMovieCard(movie, options = {}) {
  return document.createElement("div");
}

// setFavouriteButtonState(button, isFavourite)
// Parameter:
//   button: HTMLButtonElement
//   isFavourite: boolean
// Rückgabe: nichts (setzt Text und disabled des Buttons)
export function setFavouriteButtonState(button, isFavourite) {}
