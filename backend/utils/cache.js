let cache = {};
let cacheTimestamp = null;

const CACHE_TILL = 5 * 60 * 1000; // 5 minutes

function isCacheValid() {
    if (!cacheTimestamp) return false;
    return (Date.now() - cacheTimestamp) < CACHE_TILL;
}

function getCache() {
    return cache;
}

function setCache(data) {
    cache = data;
    cacheTimestamp = Date.now();
}

module.exports = {
    isCacheValid,
    getCache,
    setCache
};