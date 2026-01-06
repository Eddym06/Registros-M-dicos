// Popup script for Medical Records Chrome Extension
const APP_URL = 'http://localhost:5847';
const SERVER_URL = 'http://localhost:5847';

const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const openButton = document.getElementById('openButton');
const startButton = document.getElementById('startButton');
const info = document.getElementById('info');

// Check server status
async function checkServer() {
  try {
    const response = await fetch(`${SERVER_URL}/api`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      // Server is online
      statusDot.className = 'status-dot online';
      statusText.className = 'status-text online';
      statusText.textContent = '✓ Servidor conectado';
      openButton.disabled = false;
      startButton.style.display = 'none';
      info.classList.remove('show');
      return true;
    } else {
      throw new Error('Server unavailable');
    }
  } catch (error) {
    // Server is offline
    statusDot.className = 'status-dot offline';
    statusText.className = 'status-text offline';
    statusText.textContent = '✗ Servidor desconectado';
    openButton.disabled = true;
    startButton.style.display = 'block';
    info.classList.add('show');
    return false;
  }
}

// Open the medical records app
function openApp() {
  chrome.tabs.create({ url: APP_URL });
  window.close();
}

// Start server via background script (Native Messaging)
async function startServer() {
  startButton.disabled = true;
  startButton.innerHTML = '<span class="button-icon">⏳</span><span>Iniciando...</span>';
  
  chrome.runtime.sendMessage({ action: 'startServer' }, (response) => {
    if (response && response.success) {
      statusText.textContent = '🔄 Servidor iniciándose...';
      statusDot.className = 'status-dot checking';
      
      // Wait and check
      setTimeout(() => {
        checkServer();
        startButton.disabled = false;
        startButton.innerHTML = '<span class="button-icon">🚀</span><span>Iniciar Servidor</span>';
      }, 3000);
    } else {
      alert('Error al iniciar servidor: ' + (response?.error || 'Unknown error'));
      startButton.disabled = false;
      startButton.innerHTML = '<span class="button-icon">🚀</span><span>Iniciar Servidor</span>';
    }
  });
}

// Event listeners
openButton.addEventListener('click', openApp);
startButton.addEventListener('click', startServer);

// Check server status on popup open
checkServer();

// Recheck every 2 seconds while popup is open
setInterval(checkServer, 2000);
