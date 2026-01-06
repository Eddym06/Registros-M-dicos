// Background Service Worker for Chrome Extension
// Gestiona la apertura de la app y el inicio del servidor

const APP_URL = 'http://localhost:5847';
const SERVER_URL = 'http://localhost:5847';
const NATIVE_HOST_NAME = 'com.medicalrecords.host';

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${SERVER_URL}/api`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Try to start server via Native Messaging
async function startServerViaHost() {
  return new Promise((resolve) => {
    try {
      console.log('Sending native message to:', NATIVE_HOST_NAME);
      chrome.runtime.sendNativeMessage(
        NATIVE_HOST_NAME,
        { command: 'start_server' },
        (response) => {
          if (chrome.runtime.lastError) {
            const errorMsg = chrome.runtime.lastError.message || JSON.stringify(chrome.runtime.lastError);
            console.error('Native messaging error:', errorMsg);
            console.error('Full error object:', chrome.runtime.lastError);
            resolve({ 
              success: false, 
              error: errorMsg
            });
          } else {
            console.log('Native message response:', response);
            resolve(response || { success: false, error: 'No response from native host' });
          }
        }
      );
    } catch (error) {
      console.error('Exception in startServerViaHost:', error);
      resolve({ success: false, error: error.message });
    }
  });
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startServer') {
    startServerViaHost().then(response => {
      sendResponse(response);
    });
    return true; // Will respond asynchronously
  }
  
  if (request.action === 'checkServer') {
    checkServer().then(isOnline => {
      sendResponse({ isOnline });
    });
    return true;
  }
});

// Initialize on extension install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('🏥 Medical Records Extension installed');
  
  const serverOnline = await checkServer();
  if (serverOnline) {
    console.log('✅ Servidor FastAPI detectado y disponible');
  } else {
    console.log('⚠️ Servidor offline. El usuario puede iniciarlo desde el popup.');
  }
});

console.log('🏥 Medical Records Extension - Service Worker iniciado');
