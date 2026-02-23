// Fetch Station Data

const axios = require("axios");

const DID_URL = "https://publicinfobanjir.water.gov.my/wp-content/themes/enlighten/data/latestreadingstrendabc.json";

async function fetchStationData() {
    const response = await axios.get(DID_URL);
    return response.data;
}

module.exports = { fetchStationData };
