import React from "react";
import { useMostViewedMangas } from "../../hooks/useMostViewedMangas.js";
import { Link } from "react-router-dom";

const MostViewedMangas = () => {
  const { mostViewed, loading, error, chapters } = useMostViewedMangas();

  if (loading) return <p>Carregando mangás...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <section className="container-most-viewed">
      <div className="center">
        <h1 className="title-pricipel">Mangás Mais Vistos</h1>
        <div className="most-viewed">
          {mostViewed.map((manga) => {
            // Get the latest chapter for this manga
            const mangaChapters = chapters[manga.id] || [];
            const latestChapter = mangaChapters[0]; // First item after sorting

            return (
              <Link
                to={`/manga/${manga.id}`}
                className="most-viewed-list"
                key={manga.id}
              >
                <img src={manga.image} alt={manga.title} />
                <h1 className="title-most-viewed-list">{manga.title}</h1>
                {latestChapter && <p>Capítulo {latestChapter.number}</p>}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MostViewedMangas;
