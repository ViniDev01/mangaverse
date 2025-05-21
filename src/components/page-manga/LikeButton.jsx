// LikeButton.jsx
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase"; // seu arquivo de config do Firebase
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  deleteField,
} from "firebase/firestore";
import { ThumbsUp } from "lucide-react";

export default function LikeButton({ mangaId, chapterId, userId }) {
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
    if (!userId) return;

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
    }
  };

  return (
    <div
      className={`reaction-item ${isLiked ? "ativo" : ""}`}
      onClick={handleLikeToggle}
    >
      <ThumbsUp />
      <span>{likeCount}</span>
      <span>gostei</span>
    </div>
  );
}
