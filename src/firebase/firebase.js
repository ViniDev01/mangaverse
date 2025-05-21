// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, browserLocalPersistence  } from "firebase/auth";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB3WjlOXQ0huGX0lcyZBlq8YpDRyboYvNM",
  authDomain: "mangaverse-15342.firebaseapp.com",
  projectId: "mangaverse-15342",
  storageBucket: "mangaverse-15342.firebasestorage.app",
  messagingSenderId: "93181777027",
  appId: "1:93181777027:web:97c53aa432b3f52ae5f7b6",
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Auth + Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Configurar persistência em memória (opcional, mas útil em testes ou apps SSR)
auth.setPersistence(browserLocalPersistence ).catch((error) => {
  console.error("Erro ao configurar persistência:", error);
});

// Exporta os serviços
export { auth, db };

export default app;
