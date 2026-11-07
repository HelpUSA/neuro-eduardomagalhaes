// Armazenamento persistente de alta capacidade (IndexedDB) para arquivos PDF prontos e assinados
// Garante que PDFs com timbrado e gráficos (mesmo > 2MB) fiquem salvos para download pelo paciente no Portal

const DB_NAME = 'NeuroEduardoPdfVaultDB';
const DB_VERSION = 1;
const STORE_NAME = 'signed_pdfs';

const openVaultDb = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
};

export const savePdfToVault = async (id, pdfDataUrl, tracingsDataUrl = null) => {
  try {
    const db = await openVaultDb();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({
        id,
        pdfDataUrl: pdfDataUrl || null,
        tracingsDataUrl: tracingsDataUrl || null,
        updatedAt: Date.now()
      });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn('Erro ao salvar PDF no IndexedDB Vault:', e);
    return false;
  }
};

export const getPdfFromVault = async (id) => {
  try {
    const db = await openVaultDb();
    if (!db || !id) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    console.warn('Erro ao ler PDF do IndexedDB Vault:', e);
    return null;
  }
};

export const deletePdfFromVault = async (id) => {
  try {
    const db = await openVaultDb();
    if (!db || !id) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn('Erro ao excluir PDF do IndexedDB Vault:', e);
    return false;
  }
};
