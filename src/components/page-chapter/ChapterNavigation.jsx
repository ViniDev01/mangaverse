const ChapterNavigation = ({
  allChapters,
  currentChapterId,
  handlePrevChapter,
  handleNextChapter,
}) => {
  const currentIndex = allChapters.findIndex(
    (ch) => ch.id === currentChapterId
  );

  return (
    <>
      <button
        onClick={handlePrevChapter}
        disabled={currentIndex === allChapters.length - 1}
      >
        anterior
      </button>
      <button onClick={handleNextChapter} disabled={currentIndex === 0}>
        próximo
      </button>
    </>
  );
};

export default ChapterNavigation;
