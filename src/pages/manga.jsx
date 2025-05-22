import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig.js"; // Importe a configuração do Firebase
import { doc, getDoc, collection, getDocs } from "firebase/firestore"; // Importe doc e getDoc
import { useParams } from "react-router-dom"; // Importe useParams
import Header from "../components/page-home/header.jsx";
import ContentManga from "../components/page-manga/contentManga.jsx";
import Login from "../components/modal-login/login.jsx";
function Manga() {
  const { id } = useParams(); // Captura o parâmetro da URL
  const [manga, setManga] = useState(null); // Estado para armazenar os dados do mangá
  const [chapters, setChapters] = useState([]); // Estado para armazenar os capítulos
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para armazenar erros
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  // Função para buscar os dados do Firestore
  const fetchManga = async () => {
    try {
      const docRef = doc(db, "containerMangas", id); // Referência ao documento com o ID específico
      const docSnap = await getDoc(docRef); // Busca o documento

      if (docSnap.exists()) {
        setManga(docSnap.data()); // Armazena os dados do mangá no estado
      } else {
        console.log("Nenhum mangá encontrado com esse ID.");
      }
    } catch (error) {
      setError("Erro ao buscar dados do mangá.");
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  // Função para buscar os capítulos do manga
  const fetchChapters = async () => {
    try {
      const chaptersRef = collection(db, "containerMangas", id, "chapters"); // Referencia à subColeção de capítulos
      const querySnapshot = await getDocs(chaptersRef); // Buscar todos os documentos subColeção

      const chaptersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChapters(chaptersData);
    } catch (error) {
      console.log("Erro ao buscar capítulos:", error);
    }
  };

  // Busca os dados quando o componente é montado ou quando o ID muda
  useEffect(() => {
    fetchManga();
    fetchChapters();
  }, [id]);

  // Exibe uma mensagem de carregamento enquanto os dados são buscados
  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!manga) {
    return <p>Carregando informações do mangá...</p>;
  }

  const openLogin = () => setIsLoginVisible(true);
  const closeLogin = () => setIsLoginVisible(false);

  return (
    <>
      <Header openLogin={openLogin} />
      <ContentManga manga={manga} chapters={chapters} />
      <Login isOpen={isLoginVisible} isClose={closeLogin} />
    </>
  );
}

export default Manga;
