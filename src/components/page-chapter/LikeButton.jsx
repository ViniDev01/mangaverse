// LikeButton.jsx
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig"; // seu arquivo de config do Firebase
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  deleteField,
} from "firebase/firestore";
import { ThumbsUp } from "lucide-react";

export default function LikeButton({ mangaId, chapterId, userId }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchChapterData = async () => {
      if (!userId) return;

      const chapterRef = doc(
        db,
        "containerMangas",
        mangaId,
        "chapters",
        chapterId
      );
      try {
        const chapterDoc = await getDoc(chapterRef);
        if (chapterDoc.exists()) {
          const data = chapterDoc.data();
          setLikeCount(data.likeCount || 0);
          setIsLiked(data.likes?.[userId] || false);
        }
      } catch (error) {
        console.error("Erro ao buscar likes:", error);
      }
    };

    fetchChapterData();
  }, [mangaId, chapterId, userId]);

  const handleLikeToggle = async () => {
    if (!userId || isProcessing) return;
    setIsProcessing(true);

    const chapterRef = doc(
      db,
      "containerMangas",
      mangaId,
      "chapters",
      chapterId
    );

    try {
      if (isLiked) {
        await updateDoc(chapterRef, {
          [`likes.${userId}`]: deleteField(),
          likeCount: increment(-1),
        });
        setLikeCount((prev) => prev - 1);
      } else {
        await updateDoc(chapterRef, {
          [`likes.${userId}`]: true,
          likeCount: increment(1),
        });
        setLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Erro ao atualizar like:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`reaction-item ${isLiked ? "ativo" : ""} ${isProcessing ? "disable" : ""}`}
      onClick={handleLikeToggle}
      style={{ pointerEvents: isProcessing ? "none" : "auto", opacity: isProcessing ? 0.5 : 1 }}
    >
      <ThumbsUp />
      <span>{likeCount}</span>
      <span>gostei</span>
    </div>
  );
}
