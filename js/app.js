import { getWeather } from "./api.js";

const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Por favor escribe una ciudad");
        return;
    }

    try {
        const data = await getWeather(city);
        showWeather(data);
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
