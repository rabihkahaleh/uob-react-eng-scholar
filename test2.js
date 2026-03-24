const axios = require('axios');
const API_KEY = '644b2cf02fa73fc0bd598e69c3475bb7';
const BASE_URL = 'https://api.elsevier.com/content';

(async () => {
    const dept = { id: 'civil', name: 'Department of Civil Engineering', kw: 'Civil' };
    try {
        let start = 0;
        let totalAuthors = 1;
        let auIds = [];
        const query = `AFFIL("University of Balamand") AND ALL("${dept.kw}")`;

        while (start < totalAuthors && start < 500) {
            const authUrl = `${BASE_URL}/search/author?query=${encodeURIComponent(query)}&apiKey=${API_KEY}&count=100&start=${start}`;
            console.log("authUrl:", authUrl);
            const authRes = await axios.get(authUrl, { headers: { 'Accept': 'application/json' } });

            const results = authRes.data['search-results'];
            totalAuthors = parseInt(results['opensearch:totalResults'] || '0', 10);
            console.log('totalAuthors for', dept.kw, ':', totalAuthors);

            const authors = results.entry || [];
            if (authors.length === 0) break;

            const ids = authors.map(a => a['dc:identifier'] ? a['dc:identifier'].replace('AUTHOR_ID:', '') : null).filter(Boolean);
            auIds = auIds.concat(ids);

            start += 100;
        }
        console.log('Got', auIds.length, 'auIds');
    } catch (e) { console.error('Error:', e.response ? e.response.status + ' ' + JSON.stringify(e.response.data) : e.message); }
})();
