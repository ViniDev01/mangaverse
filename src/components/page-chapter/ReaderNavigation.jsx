import { ChevronLeft, ChevronRight } from "lucide-react";

export const ReaderNavigation = ({ 
    modo, 
    chapter, 
    currentPageIndex, 
    setCurrentPageIndex, 
    currentChapterId, 
    navigate, 
    allChapters, 
    handlePrevPage, 
    handleNextPage, 
    handlePrevChapter, 
    handleNextChapter, 
    mangaId }) => {
    return (
        <div className="chapter-comments">
            {modo === "horizontal" ? (
                <>
                <button
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 0}
                >
                    <ChevronLeft />
                </button>

                <select
                    value={currentPageIndex}
                    onChange={(e) =>
                    setCurrentPageIndex(Number(e.target.value))
                    }
                >
                    {chapter.pages.map((_, index) => (
                    <option key={index} value={index}>
                        {index + 1} / {chapter.pages.length}{" "}
                    </option>
                    ))}
                </select>

                <button
                    onClick={handleNextPage}
                    disabled={currentPageIndex === chapter.pages.length - 1}
                >
                    <ChevronRight />
                </button>
                </>
            ) : (
                <>
                <button
                    onClick={handlePrevChapter}
                    disabled={
                    allChapters.findIndex(
                        (ch) => ch.id === currentChapterId
                    ) ===
                    allChapters.length - 1
                    }
                >
                    <ChevronLeft />
                </button>

                <select
                    value={currentChapterId}
                    onChange={(e) =>
                    navigate(`/manga/${mangaId}/${e.target.value}`)
                    }
                >
                    {allChapters.map((chap) => (
                    <option key={chap.id} value={chap.id}>
                        Capítulo {chap.number}{" "}
                        {chap.title ? `- ${chap.title}` : ""}
                    </option>
                    ))}
                </select>

                <button
                    onClick={handleNextChapter}
                    disabled={
                    allChapters.findIndex(
                        (ch) => ch.id === currentChapterId
                    ) === 0
                    }
                >
                    <ChevronRight />
                </button>
                </>
            )}

        </div>
    )
}
export default ReaderNavigation;