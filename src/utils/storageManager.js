// Get total localStorage quota (varies by browser)
export const getStorageQuota = () => {
  // Estimate quota (typical browser minimum)
  return 5 * 1024 * 1024; // 5MB in bytes
};

// Define max storage we want to use (95% of quota to leave buffer)
export const MAX_STORAGE_SIZE = getStorageQuota() * 0.95; // About 4.75MB

// Calculate current storage usage
export const getCurrentStorageUsage = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += (localStorage[key].length + key.length) * 2; // in bytes
    }
  }
  return total;
};

// Check if we can store additional data
export const canStoreData = (newDataSize) => {
  const currentUsage = getCurrentStorageUsage();
  return currentUsage + newDataSize <= MAX_STORAGE_SIZE;
};

// Get storage usage percentage
export const getStoragePercentage = () => {
  return (getCurrentStorageUsage() / getStorageQuota()) * 100;
};