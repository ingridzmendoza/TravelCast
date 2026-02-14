import { getWeather, getForecast } from "./api.js";
import { getRecommendations } from "./recommendations.js";

const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const forecastDiv = document.getElementById("forecast");
const recommendationsDiv = document.getElementById("recommendations");
const historyList = document.getElementById("historyList");
const favoritesList = document.getElementById("favoritesList");

let currentUnit = "C";
let lastWeatherData = null;
let lastForecastData = null;


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Por favor escribe una ciudad");
        return;
    }

    try {
        const weatherData = await getWeather(city);
        showWeather(weatherData);

        const forecastData = await getForecast(city);
        showForecast(forecastData);

        showRecommendations(weatherData.weather[0].main);

        saveToHistory(city);

    } catch (error) {
        weatherResult.classList.remove("hidden");
        weatherResult.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

function showWeather(data) {
    weatherResult.classList.remove("hidden");

    weatherResult.innerHTML = `
    <h2>${data.name}</h2>
    <p>Temperatura: ${data.main.temp} °C</p>
    <p>Clima: ${data.weather[0].description}</p>
        <img
        src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
        alt="Icono del clima"
        />

        <button class="favorite-btn" id="favBtn">
        Agregar a favoritos
        </button>
    `;

    document.getElementById("favBtn").addEventListener("click", () => {
        saveFavorite(data.name);
    });
}


function showForecast(data) {
    forecastDiv.classList.remove("hidden");

    forecastDiv.innerHTML = "<h2>Pronóstico 5 días</h2>";

    const dailyForecast = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyForecast.forEach(day => {
        const date = day.dt_txt.split(" ")[0];
        const temp = day.main.temp;
        const desc = day.weather[0].description;
        const icon = day.weather[0].icon;

        forecastDiv.innerHTML += `
        <div class="forecast-day">
            <p><strong>${date}</strong></p>
            <img src="https://openweathermap.org/img/wn/${icon}.png" />
            <p>${temp} °C</p>
            <p>${desc}</p>
        </div>
        `;
    });
}

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

    historyList.innerHTML = "";

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

    favoritesList.innerHTML = "";

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


renderHistory();
renderFavorites();
