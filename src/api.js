import axios from "axios";
import { parseStringPromise } from "xml2js";

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export async function fetchXML(endpoint) {
  try {
    const url = IS_PRODUCTION
      ? `proxy.aspx?endpoint=${encodeURIComponent(endpoint)}`
      : `/rest${endpoint}`;

    const res = await axios.get(url, {
      headers: { "Accept": "application/xml" },
      timeout: 30000
    });
    return parseStringPromise(res.data, { explicitArray: false });
  } catch (err) {
    if (err.response) {
      console.error(`API error ${err.response.status} for ${endpoint}`);
    } else if (err.code === "ERR_NETWORK") {
      console.error(`CORS or network error for ${endpoint} — the DSpace server may not allow cross-origin requests from this domain.`);
    } else {
      console.error(`Request failed for ${endpoint}:`, err.message);
    }
    throw err;
  }
}

export async function getDepartments() {
  const data = await fetchXML("/communities/5/collections");
  return data?.collections?.collection || [];
}

export async function getArticles(collectionId, totalExpected = 1000) {
  const PAGE_SIZE = 100;
  let allItems = [];
  let offset = 0;

  while (offset < totalExpected) {
    const data = await fetchXML(
      `/collections/${collectionId}/items?expand=metadata&limit=${PAGE_SIZE}&offset=${offset}`
    );
    const items = data?.items?.item;
    if (!items) break;
    const batch = Array.isArray(items) ? items : [items];
    allItems = allItems.concat(batch);
    if (batch.length < PAGE_SIZE) break; // no more pages
    offset += PAGE_SIZE;
  }

  return allItems;
}

export async function getArticleMetadata(itemId) {
  const data = await fetchXML(`/items/${itemId}/metadata`);
  return data?.metadataEntries?.metadataentry || [];
}