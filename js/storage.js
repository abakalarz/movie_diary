// Schlüssel: "favourites" (JSON-Array von Movie-Objekten plus note).

const STORAGE_KEY = "favourites";

function saveFavourites(favourites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
}

export function getFavourites() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData === null) {
      return [];
    }
    const data = JSON.parse(storedData);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

export function isFavourite(id) {
  return getFavourites().some((favourite) => favourite.id === id);
}

export function addFavourite(movie) {
  if (isFavourite(movie.id)) {
    return false;
  }
  const favourite = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    overview: movie.overview,
    vote_average: movie.vote_average,
    note: "",
  };
  const favourites = getFavourites();
  favourites.push(favourite);
  saveFavourites(favourites);
  return true;
}

export function removeFavourite(id) {
  const favourites = getFavourites().filter((favourite) => {
    if (favourite.id !== id) {
      return true;
    } else {
      return false;
    }
  });
  saveFavourites(favourites);
}

export function updateNote(id, text) {
  const favourites = getFavourites();
  const favourite = favourites.find((item) => item.id === id);
  if (!favourite) {
    return;
  }
  favourite.note = text;
  saveFavourites(favourites);
}
