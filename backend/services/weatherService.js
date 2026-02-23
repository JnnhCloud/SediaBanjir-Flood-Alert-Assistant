// Thunderstorm

const axios = require("axios");

const WEATHER_URL = "https://publicinfobanjir.water.gov.my/wp-content/themes/enlighten/data/met_thunderain.json";

async function fetchThunderstormData() {
    const response = await axios.get(WEATHER_URL);
    return response.data;
}

module.exports = { fetchThunderstormData  };
