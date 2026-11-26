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

import { TMDB_TOKEN } from "./config.js";

const BASE_URL = "https://api.themoviedb.org/3";
const LANGUAGE = "de-DE";

// Hilfsfunktion fuer alle Anfragen, gibt ein Array von Filmen zurueck
async function request(path) {
  let response;

  try {
    response = await fetch(BASE_URL + path, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: "application/json",
      },
    });
  } catch {
    throw new Error("Keine Verbindung zu TMDB");
  }

  if (!response.ok) {
    throw new Error(`TMDB-Anfrage fehlgeschlagen (${response.status})`);
  }

  const data = await response.json();
  return data.results;
}

// Hilfsfunktion zur Umwandlung eines Elements aus dem Filme-Array (result) in unser Movie-Objekt
function toMovie(result) {
  return {
    id: result.id,
    title: result.title,
    poster_path: result.poster_path ?? null,
    release_date: result.release_date ?? "",
    overview: result.overview ?? "",
    vote_average: result.vote_average ?? 0,
  };
}

// Parameter: keine
// Rückgabe: Promise mit Array von Movie (beliebte Filme, Seite 1)
export async function fetchPopular() {
  const results = await request(`/movie/popular?language=${LANGUAGE}&page=1`);
  return results.map(toMovie);
}

// Parameter: query (string)
// Rückgabe: Promise mit Array von Movie
//           (leeres Array bei leerem query oder ohne Treffer)
export async function searchMovies(query) {
  const trimmed = (query ?? "").trim();
  if (!trimmed) {
    return [];
  }
  const encoded = encodeURIComponent(trimmed); // Suchbegriff codieren, damit URL-Sonderzeichen keine Konflikte verursachen
  const results = await request(
    `/search/movie?query=${encoded}&language=${LANGUAGE}&include_adult=false&page=1`,
  );
  return results.map(toMovie);
}
