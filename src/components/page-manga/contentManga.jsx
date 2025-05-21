import { Link } from 'react-router-dom';

function ContentManga({ manga, chapters }) {

    if (!manga) {
        return <p>Carregando informações do mangá...</p>;
    }
    

  return (
    <div className="container-manga">
      <img className="img-banner"
      src="https://i.ytimg.com/vi/pHxysbnLx0w/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDHxgWrqTxOH1ZF51qz1yUsibXO7w" 
      alt="Nome do mangá" />

        <div className="info-manga">
        
            <div className="container-left-manga">
                
                    <img src={manga.image} alt={manga.title} />
                <div className="star-rating">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                </div>
                <div className="info-manga-left">
                    <div className="post-manga"><span>Status</span><span>{manga.status}</span></div>
                    <div className="post-manga"><span>Tipo</span><span>{manga.category}</span></div>
                    <div className="post-manga"><span>Postado por</span><span>{manga.create}</span></div>
                    <div className="post-manga"><span>Lançado em</span><span>{manga.lancamento}</span></div>
                    <div className="post-manga"><span>Atualizado em</span><span>março 20, 2025</span></div>
                </div>
                
                
            </div>
        

            <div className="info-right-manga">
                <div className="info-start">
                    <h1>{manga.title}</h1>
                    <p>{manga.alternativo}</p>
                    <div className="generos">
                        <Link>Ação</Link>
                        <Link>Aventura</Link>
                        <Link>Comédia</Link>
                        <Link>fantasia</Link>
                        <Link>harém</Link>
                        <Link>shounen</Link>
                    </div>
                    <div className="Synopsis">
                        <h1>Sinopse {manga.title}</h1>
                        <p>
                            {manga.biografia}
                        </p>
                    </div>
                </div>
                <div className="container-chapters">
                    <h1>Capítulos de {manga.title}</h1>
                    {chapters.length > 0 && (
                        <>
                            <div className="lastend">
                                <Link to={`${chapters[0].id}`} className="chapter"><span>Primeiro Capítulo</span> {chapters[0].id}</Link>
                                <Link to={`${chapters[chapters.length-1].id}`} className="chapter"><span>Capítulo recente</span> {chapters[chapters.length-1].id}</Link>
                            </div>
                            <div className='chapters'>
                                {chapters.map((chapter) => (
                                    <Link key={chapter.id} to={`${chapter.id}`} className="chapter">
                                        <span>{chapter.id}</span>
                                        <span>{chapter.data}</span>
                                    </Link>
                                ))}

                                
                            </div>
                        </>
                    )}
                    
                </div>
            </div>
        </div>
    </div>
  );
}

export default ContentManga;