import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyC-dlBOBCaCbGomvYwG38_QSLW4fqKsTLU',
  authDomain: 'nyxgrid-9bcd1.firebaseapp.com',
  projectId: 'nyxgrid-9bcd1',
  storageBucket: 'nyxgrid-9bcd1.firebasestorage.app',
  messagingSenderId: '430728615117',
  appId: '1:430728615117:web:7bb9e7ce73ffdd69624584',
  measurementId: 'G-HLMR2PEMVR',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
