import React from "react";
import { Link } from 'react-router-dom';

function Cards({ mangas, chapters }) {

  return (
    <section className="container-last-update">
      <div className="center">
        <div className="last-update">
          {mangas.map((manga) => (
            <div key={manga.id} className="last-update-list">
              <Link to={`/manga/${manga.id}`}>
                <img
                  src={manga.image}
                  alt={manga.title}
                  draggable="false"
                />
              </Link>
              <div className="info-last-update">
                <Link to={`/manga/${manga.id}`} className="title-last-update-list">
                  {manga.title}
                </Link>
                <div className="icons-update">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star"></i>
                  ))}
                  <span>9.9</span>
                </div>
                
                {chapters[manga.id] && chapters[manga.id].length > 0 && (
                  <>
                    <Link 
                      to={`/manga/${manga.id}/${chapters[manga.id][0].id}`} 
                      className="capitulo"
                    >
                      {`Capítulo ${chapters[manga.id][0].number || "N/A"}`}
                    </Link>
                    <span className="post">{manga.description}</span>
                    <Link 
                      to={`/manga/${manga.id}/${chapters[manga.id][1].id}`} 
                      className="capitulo"
                    >
                      {`Capítulo ${chapters[manga.id][1].number || "N/A"}`}
                    </Link>
                    <span className="post">{chapters.data}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Cards;