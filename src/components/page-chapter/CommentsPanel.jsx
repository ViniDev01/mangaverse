import LikeButton from "./LikeButton";
import { SendHorizontal, ThumbsUp, ThumbsDown } from "lucide-react";

export const CommentsPanel = ({ user, manga, chapter, mangaId, chapterId }) => {
  return (
        <div className="comments">
        {user ? (
        <div className="comment-interaction">
            <div className="reactions">
            <LikeButton
                chapterId={chapter.id}
                mangaId={manga.id}
                userId={user.uid}
            />

            <div className="comment-count">
                <span>0</span>
                <span>comentários</span>
            </div>
            </div>
        </div>
        ) : (
        <div className="comment-login-warning">
            <p>Faça login para curtir ou comentar neste capítulo.</p>
        </div>
        )}

        <CommentBox mangaId={mangaId} chapterId={chapterId} />


        <div className="comment-list">
        <div className="container-comment-item">
            <div className="comment-item">
            <img src={manga.image} alt="Avatar" />
            <div className="comment-content">
                <h3>{user?.displayName || "Usuario anonimo"}</h3>
                <p>Conteúdo do comentário</p>
            </div>
            </div>
            <div className="comment-actions">
            <div className="btns-like">
                <button>
                <ThumbsUp />
                </button>
                <span>0</span>
                <button>
                <ThumbsDown />
                </button>
                <span>0</span>
            </div>
            <div className="btn-responder">
                <span>Responder</span>
            </div>
            </div>
        </div>
        </div>
    </div>
  )
};

export default CommentsPanel;