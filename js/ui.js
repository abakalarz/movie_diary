// Zuständig: Person A
// Karten werden mit document.createElement gebaut.
// Kein innerHTML mit API-Daten.
//
// Warum kein innerHTML?
// Die Filmdaten (Titel, Beschreibung) kommen von einem fremden Server.
// Würden wir sie per innerHTML einfügen, könnte darin versteckter HTML-
// oder JavaScript-Code stecken, den der Browser dann ausführt (das nennt
// man XSS). Mit textContent wird alles immer nur als reiner Text angezeigt.

// ---------------------------------------------------------------------------
// Konstanten
// Werte, die sich nie ändern, stehen oben mit Namen in GROSSBUCHSTABEN.
// So sieht man sofort, was sie bedeuten, und muss sie nur an einer Stelle
// anpassen.
// ---------------------------------------------------------------------------

// TMDB liefert nur den hinteren Teil des Bild-Pfads (z. B. "/abc.jpg").
// Davor gehört diese Adresse. "w500" bedeutet: Bild ist 500 Pixel breit.
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Ersatzbild, wenn ein Film kein Poster hat (poster_path ist dann null).
// placehold.co erzeugt ein Bild nach dem Muster:
//   /<Breite>x<Höhe>/<Hintergrundfarbe>/<Textfarbe>?text=<Text>
// Die Farben passen zu DESIGN.md ("Poster-Platzhalter: bg-zinc-800
// text-zinc-500"): 27272a ist zinc-800, 71717a ist zinc-500.
const PLACEHOLDER_URL = "https://placehold.co/500x750/27272a/71717a?text=Kein+Poster";

// Maximale Länge der Beschreibung auf der Karte.
const MAX_OVERVIEW_LENGTH = 120;

// Texte des Favoriten-Buttons in seinen zwei Zuständen.
const BUTTON_TEXT_DEFAULT = "Add to favourites";
const BUTTON_TEXT_SAVED = "Gespeichert ✓";

// ---------------------------------------------------------------------------
// Kleine Hilfsfunktionen
// Sie werden nicht exportiert, sind also nur innerhalb dieser Datei nutzbar.
// Jede erledigt genau eine Aufgabe. Das macht den Code leichter lesbar.
// ---------------------------------------------------------------------------

// Gibt die passende Bild-Adresse zurück: echtes Poster oder Platzhalter.
function getPosterUrl(posterPath) {
  // null, undefined und "" gelten in einer if-Bedingung als "falsy" (falsch).
  if (posterPath) {
    return IMAGE_BASE_URL + posterPath;
  }
  return PLACEHOLDER_URL;
}

// Macht aus "1999-10-15" das Jahr "1999".
// Ist das Datum leer, zeigen wir einen Gedankenstrich.
function getYear(releaseDate) {
  if (!releaseDate) {
    return "–";
  }
  // slice(0, 4) schneidet die Zeichen an Position 0 bis 3 heraus.
  return releaseDate.slice(0, 4);
}

// Formatiert die Bewertung mit genau einer Nachkommastelle: 8.438 -> "8.4".
function formatRating(voteAverage) {
  // Number(...) macht sicher eine Zahl daraus. "?? 0" bedeutet:
  // Wenn der Wert null oder undefined ist, nimm stattdessen 0.
  return Number(voteAverage ?? 0).toFixed(1);
}

// Kürzt einen Text auf höchstens maxLength Zeichen und hängt "…" an.
function truncate(text, maxLength) {
  if (!text) {
    return "Keine Beschreibung vorhanden.";
  }
  if (text.length <= maxLength) {
    // Text ist kurz genug, wir geben ihn unverändert zurück.
    return text;
  }
  // trimEnd() entfernt ein mögliches Leerzeichen am Ende vor dem "…".
  return text.slice(0, maxLength).trimEnd() + "…";
}

// ---------------------------------------------------------------------------
// Exportierte Funktionen (die "Schnittstelle" aus Karte 0.3)
// "export" bedeutet: andere Dateien können sie mit import benutzen, z. B.
//   import { createMovieCard } from "./ui.js";
// ---------------------------------------------------------------------------

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
//
// Beispiel:
//   const card = createMovieCard(movie, {
//     onFavourite: (movie, button) => console.log("Favorit:", movie.title),
//   });
//   document.querySelector("#movie-grid").append(card);
export function createMovieCard(movie, options = {}) {
  // "options = {}" ist ein Standardwert: Ruft jemand createMovieCard(movie)
  // ohne zweites Argument auf, ist options ein leeres Objekt statt undefined.

  // Destrukturierung: Wir holen die Felder aus dem options-Objekt in eigene
  // Variablen. Steht hinter einem Namen "= ...", ist das der Standardwert,
  // falls das Feld fehlt.
  const { showFavouriteButton = true, isFavourite = false, onFavourite = null, extraContent = null } = options;

  // --- 1. Äußerer Rahmen der Karte -----------------------------------------
  // <article> ist das passende HTML-Element für einen eigenständigen Inhalt.
  const card = document.createElement("article");

  // dataset.movieId wird im HTML zu data-movie-id="550".
  // So können andere Teile der App später die Karte zu einem Film finden,
  // z. B. mit document.querySelector('[data-movie-id="550"]').
  card.dataset.movieId = movie.id;

  // Tailwind-Klassen (eigenes CSS ist laut FR006 nicht erlaubt).
  // Farben und Rahmen kommen aus DESIGN.md (Zeilen "Fläche / Karte" und
  // "Karte Hover"), damit alle Seiten einheitlich aussehen:
  //   flex flex-col  -> Inhalt untereinander anordnen
  //   h-full         -> Karte füllt die Höhe ihrer Grid-Zelle (alle gleich hoch)
  //   overflow-hidden -> das Bild ragt nicht über die runden Ecken hinaus
  //   bg-zinc-900 border border-zinc-800 rounded-2xl -> dunkle Fläche mit Rahmen
  //   transition hover:-translate-y-1 -> Karte hebt sich beim Überfahren
  //                                      mit der Maus sanft ein Stück an
  card.className = "flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:-translate-y-1 hover:border-zinc-700";

  // --- 2. Poster ------------------------------------------------------------
  const poster = document.createElement("img");
  poster.src = getPosterUrl(movie.poster_path);
  // alt-Text ist wichtig für Screenreader und falls das Bild nicht lädt.
  poster.alt = `Poster von ${movie.title}`;
  // "lazy" lädt das Bild erst, wenn es in die Nähe des sichtbaren Bereichs
  // kommt. Das spart Datenvolumen bei vielen Karten.
  poster.loading = "lazy";
  // aspect-[2/3] hält das typische Poster-Format (Breite : Höhe = 2 : 3).
  // object-cover füllt die Fläche, ohne das Bild zu verzerren.
  // bg-zinc-800 ist die Hintergrundfarbe, solange das Bild noch lädt.
  poster.className = "aspect-[2/3] w-full bg-zinc-800 object-cover";

  // --- 3. Textbereich -------------------------------------------------------
  // Ein Container für alles unter dem Bild.
  //   flex-1 -> nimmt den restlichen Platz der Karte ein
  //   gap-2  -> Abstand zwischen den Elementen
  //   p-3 sm:p-4 -> auf dem Handy (2 schmale Spalten) etwas weniger
  //                 Innenabstand, ab "sm" (640px Breite) etwas mehr
  const body = document.createElement("div");
  body.className = "flex flex-1 flex-col gap-2 p-3 sm:p-4";

  // Titel
  const title = document.createElement("h3");
  // textContent statt innerHTML: der Titel wird garantiert nur als Text
  // angezeigt (siehe Erklärung ganz oben).
  title.textContent = movie.title;
  // Klassen laut DESIGN.md "Titel". Auf dem Handy etwas kleinere Schrift.
  title.className = "font-semibold leading-tight text-zinc-100 sm:text-lg";

  // Jahr und Bewertung in einer Zeile, z. B. "1999 · ★ 8.4"
  const meta = document.createElement("p");
  meta.textContent = `${getYear(movie.release_date)} · ★ ${formatRating(movie.vote_average)}`;
  // Klassen laut DESIGN.md "Nebeninfo".
  meta.className = "text-sm text-zinc-400";

  // Gekürzte Beschreibung
  const overview = document.createElement("p");
  overview.textContent = truncate(movie.overview, MAX_OVERVIEW_LENGTH);
  overview.className = "text-sm text-zinc-400";

  // append hängt Elemente der Reihe nach als Kinder an.
  body.append(title, meta, overview);

  // --- 4. Favoriten-Button (optional) ---------------------------------------
  if (showFavouriteButton) {
    const button = document.createElement("button");
    // type="button" verhindert, dass der Button ein Formular absendet,
    // falls die Karte einmal in einem <form> steckt (z. B. im Suchdialog).
    button.type = "button";
    // mt-auto schiebt den Button ganz nach unten in der Karte. So stehen
    // die Buttons im Grid auf einer Linie, auch wenn die Texte
    // unterschiedlich lang sind.
    // Die übrigen Klassen stammen aus DESIGN.md ("Primärer Button" und
    // "Button deaktiviert"). Die "disabled:"-Klassen gelten nur, wenn der
    // Button deaktiviert ist, also nach dem Speichern als Favorit.
    button.className =
      "mt-auto rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-default disabled:bg-zinc-800 disabled:text-zinc-400";

    // Text und Zustand setzen wir über unsere eigene Funktion, damit die
    // Logik nur an einer Stelle steht.
    setFavouriteButtonState(button, isFavourite);

    // Was beim Klick passiert, entscheidet NICHT die Karte, sondern wer die
    // Karte erstellt (Homepage, Suchdialog ...). Er gibt uns dafür eine
    // Funktion mit, einen sogenannten "Callback". Die Karte ruft sie nur auf.
    // So bleibt ui.js unabhängig von storage.js (Speicherlogik macht Person C).
    button.addEventListener("click", () => {
      if (typeof onFavourite === "function") {
        // Wir geben den Film und den Button mit, damit der Aufrufer z. B.
        // danach setFavouriteButtonState(button, true) aufrufen kann.
        onFavourite(movie, button);
      }
    });

    body.append(button);
  }

  // --- 5. Zusätzlicher Inhalt (optional) ------------------------------------
  // Das Journal (Person C) kann hier z. B. einen "Entfernen"-Button und ein
  // Notizfeld unten an die Karte hängen.
  // "instanceof HTMLElement" prüft, ob wirklich ein HTML-Element übergeben
  // wurde, und nicht z. B. ein Text oder null.
  if (extraContent instanceof HTMLElement) {
    body.append(extraContent);
  }

  // --- 6. Zusammensetzen und zurückgeben ------------------------------------
  card.append(poster, body);

  // Die Karte ist jetzt fertig, aber noch nicht auf der Seite sichtbar.
  // Das Einfügen übernimmt der Aufrufer (z. B. main.js).
  return card;
}

// setFavouriteButtonState(button, isFavourite)
// Parameter:
//   button: HTMLButtonElement
//   isFavourite: boolean
// Rückgabe: nichts (setzt Text und disabled des Buttons)
export function setFavouriteButtonState(button, isFavourite) {
  if (isFavourite) {
    button.textContent = BUTTON_TEXT_SAVED;
    // Ein deaktivierter Button lässt sich nicht mehr anklicken.
    // So kann kein doppelter Favorit entstehen.
    button.disabled = true;
  } else {
    button.textContent = BUTTON_TEXT_DEFAULT;
    button.disabled = false;
  }
}
