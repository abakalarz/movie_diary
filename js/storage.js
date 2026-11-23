// Zuständig: Person C
// Nur diese Datei greift auf den localStorage zu.
// Schlüssel: "favourites" (JSON-Array von Movie-Objekten plus note).
// Gelesen und geschrieben wird mit JSON.parse und JSON.stringify.

// getFavourites()
// Parameter: keine
// Rückgabe: Array der Favoriten (leer, wenn nichts gespeichert oder Daten kaputt)
export function getFavourites() {
  return [];
}

// isFavourite(id)
// Parameter: id (number)
// Rückgabe: boolean
export function isFavourite(id) {
  return false;
}

// addFavourite(movie)
// Parameter: movie (Movie-Objekt)
// Rückgabe: true wenn neu gespeichert, false wenn schon vorhanden
export function addFavourite(movie) {
  return false;
}

// removeFavourite(id)
// Parameter: id (number)
// Rückgabe: nichts
export function removeFavourite(id) {}

// updateNote(id, text)
// Parameter: id (number), text (string)
// Rückgabe: nichts (unbekannte id wird ignoriert)
export function updateNote(id, text) {}
