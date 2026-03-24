const axios = require('axios');

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function test(keyword) {
    try {
        const authUrl = `https://api.elsevier.com/content/search/author?query=${encodeURIComponent('AFFIL("University of Balamand" AND "' + keyword + '")')}&apiKey=644b2cf02fa73fc0bd598e69c3475bb7&count=200`;
        const res = await axios.get(authUrl, { headers: { 'Accept': 'application/json' } });
        const authors = res.data['search-results']?.entry || [];
        console.log(`Found ${authors.length} authors for ${keyword}`);

        const ids = authors.map(a => a['dc:identifier'] ? a['dc:identifier'].replace('AUTHOR_ID:', '') : null).filter(Boolean);
        return ids;
    } catch (err) {
        console.error(err.message);
        return [];
    }
}

async function run() {
    const depts = ['Civil', 'Mechanical', 'Electrical', 'Computer', 'Chemical'];
    for (const d of depts) {
        await test(d);
        await delay(1000); // Wait 1 second between requests
    }
}
run();
