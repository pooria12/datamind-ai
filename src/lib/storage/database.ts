import { STORAGE_VERSION } from "@/types/dataset.types";

const DB_NAME = "DataMindAI";
const DB_VERSION = STORAGE_VERSION;
const STORE_NAME = "datasets";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("Failed to open IndexedDB database"));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("savedAt", "savedAt", { unique: false });
      }
    };
  });

  return dbPromise;
}

export async function getDatabase(): Promise<IDBDatabase> {
  return openDatabase();
}

export async function closeDatabase(): Promise<void> {
  const db = await openDatabase();
  db.close();
  dbPromise = null;
}

export function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}
