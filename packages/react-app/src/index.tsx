import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Fonction pour envoyer la couverture au serveur à la fin des tests E2E
function setupCoverage() {
  if (process.env.REACT_APP_COVERAGE) {
    // @ts-ignore
    if (typeof window.__coverage__ !== 'undefined') {
      const originalBeforeUnload = window.onbeforeunload;
      window.onbeforeunload = function() {
        // Envoyer la couverture au serveur
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/coverage/client', false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        // @ts-ignore
        xhr.send(JSON.stringify(window.__coverage__));
        
        if (originalBeforeUnload) {
          return originalBeforeUnload.apply(this, arguments);
        }
      };
      
      console.log('Instrumentation de couverture activée');
    }
  }
}

setupCoverage();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
