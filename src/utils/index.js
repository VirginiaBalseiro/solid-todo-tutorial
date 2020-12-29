// utils/index.js

import {
  createSolidDataset,
  getSolidDataset,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";

export async function getOrCreateTodoList(containerUri, fetch) {
  const indexUrl = `${containerUri}index.ttl`;
  try {
    const todoList = await getSolidDataset(indexUrl, { fetch });
    return todoList;
  } catch (error) {
    if (error.statusCode === 404) {
      const todoList = await saveSolidDatasetAt(
        indexUrl,
        createSolidDataset(),
        {
          fetch,
        }
      );
      return todoList;
    }
  }
}
