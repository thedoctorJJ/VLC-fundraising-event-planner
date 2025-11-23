imainmport React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Function to safely initialize the application
function initializeApp() {
 const rootElement = document.getElementById('root');
 if (rootElement) {
   ReactDOM.createRoot(rootElement).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
 } else {
   console.error("Root element #root not found in the document.");
 }
}

// Start the application after the document loads
document.addEventListener('DOMContentLoaded', initializeApp);