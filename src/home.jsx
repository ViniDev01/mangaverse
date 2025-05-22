import { useState, useEffect } from "react";
import { db } from "./firebase/firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";
import Header from "./components/page-home/header.jsx";
import Banner from "./components/page-home/banner.jsx";
import MostViewed from "./components/page-home/mostViewed.jsx";
import Filter from "./components/page-home/filter.jsx";
import Cards from "./components/page-home/cards.jsx";
import Footer from "./components/page-home/footer.jsx";
import "./css/home.css";
import Login from "./components/modal-login/login.jsx";

function Home() {
  const [mangas, setMangas] = useState([]);
  const [chapters, setChapters] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredMangas, setFilteredMangas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const fetchMangas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "containerMangas"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMangas(data);
      setFilteredMangas(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar mangás:", error);
      setError("Erro ao carregar mangás. Tente recarregar a página.");
      setIsLoading(false);
    }
  };

  const fetchChapters = async (mangaId) => {
    try {
      const chaptersRef = await getDocs(
        collection(db, "containerMangas", mangaId, "chapters")
      );
      const chaptersData = chaptersRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      chaptersData.sort((a, b) => (b.number || 0) - (a.number || 0));

      setChapters((prev) => ({
        ...prev,
        [mangaId]: chaptersData,
      }));
    } catch (error) {
      console.log(`Erro ao buscar capítulos do mangá ${mangaId}:`, error);
    }
  };

  const handleFilterChange = (category) => {
    setActiveFilter(category);
    setFilteredMangas(
      category === "all"
        ? mangas
        : mangas.filter((manga) => manga.category === category)
    );
  };

  useEffect(() => {
    fetchMangas();
  }, []);

  useEffect(() => {
    if (mangas.length > 0) {
      // Limita o número de requisições simultâneas
      const batchSize = 5;
      for (let i = 0; i < mangas.length; i += batchSize) {
        const batch = mangas.slice(i, i + batchSize);
        batch.forEach((manga) => fetchChapters(manga.id));
      }
    }
  }, [mangas]);

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Carregando mangás...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchMangas}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <>
      <Header openLogin={openLogin} />
      <Banner />
      <MostViewed />
      <Filter activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      <Cards mangas={filteredMangas} chapters={chapters} />
      <Footer />
      <Login isOpen={isLoginOpen} onClose={closeLogin} />
    </>
  );
}

export default Home;
