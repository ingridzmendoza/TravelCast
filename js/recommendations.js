export function getRecommendations(weather) {
    switch (weather) {
        case "Clear":
            return ["Ideal para playa", "Tour al aire libre", "Visita parques"];
        case "Rain":
            return ["Visita museos", "Cafés y restaurantes", "Centro comercial"];
        case "Clouds":
            return ["Caminata ligera", "Tour cultural", "Explorar la ciudad"];
        case "Snow":
            return ["Actividades en nieve", "Chocolate caliente", "Abrígate bien"];
        default:
            return ["Explora lugares turísticos", "Consulta actividades locales"];
    }
}
