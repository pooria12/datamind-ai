import type {
  StoredDataset,
} from "@/types/dataset.types";
import { getDatabase, isIndexedDBAvailable } from "./database";

const STORE_NAME = "datasets";

export interface DatasetRepository {
  save(dataset: StoredDataset): Promise<void>;
  get(id: string): Promise<StoredDataset | null>;
  getAll(): Promise<StoredDataset[]>;
  getRecords(id: string): Promise<Array<Record<string, string>> | null>;
  delete(id: string): Promise<void>;
  getActive(): Promise<StoredDataset | null>;
  setActive(id: string): Promise<void>;
  clearActive(): Promise<void>;
}

class IndexedDBDatasetRepository implements DatasetRepository {
  private async getStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await getDatabase();
    const tx = db.transaction(STORE_NAME, mode);
    return tx.objectStore(STORE_NAME);
  }

  async save(dataset: StoredDataset): Promise<void> {
    if (!isIndexedDBAvailable()) {
      throw new Error("IndexedDB is not available in this browser");
    }
    const store = await this.getStore("readwrite");
    return new Promise((resolve, reject) => {
      const request = store.put(dataset);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get(id: string): Promise<StoredDataset | null> {
    if (!isIndexedDBAvailable()) return null;
    const store = await this.getStore("readonly");
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(): Promise<StoredDataset[]> {
    if (!isIndexedDBAvailable()) return [];
    const store = await this.getStore("readonly");
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(id: string): Promise<void> {
    if (!isIndexedDBAvailable()) return;
    const store = await this.getStore("readwrite");
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getActive(): Promise<StoredDataset | null> {
    if (!isIndexedDBAvailable()) return null;
    const datasets = await this.getAll();
    if (datasets.length === 0) return null;
    datasets.sort((a, b) => {
      const aTime = new Date(a.savedAt).getTime();
      const bTime = new Date(b.savedAt).getTime();
      return bTime - aTime;
    });
    return datasets[0];
  }

  async setActive(id: string): Promise<void> {
    const dataset = await this.get(id);
    if (!dataset) return;
    await this.save({ ...dataset, savedAt: new Date().toISOString() });
  }

  async getRecords(id: string): Promise<Array<Record<string, string>> | null> {
    if (!isIndexedDBAvailable()) return null;
    const stored = await this.get(id);
    if (!stored) return null;
    return stored.records;
  }

  async clearActive(): Promise<void> {
    const active = await this.getActive();
    if (active) {
      await this.delete(active.id);
    }
  }
}

export const datasetRepository = new IndexedDBDatasetRepository();
