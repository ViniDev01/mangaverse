import { useState, useEffect, useCallback } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const useMostViewedMangas = () => {
  const [mostViewed, setMostViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapters, setChapters] = useState({});

  // Memoize the fetchChapters function to prevent unnecessary recreations
  const fetchChapters = useCallback(async (mangaId) => {
    try {
      const chaptersRef = collection(
        db,
        "containerMangas",
        mangaId,
        "chapters"
      );
      const querySnapshot = await getDocs(chaptersRef);

      const chaptersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Ordena capítulos por número (assumindo que há um campo 'number')
      chaptersData.sort((a, b) => b.number - a.number);

      setChapters((prev) => ({
        ...prev,
        [mangaId]: chaptersData,
      }));
    } catch (err) {
      console.error("Erro ao buscar capítulos:", err);
      // You might want to setError here if you want to surface chapter errors
    }
  }, []);

  useEffect(() => {
    const fetchMostViewed = async () => {
      try {
        setLoading(true);
        setError(null);

        const mangasRef = collection(db, "containerMangas");
        const q = query(mangasRef, orderBy("views", "desc"), limit(10));

        const querySnapshot = await getDocs(q);
        const mangas = [];

        // Process all mangas first
        querySnapshot.forEach((doc) => {
          mangas.push({ id: doc.id, ...doc.data() });
        });

        setMostViewed(mangas);

        // Then fetch chapters for all mangas in parallel
        const chapterPromises = mangas.map((manga) => fetchChapters(manga.id));
        await Promise.all(chapterPromises);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMostViewed();
  }, [fetchChapters]); // Add fetchChapters to dependencies

  return { mostViewed, chapters, loading, error };
};
