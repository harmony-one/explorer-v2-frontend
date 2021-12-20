export enum IndexedDbStore {
  ERC1155Pool = 'ERC1155_Pool',
  ERC20Pool = 'ERC20_Pool',
  ERC721Pool = 'ERC721_Pool',
}

export const IndexedDbKeyPath = '_id'

const DbVersion = 1

export const saveToIndexedDB = (storeName: IndexedDbStore, objects: any[]) => {
  return new Promise(
    function(resolve, reject) {
      const dbRequest = indexedDB.open(storeName, DbVersion);

      dbRequest.onerror = function() {
        reject(Error('IndexedDB error'));
      };

      dbRequest.onupgradeneeded = function(event) {
        // @ts-ignore
        const db = event.target.result;
        db.createObjectStore(storeName, { keyPath: IndexedDbKeyPath });
      };

      dbRequest.onsuccess = function() {
        let db = dbRequest.result;
        db.onversionchange = function() {
          db.close();
          console.log('Database is outdated, please reload the page');
        };
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        objects.forEach((item, i, arr) => {
          const objectRequest = objectStore.put(item);
          if (i === arr.length - 1) {
            objectRequest.onsuccess = function() {
              resolve('Data saved');
            };
          }
        })
      };

      dbRequest.onblocked = function() {
        reject(Error(`IndexedDB ${storeName} is blocked`));
      };
    }
  );
}

export const loadFromIndexedDB = (storeName: IndexedDbStore): Promise<any[]> => {
  return new Promise(
    function(resolve, reject) {
      const dbRequest = indexedDB.open(storeName, DbVersion);

      dbRequest.onerror = function() {
        reject(Error('IndexedDB error'));
      };

      dbRequest.onupgradeneeded = function(event) {
        // @ts-ignore
        event.target.transaction.abort();
        reject(Error('Not found'));
      };

      dbRequest.onsuccess = function(event) {
        // @ts-ignore
        const database = event.target.result;
        const transaction = database.transaction([storeName]);
        const objectStore = transaction.objectStore(storeName);
        const objectRequest = objectStore.getAll();

        objectRequest.onerror = function(e: Error) {
          reject(Error(`Indexed db error: ${e.message}`));
        };

        objectRequest.onsuccess = function(event: any) {
          if (objectRequest.result) resolve(objectRequest.result);
          else reject(Error('Objects is not found'));
        };
      };
    }
  );
}
