import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import Header from "../components/page-home/header";
import { useConfig } from "../context/ConfigContext";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  MessageCircleMore,
  SendHorizontal,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import LikeButton from "../components/page-chapter/LikeButton";
import Title from "../components/page-chapter/title";
import ChapterSelector from "../components/page-chapter/ChapterSelector";
import ModoLeitura from "../components/page-chapter/ModoLeitura";
import PageSelector from "../components/page-chapter/PageSelector";
import PageNavigation from "../components/page-chapter/PageNavigation";
import ChapterNavigation from "../components/page-chapter/ChapterNavigation";
import ChapterPageViewer from "../components/page-chapter/ChapterPageViewer";
import CommentToggleButton from "../components/page-chapter/CommentToggleButton";
import ReaderNavigation from "../components/page-chapter/ReaderNavigation";
import ChapterSelectorTwo from "../components/page-chapter/ChapterSelectorTwo"; 
import CommentsPanel from "../components/page-chapter/CommentsPanel";                     

function ChapterPage() {
  const navigate = useNavigate(); // Importa o hook useNavigate para navegação
  const { mangaId, chapterId: currentChapterId } = useParams(); // Desestrutura os parâmetros mangaId e chapterId da URL
  const [manga, setManga] = useState(null); // Inicializa o estado do mangá como nulo
  const [chapter, setChapter] = useState(null); // Inicializa o estado do capítulo como nulo
  const [allChapters, setAllChapters] = useState([]); // Inicializa o estado de todos os capítulos como um array vazio
  const [loading, setLoading] = useState(true); // Inicializa o estado de carregamento como verdadeiro
  const [modo, setModo] = useState("horizontal");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const { user } = useUser();
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Define o estado de carregamento como verdadeiro

        // Busca os dados do mangá e capítulos em paralelo
        const mangaRef = doc(db, "containerMangas", mangaId); // Referência ao documento do mangá
        const [mangaSnap, chaptersSnap] = await Promise.all([
          getDoc(mangaRef),
          getDocs(
            query(
              collection(db, "containerMangas", mangaId, "chapters"),
              orderBy("number", "desc")
            )
          ), // Referência à coleção de capítulos do mangá, ordenada pelo número do capítulo em ordem decrescente
        ]); // Referência à coleção de capítulos do mangá, ordenada pelo número do capítulo em ordem decrescente

        // Define os dados do mangá
        if (mangaSnap.exists()) {
          setManga({ id: mangaSnap.id, ...mangaSnap.data() }); // Define o estado do mangá com os dados obtidos
        } else {
          setManga(null); // Se o mangá não existir, define o estado como nulo
          return; // Sai da função
        }

        // Define a lista de todos os capítulos
        const chaptersData = chaptersSnap.docs.map((doc) => ({
          id: doc.id, // // Obtém o ID do capítulo
          ...doc.data(), // // Mapeia os dados dos capítulos obtidos para um array de objetos
        })); // Mapeia os dados dos capítulos obtidos para um array de objetos
        setAllChapters(chaptersData); // Define o estado de todos os capítulos com os dados obtidos

        // Busca o capítulo atual
        const chapterRef = doc(
          db,
          "containerMangas",
          mangaId,
          "chapters",
          currentChapterId
        ); // Referência ao documento do capítulo atual
        const chapterSnap = await getDoc(chapterRef); // Obtém os dados do capítulo atual

        if (!chapterSnap.exists()) {
          // Verifica se o capítulo existe
          setChapter(null); // Se não existir, define o estado do capítulo como nulo
          return; // Sai da função
        }

        let chapterData = { id: chapterSnap.id, ...chapterSnap.data() }; // Obtém os dados do capítulo atual

        // Verifica se as páginas estão no documento ou em uma subcoleção
        if (!chapterData.pages || chapterData.pages.length === 0) {
          // Se as páginas não estiverem no documento ou estiverem vazias
          // Busca páginas da subcoleção
          const pagesQuery = query(
            // Cria uma consulta para buscar as páginas
            collection(
              db,
              "containerMangas",
              mangaId,
              "chapters",
              currentChapterId,
              "pages"
            ), // Referência à subcoleção de páginas do capítulo
            orderBy("order", "asc") // Ordena as páginas pela ordem
          ); // Referência à subcoleção de páginas do capítulo
          const pagesSnap = await getDocs(pagesQuery); // Obtém os dados das páginas
          chapterData.pages = pagesSnap.docs.map((doc) => doc.data()); // Mapeia os dados das páginas obtidas para um array de URLs
        }

        setChapter(chapterData); // Define o estado do capítulo com os dados obtidos
      } catch (error) {
        // Captura erros durante a busca de dados
        console.error("Erro ao buscar dados:", error); // Exibe o erro no console
      } finally {
        // Executa após a busca de dados, independentemente de sucesso ou erro
        setLoading(false); // Define o estado de carregamento como falso
      }
    };

    fetchData(); // Chama a função para buscar os dados
  }, [mangaId, currentChapterId]); // Dependências do useEffect: mangaId e currentChapterId

  const { fontSize, visualizacao } = useConfig();

  const fontSizeClass = {
    small: "text-sm",
    medium: "text-base",
    large: "text-xl",
  }[fontSize];

  const renderPages = () => {
    if (visualizacao === "single") {
      return (
        <div className="pages-container">
          {chapter.pages[currentPageIndex]?.url ? (
            <img
              key={`page-${currentPageIndex}`}
              src={chapter.pages[currentPageIndex].url}
              alt={`Página ${currentPageIndex + 1}`}
              className="chapter-page"
            />
          ) : (
            <p className="chapter-text">
              {chapter.pages[currentPageIndex]?.text ||
                "Conteúdo não disponível"}
            </p>
          )}
        </div>
      );
    } else if (visualizacao === "double") {
      const nextPageIndex = currentPageIndex + 1;

      return (
        <div className="pagina-dupla">
          <div className="pages-container">
            {chapter.pages[currentPageIndex]?.url ? (
              <img
                key={`page-${currentPageIndex}`}
                src={chapter.pages[currentPageIndex].url}
                alt={`Página ${currentPageIndex + 1}`}
                className="chapter-page"
              />
            ) : (
              <p className="chapter-text">
                {chapter.pages[currentPageIndex]?.text ||
                  "Conteúdo não disponível"}
              </p>
            )}
          </div>

          {nextPageIndex < chapter.pages.length && (
            <div className="pagina">
              {chapter.pages[nextPageIndex]?.url ? (
                <img
                  key={`page-${nextPageIndex}`}
                  src={chapter.pages[nextPageIndex].url}
                  alt={`Página ${nextPageIndex + 1}`}
                  className="chapter-page"
                />
              ) : (
                <p className="chapter-text">
                  {chapter.pages[nextPageIndex]?.text ||
                    "Conteúdo não disponível"}
                </p>
              )}
            </div>
          )}
        </div>
      );
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < chapter.pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Rola para o topo da página ao mudar de página
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Rola para o topo da página ao mudar de página
    }
  };

  const handlePrevChapter = () => {
    const currentIndex = allChapters.findIndex(
      (ch) => ch.id === currentChapterId
    );
    const nextChapter = allChapters[currentIndex + 1];
    if (nextChapter) {
      navigate(`/manga/${mangaId}/${nextChapter.id}`);
    }
  };

  const handleNextChapter = () => {
    const currentIndex = allChapters.findIndex(
      (ch) => ch.id === currentChapterId
    );
    const prevChapter = allChapters[currentIndex - 1]; // Capítulos estão ordenados descendentemente
    if (prevChapter) {
      navigate(`/manga/${mangaId}/${prevChapter.id}`);
    }
  };

  console.log("Dados do usuário:", {
    user,
    displayName: user?.displayName,
    isLoggedIn: !!user,
  });

  if (loading) return <div className="loading">Carregando...</div>; // Exibe mensagem de carregamento enquanto os dados estão sendo buscados
  if (!manga) return <div>Mangá não encontrado</div>; // Exibe mensagem se o mangá não for encontrado
  if (!chapter) return <div>Capítulo não encontrado</div>; // Exibe mensagem se o capítulo não for encontrado

  return (
    <div className={`chapter-container ${showComments ? "show" : ""}`}>
      <div className="chapter-left">
        <Header showComments={showComments} />
        <div className="chapter-content">
          <Title 
            mangaId={manga.id}
            mangaTitle={manga.title}
            chapterNumber={chapter.number}
            showComments={showComments}
          />

          <div className={`container-filter-chapter ${showComments ? "show" : ""}`} >
            <div className="box-filter">
              <ChapterSelector
                mangaId={mangaId}
                currentChapterId={currentChapterId}
                allChapters={allChapters}
              />

              <ModoLeitura
                modo={modo}
                setModo={setModo}
              />
            </div>

            <div className="box-reader-navigation">
              {/* Navegação do Leitor */}
              <PageSelector
                currentPageIndex={currentPageIndex}
                setCurrentPageIndex={setCurrentPageIndex}
                chapter={chapter}
              />

              {/* Navegação de Páginas */}
              {modo === "horizontal" ? (
                <PageNavigation
                  currentPageIndex={currentPageIndex}
                  totalPages={chapter.pages.length}
                  handlePrevPage={handlePrevPage}
                  handleNextPage={handleNextPage}
                />
              ) : (
                <ChapterNavigation
                  allChapters={allChapters}
                  currentChapterId={currentChapterId}
                  handlePrevChapter={handlePrevChapter}
                  handleNextChapter={handleNextChapter}
                />
              )}
            </div>
          </div>
          

          <ChapterPageViewer
            chapter={chapter}
            modo={modo}
            showComments={showComments}
            fontSizeClass={fontSizeClass}
            renderPages={renderPages}
          />


        </div>

        
      </div>

      <div className="chapter-right">
        <div className="container-comments">
          <CommentToggleButton 
            setShowComments={setShowComments}
            showComments={showComments}
          />
          <div className={`comments-desktop`}>
            <div className="sobre">
              <img src={manga.image} />
              <Link to={`/manga/${mangaId}`}>{manga.title}</Link>
              <ChevronsRight onClick={() => setShowComments(!showComments)} />
            </div>

            <div className="chv-1">
              <ReaderNavigation 
                modo={modo}
                setModo={setModo}
                currentPageIndex={currentPageIndex}
                setCurrentPageIndex={setCurrentPageIndex}
                chapter={chapter}
                allChapters={allChapters}
                currentChapterId={currentChapterId}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                handlePrevChapter={handlePrevChapter}
                handleNextChapter={handleNextChapter}
              />
              <div className="redimencao-comments">
                <select value={modo} onChange={(e) => setModo(e.target.value)}>
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>
            </div>

            <div className="chv-2">
              {modo === "horizontal" && (
                <ChapterSelectorTwo 
                  currentChapterId={currentChapterId}
                  allChapters={allChapters}
                  navigate={navigate}
                  mangaId={mangaId}
                  handlePrevChapter={handlePrevChapter}
                  handleNextChapter={handleNextChapter}
                />
              )}
            </div>

            <CommentsPanel 
              user={user}
              manga={manga}
              chapter={chapter}
              mangaId={mangaId}
              chapterId={currentChapterId}
            />
          </div>
          <div className="comments-mobile"></div>
        </div>
      </div>


      <div className="topo">
        <ChevronUp color="#ffffff" />
      </div>
    </div>
  );
}

export default ChapterPage;
