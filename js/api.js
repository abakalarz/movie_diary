// Zuständig: Person A
// Nur diese Datei importiert den Token aus js/config.js.
// Diese Datei wandelt die TMDB-Antwort in Movie-Objekte um.
// Bei HTTP- oder Netzwerkfehlern wird ein Error mit kurzer Meldung geworfen.
// Die aufrufende Seite fängt ihn mit try/catch ab.
// Sprache der Filmdaten: de-DE

// So sieht ein Movie-Objekt aus:
// {
//   id: 550,                      // number
//   title: "Fight Club",          // string
//   poster_path: "/abc.jpg",      // string oder null (kein Poster)
//   release_date: "1999-10-15",   // string "JJJJ-MM-TT" oder ""
//   overview: "...",              // string, kann leer sein
//   vote_average: 8.4             // number
// }

// fetchPopular()
// Parameter: keine
// Rückgabe: Promise mit Array von Movie (beliebte Filme, Seite 1)
export async function fetchPopular() {
  return [];
}

// searchMovies(query)
// Parameter: query (string)
// Rückgabe: Promise mit Array von Movie
//           (leeres Array bei leerem query oder ohne Treffer)
export async function searchMovies(query) {
  return [];
}
