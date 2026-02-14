const API_KEY = "my_api_key";

export async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Ciudad no encontrada");
    }

    return await response.json();
}
