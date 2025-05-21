const PageNavigation = ({
  currentPageIndex,
  totalPages,
  handlePrevPage,
  handleNextPage,
}) => {
  return (
    <>
      <button onClick={handlePrevPage} disabled={currentPageIndex === 0}>
        Anterior
      </button>
      <button
        onClick={handleNextPage}
        disabled={currentPageIndex === totalPages - 1}
      >
        Próximo
      </button>
    </>
  );
};

export default PageNavigation;
