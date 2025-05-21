const ChapterPageViewer = ({ chapter, modo, showComments, fontSizeClass, renderPages }) => {
  return (
    <div
      className={`pages-container leitor ${fontSizeClass} ${modo} ${
        showComments ? "show" : ""
      }`}
    >
      {modo === "horizontal"
        ? renderPages()
        : chapter.pages.map((page, index) =>
            page.url ? (
              <img
                key={`page-${index}`}
                src={page.url}
                alt={`Página ${index + 1}`}
                className="chapter-page"
              />
            ) : (
              <p key={`page-${index}`} className="chapter-text">
                {page.text || "Conteúdo não disponível"}
              </p>
            )
          )}
    </div>
  );
};

export default ChapterPageViewer;
