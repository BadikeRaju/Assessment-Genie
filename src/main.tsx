import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = "588392418317-p74n04nuo7kbkb8hmva1nq6bgb2qm782.apps.googleusercontent.com" // Your Google Client ID

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
