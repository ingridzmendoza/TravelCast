export function saveFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }
}

export function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}
