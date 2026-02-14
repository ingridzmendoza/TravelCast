import { API_KEY } from "./config.js";

let failureCount = 0;
let circuitOpen = false;
let nextTryTime = null;

const FAILURE_THRESHOLD = 3;
const COOLDOWN_TIME = 10000;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function fetchWithRetry(url) {
    if (circuitOpen) {
        if (Date.now() < nextTryTime) {
            throw new Error("Servicio temporalmente pausado. Intenta más tarde.");
        } else {
            circuitOpen = false;
            failureCount = 0;
        }
    }

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            failureCount = 0;

            return await response.json();

        } catch (error) {
            console.warn(`Intento ${attempt} falló:`, error.message);

            failureCount++;

            if (failureCount >= FAILURE_THRESHOLD) {
                circuitOpen = true;
                nextTryTime = Date.now() + COOLDOWN_TIME;

                throw new Error(
                    "Servicio temporalmente pausado."
                );
            }

            if (attempt < MAX_RETRIES) {
                await wait(RETRY_DELAY);
            } else {
                throw new Error("No se pudo conectar después de varios intentos.");
            }
        }
    }
}

export async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;

    return await fetchWithRetry(url);
}

export async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`;

    return await fetchWithRetry(url);
}
