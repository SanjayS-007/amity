import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export type CreateAlertInput = {
  title: string;
  message?: string;
  place: string;
  intensity: string; // e.g. "Low", "Medium", "High" or numeric string
  color: "red" | "orange" | "yellow" | "green" | string; // red/orange as requested
  createdBy?: string; // optional metadata
};

export async function createAlert(data: CreateAlertInput) {
  const alertsCol = collection(db, "alerts");
  const docRef = await addDoc(alertsCol, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef;
}
