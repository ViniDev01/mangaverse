import { ChevronLeft, ChevronRight } from "lucide-react";

export const ChapterSelectorTwo = ({
  currentChapterId,
  allChapters,
  navigate,
  mangaId,
  handlePrevChapter,
  handleNextChapter,
}) => (
  <div className="chapter-comments">
    <button
      onClick={handlePrevChapter}
      disabled={
        allChapters.findIndex((ch) => ch.id === currentChapterId) ===
        allChapters.length - 1
      }
    >
      <ChevronLeft />
    </button>

    <select
      value={currentChapterId}
      onChange={(e) => navigate(`/manga/${mangaId}/${e.target.value}`)}
    >
      {allChapters.map((chap) => (
        <option key={chap.id} value={chap.id}>
          Capítulo {chap.number} {chap.title ? `- ${chap.title}` : ""}
        </option>
      ))}
    </select>

    <button
      onClick={handleNextChapter}
      disabled={
        allChapters.findIndex((ch) => ch.id === currentChapterId) === 0
      }
    >
      <ChevronRight />
    </button>
  </div>
);

export default ChapterSelectorTwo;