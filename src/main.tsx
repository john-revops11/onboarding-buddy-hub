
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const root = document.getElementById("root");

if (root) {
  // Ensure React is properly imported before creating root
  const reactRoot = ReactDOM.createRoot(root);
  
  // Wrap with React.StrictMode without nested React elements
  reactRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
