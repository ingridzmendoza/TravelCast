const API_KEY = "leaked_key_overwrite";

export async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Ciudad no encontrada");
    }

    return await response.json();
}

export async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Error en el pronóstico");
    }

    return await response.json();
}