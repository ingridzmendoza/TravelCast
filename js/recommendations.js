export function getRecommendations(weatherType) {

    switch (weatherType) {

        case "Clear":
            return [
                "Ideal para ir a la playa",
                "Perfecto para caminatas al aire libre",
                "Visita parques o miradores"
            ];

        case "Rain":
            return [
                "Buen día para visitar museos",
                "Explora cafeterías o restaurantes",
                "Lleva paraguas y haz turismo indoor"
            ];

        case "Clouds":
            return [
                "Clima agradable para recorrer la ciudad",
                "Haz un tour cultural o histórico",
                "Ideal para tomar fotos sin tanto sol"
            ];

        case "Snow":
            return [
                "Actividades en nieve: ski o snowboard",
                "Abrígate bien y disfruta bebidas calientes",
                "Visita mercados navideños o centros cerrados"
            ];

        case "Thunderstorm":
            return [
                "Evita actividades al aire libre",
                "Quédate en lugares seguros y cerrados",
                "Buen momento para spas o centros comerciales"
            ];

        default:
            return [
                "Explora lugares turísticos populares",
                "Consulta actividades locales",
                "Disfruta tu viaje con precaución"
            ];
    }
}
