import React from "react";
import { Link } from "react-router-dom";

const Title = ({ mangaId, mangaTitle, chapterNumber, showComments }) => {
  return (
    <Link
        to={`/manga/${mangaId}`}
        className={`${showComments ? "show" : ""}`}
    >
        {mangaTitle} <span>Capítulo {chapterNumber}</span>
    </Link>
  );
}

export default Title;