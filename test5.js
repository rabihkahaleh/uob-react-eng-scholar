const axios = require('axios');
const API_KEY = '644b2cf02fa73fc0bd598e69c3475bb7';
const BASE_URL = 'https://api.elsevier.com/content';

(async () => {
    try {
        const query = 'AFFIL("University of Balamand") AND SUBJAREA(ENGI)';
        const countUrl = `${BASE_URL}/search/scopus?query=${encodeURIComponent(query)}&apiKey=${API_KEY}&count=1`;
        const resCount = await axios.get(countUrl, { headers: { 'Accept': 'application/json' } });
        console.log('Papers in ENGI for Balamand:', resCount.data['search-results']['opensearch:totalResults']);
    } catch (e) { console.error('Error:', e.response ? e.response.status + ' ' + JSON.stringify(e.response.data) : e.message); }
})();
