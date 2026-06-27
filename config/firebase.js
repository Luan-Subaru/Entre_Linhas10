// funcoes do banco firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// chaves do próprio banco:
const firebaseConfig = {
  apiKey: "AIzaSyCT02DAAAhhFE2fi-jU9VVj4UOvxFAVtHM",
  authDomain: "entre-linhas010.firebaseapp.com",
  projectId: "entre-linhas010",
  storageBucket: "entre-linhas010.firebasestorage.app",
  messagingSenderId: "551686050631",
  appId: "1:551686050631:web:909aa2838cd99a1e1bb262",
  measurementId: "G-KS9MQLP2ZS"
};

// inicialização
const app = initializeApp(firebaseConfig);

// Prepara a Autenticação login e o banco de dados para a gente usar depois
export const auth = getAuth(app);
export const db = getFirestore(app);