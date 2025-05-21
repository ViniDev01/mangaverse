const PageSelector = ({ currentPageIndex, setCurrentPageIndex, chapter }) => {
  return (
    <select
      value={currentPageIndex}
      onChange={(e) => setCurrentPageIndex(Number(e.target.value))}
    >
      {chapter.pages.map((_, index) => (
        <option key={index} value={index}>
          {index + 1} / {chapter.pages.length}
        </option>
      ))}
    </select>
  );
};

export default PageSelector;
