import { useNavigate } from "react-router-dom";

const ChapterSelector = ({ mangaId, currentChapterId, allChapters }) => {
  const navigate = useNavigate();

  return (
    <div className="filter-chapter">
      <select
        value={currentChapterId}
        onChange={(e) =>
          navigate(`/manga/${mangaId}/${e.target.value}`)
        }
      >
        {allChapters.map((chap) => (
          <option key={chap.id} value={chap.id}>
            Capítulo {chap.number} {chap.title ? `- ${chap.title}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChapterSelector;
