// Firebase initialization (modular SDK)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBB77MsGymDxKH0OD07SArGQim95qMnSH4",
  authDomain: "intell-fae56.firebaseapp.com",
  projectId: "intell-fae56",
  storageBucket: "intell-fae56.firebasestorage.app",
  messagingSenderId: "286667291699",
  appId: "1:286667291699:web:0252ac76e2c18ea3317746",
  measurementId: "G-2WPSR7038D",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Analytics may not be available in all environments (SSR). Wrap in try/catch.
let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // ignore - analytics not available (e.g. during SSR or if disabled)
}

export { analytics };

// Firestore database
export const db = getFirestore(app);
