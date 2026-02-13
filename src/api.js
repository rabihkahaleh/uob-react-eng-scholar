import axios from "axios";
import { parseStringPromise } from "xml2js";

const BASE_URL = "/rest";

export async function fetchXML(endpoint) {
  const res = await axios.get(`${BASE_URL}${endpoint}`, {
    headers: { "Accept": "application/xml" }
  });
  return parseStringPromise(res.data, { explicitArray: false });
}

export async function getDepartments() {
  const data = await fetchXML("/communities/5/collections");
  return data?.collections?.collection || [];
}

export async function getArticles(collectionId, limit = 10000) {
  const data = await fetchXML(`/collections/${collectionId}/items?expand=metadata&limit=${limit}`);
  return data?.items?.item || [];
}

export async function getArticleMetadata(itemId) {
  const data = await fetchXML(`/items/${itemId}/metadata`);
  return data?.metadataEntries?.metadataentry || [];
}