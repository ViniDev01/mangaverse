// src/services/likeService.js
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const toggleLike = async (chapterId, userId) => {
  const likeRef = doc(db, "chapters", chapterId, "likes", userId);
  const snapshot = await getDoc(likeRef);

  if (snapshot.exists()) {
    await deleteDoc(likeRef); // deslike
    return false;
  } else {
    await setDoc(likeRef, { liked: true });
    return true;
  }
};

export const checkIfLiked = async (chapterId, userId) => {
  const likeRef = doc(db, "chapters", chapterId, "likes", userId);
  const snapshot = await getDoc(likeRef);
  return snapshot.exists();
};
