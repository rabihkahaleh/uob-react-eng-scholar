const axios = require('axios');
const API_KEY = '644b2cf02fa73fc0bd598e69c3475bb7';
const BASE_URL = 'https://api.elsevier.com/content';

(async () => {
    try {
        const test = async (subj, expectedName) => {
            const url = `${BASE_URL}/search/author?query=${encodeURIComponent('AFFIL("University of Balamand") AND SUBJAREA(' + subj + ')')}&apiKey=${API_KEY}&count=1`;
            const r = await axios.get(url, { headers: { 'Accept': 'application/json' } });
            console.log(subj, ':', r.data['search-results']['opensearch:totalResults']);
        }
        await test('ENGI', "Engineering");
        await test('COMP', "Computer");
        await test('CENG', "Chemical");
        await test('EART', "Civil/Earth");
        await test('MATE', "Materials");
    } catch (e) { console.error('Error:', e.response ? e.response.status + ' ' + JSON.stringify(e.response.data) : e.message); }
})();
