import { getCitySuggestions, getForecast, getWeather } from "./api.js";
import { getRecommendations } from "./recommendations.js";


const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const forecastDiv = document.getElementById("forecast");
const recommendationsDiv = document.getElementById("recommendations");
const historyList = document.getElementById("historyList");
const favoritesList = document.getElementById("favoritesList");
const suggestionsBox = document.getElementById("suggestions");


let currentUnit = "C";
let lastWeatherData = null;
let lastForecastData = null;

function isValidCityName(city) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;
    return regex.test(city);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Por favor escribe una ciudad");
        return;
    }

    if (!isValidCityName(city)) {
        alert("Por favor escribe solo letras. No se permiten caracteres especiales.");
        return;
    }

    try {
        const weatherData = await getWeather(city);
        showWeather(weatherData);

        const forecastData = await getForecast(city);
        showForecast(forecastData);

        showRecommendations(weatherData.weather[0].main);

        saveToHistory(city);

        lastWeatherData = weatherData;
        lastForecastData = forecastData;

    } catch (error) {
        weatherResult.classList.remove("hidden");
        weatherResult.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});


function showWeather(data) {
    weatherResult.classList.remove("hidden");

    const temp = convertTemp(data.main.temp).toFixed(1);

    weatherResult.innerHTML = `
    <h2>${data.name}</h2>

    <p>Temperatura: ${temp} °${currentUnit}</p>

    <p>Clima: ${data.weather[0].description}</p>

    <div class="weather-icon-box">
        <img
        src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
        alt="Icono del clima"
        />
    </div>

        <button class="favorite-btn" id="favBtn">
        Agregar a favoritos   ♥
        </button>

        <button class="unit-btn" id="unitBtn">
        Cambiar a °${currentUnit === "C" ? "F" : "C"}
        </button>
    `;

    document.getElementById("favBtn").addEventListener("click", () => {
        saveFavorite(data.name);
    });

    document.getElementById("unitBtn").addEventListener("click", toggleUnit);
}

function showForecast(data) {
    forecastDiv.classList.remove("hidden");

    forecastDiv.innerHTML = "<h2>Pronóstico 5 días</h2>";

    const dailyForecast = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyForecast.forEach(day => {
        const [year, month, dayNum] = day.dt_txt.split(" ")[0].split("-");
        const formattedDate = `${dayNum}/${month}/${year}`;
        const temp = convertTemp(day.main.temp).toFixed(1);
        const desc = day.weather[0].description;
        const icon = day.weather[0].icon;

        forecastDiv.innerHTML += `
        <div class="forecast-day">
            <p><strong>${formattedDate}</strong></p>
            <img src="https://openweathermap.org/img/wn/${icon}.png" />
            <p>${temp} °${currentUnit}</p>
            <p>${desc}</p>
        </div>
        `;
    });
}

function showSuggestions(cities) {
    suggestionsBox.innerHTML = "";

    if (cities.length === 0) {
        suggestionsBox.classList.add("hidden");
        return;
    }

    suggestionsBox.classList.remove("hidden");

    cities.forEach(city => {
        const li = document.createElement("li");

        li.textContent = `${city.name}, ${city.country}`;

        li.addEventListener("click", () => {
            cityInput.value = city.name;
            suggestionsBox.classList.add("hidden");
        });

        suggestionsBox.appendChild(li);
    });
}


let debounceTimer;

cityInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
        const query = cityInput.value.trim();

        if (query.length < 2) return;

        const cities = await getCitySuggestions(query);
        showSuggestions(cities);

    }, 400);
});

function showRecommendations(weatherType) {
    recommendationsDiv.classList.remove("hidden");

    const recs = getRecommendations(weatherType);

    recommendationsDiv.innerHTML = `
        <h2>Recomendaciones para tu viaje</h2>
        <ul>
        ${recs.map(item => `<li>${item}</li>`).join("")}
        </ul>
    `;
}

async function loadDefaultCity() {
    const defaultCity = "Tokyo";

    cityInput.value = defaultCity;

    try {
        const weatherData = await getWeather(defaultCity);
        showWeather(weatherData);

        const forecastData = await getForecast(defaultCity);
        showForecast(forecastData);

        showRecommendations(weatherData.weather[0].main);

        lastWeatherData = weatherData;
        lastForecastData = forecastData;

    } catch (error) {
        weatherResult.innerHTML = `<p>Error cargando ciudad inicial</p>`;
    }
}


function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    history = history.filter(item => item !== city);

    history.unshift(city);

    history = history.slice(0, 5);

    localStorage.setItem("history", JSON.stringify(history));

    renderHistory();
}

function renderHistory() {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    const historySection = document.getElementById("historySection");

    historyList.innerHTML = "";

    if (history.length === 0) {
        historySection.classList.add("hidden");
        return;
    }

    historySection.classList.remove("hidden");

    history.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;

        li.addEventListener("click", () => {
            cityInput.value = city;
            form.dispatchEvent(new Event("submit"));

            document.getElementById("weatherResult").scrollIntoView({
                behavior: "smooth"
            });
        });

        historyList.appendChild(li);
    });
}


function saveFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    renderFavorites();
}

function removeFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favorites = favorites.filter(item => item !== city);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    renderFavorites();
}

function renderFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const favoritesSection = document.getElementById("favoritesSection");

    favoritesList.innerHTML = "";

    if (favorites.length === 0) {
        favoritesSection.classList.add("hidden");
        return;
    }

    favoritesSection.classList.remove("hidden");

    favorites.forEach(city => {
        const li = document.createElement("li");

        li.innerHTML = `
        <span class="fav-city">${city}</span>
        <button class="remove-btn">❌</button>
        `;

        li.addEventListener("click", () => {
            cityInput.value = city;
            form.dispatchEvent(new Event("submit"));

            document.getElementById("weatherResult").scrollIntoView({
                behavior: "smooth"
            });
        });

        li.querySelector(".remove-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            removeFavorite(city);
        });

        favoritesList.appendChild(li);
    });
}


function convertTemp(tempC) {
    if (currentUnit === "C") return tempC;
    return (tempC * 9) / 5 + 32;
}

function toggleUnit() {
    currentUnit = currentUnit === "C" ? "F" : "C";

    if (lastWeatherData) showWeather(lastWeatherData);
    if (lastForecastData) showForecast(lastForecastData);
}

renderHistory();
renderFavorites();
loadDefaultCity();