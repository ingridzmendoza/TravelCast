import { getWeather, getForecast } from "./api.js";
import { getRecommendations } from "./recommendations.js";

const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const forecastDiv = document.getElementById("forecast");
const recommendationsDiv = document.getElementById("recommendations");

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
    `;
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
