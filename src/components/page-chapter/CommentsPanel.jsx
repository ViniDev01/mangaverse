import LikeButton from "./LikeButton";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import CommentBox from "./CommentBox.jsx"
import { useState, useEffect } from "react";

import { db } from "../../firebase/firebaseConfig.js";
import { query, collection, orderBy, onSnapshot, doc, runTransaction } from "firebase/firestore";

export const CommentsPanel = ({ user, manga, chapter, mangaId, chapterId }) => {
    const [processingLikes, setProcessingLikes] = useState({});
    const [processingDislikes, setProcessingDislikes] = useState({});
    const [commentCount, setCommentCount] = useState(0);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const commentsRef = collection(db, "containerMangas", mangaId, "chapters", chapterId, "comments");

        const q = query(commentsRef, orderBy("criadoEm", "asc"));

        const unsubscribeComments = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            setComments(list)
        });

        // Buscar o commentCount
        const chapterRef = doc(db, "containerMangas", mangaId, "chapters", chapterId);
        const unsubscribeChapter = onSnapshot(chapterRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setCommentCount(data.commentCount || 0);
            }
        })             
        

        return () => {
            unsubscribeComments();
            unsubscribeChapter();
        }
    }, [mangaId, chapterId]);

    const handleCommentLike = async (commentId, userId) => {
        if (!userId || processingLikes[commentId]) return;

        setProcessingLikes((prev) => ({ ...prev, [commentId]: true }));

        const commentRef = doc(db, "containerMangas", mangaId, "chapters", chapterId, "comments", commentId);

        try {
            await runTransaction(db, async (transaction) => {
            const commentDoc = await transaction.get(commentRef);
            if (!commentDoc.exists()) throw "Comentário não encontrado";

            const data = commentDoc.data();
            const alreadyLiked = data.likes?.[userId];
            const alreadyDisliked = data.dislikes?.[userId];

            const newLikes = { ...(data.likes || {}) };
            const newDislikes = { ...(data.dislikes || {}) };
            let likeCount = data.likeCount || 0;
            let dislikeCount = data.dislikeCount || 0;

            if (alreadyLiked) {
                delete newLikes[userId];
                likeCount -= 1;
            } else {
                newLikes[userId] = true;
                likeCount += 1;

                if (alreadyDisliked) {
                delete newDislikes[userId];
                dislikeCount -= 1;
                }
            }

            transaction.update(commentRef, {
                likes: newLikes,
                dislikes: newDislikes,
                likeCount,
                dislikeCount,
            });
            });
        } catch (err) {
            console.error("Erro ao atualizar like:", err);
        } finally {
            setProcessingLikes((prev) => ({ ...prev, [commentId]: false }));
        }
    };


    const handleCommentDislike = async (commentId, userId) => {
        if (!userId || processingDislikes[commentId]) return;

        setProcessingDislikes((prev) => ({ ...prev, [commentId]: true }));

        const commentRef = doc(db, "containerMangas", mangaId, "chapters", chapterId, "comments", commentId);

        try {
            await runTransaction(db, async (transaction) => {
            const commentDoc = await transaction.get(commentRef);
            if (!commentDoc.exists()) throw "Comentário não encontrado";

            const data = commentDoc.data();
            const alreadyDisliked = data.dislikes?.[userId];
            const alreadyLiked = data.likes?.[userId];

            const newDislikes = { ...(data.dislikes || {}) };
            const newLikes = { ...(data.likes || {}) };
            let dislikeCount = data.dislikeCount || 0;
            let likeCount = data.likeCount || 0;

            if (alreadyDisliked) {
                delete newDislikes[userId];
                dislikeCount -= 1;
            } else {
                newDislikes[userId] = true;
                dislikeCount += 1;

                if (alreadyLiked) {
                delete newLikes[userId];
                likeCount -= 1;
                }
            }

            transaction.update(commentRef, {
                dislikes: newDislikes,
                likes: newLikes,
                dislikeCount,
                likeCount,
            });
            });
        } catch (err) {
            console.error("Erro ao atualizar dislike:", err);
        } finally {
            setProcessingDislikes((prev) => ({ ...prev, [commentId]: false }));
        }
    };



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
                <span>{commentCount}</span>
                <span>comentários</span>
            </div>
            </div>
        </div>
        ) : (
        <div className="comment-login-warning">
            <p>Faça login para curtir ou comentar neste capítulo.</p>
        </div>
        )}
        {user && (
            <CommentBox mangaId={mangaId} chapterId={chapterId} />
        )}
        


        <div className="comment-list">
            {comments.map((comment) => (
                <div className="container-comment-item" key={comment.id}>
                    
                        <div className="comment-item">
                            <img src={comment.avatar} alt="Avatar" />
                            <div className="comment-content">
                                <h3>{comment.autor || "Usuario anonimo"}</h3>
                                <p>{comment.text}</p>
                            </div>

                            
                        </div>
                    
                    <div className="comment-actions">
                        <div className="btns-like">
                            <button 
                            onClick={() => handleCommentLike(comment.id, user.uid)} 
                            className={`${processingLikes[comment.id] ? "disable" : ""}`}
                            style={{ pointerEvents: processingLikes[comment.id] ? "none" : "auto", opacity: processingLikes[comment.id] ? 0.5 : 1 }}> 
                                <ThumbsUp /> 
                            </button>
                            <span>{comment.likeCount || 0}</span>

                            <button 
                            onClick={() => handleCommentDislike(comment.id, user.uid)}
                            className={`${processingDislikes[comment.id] ? "disable" : ""}`}
                            style={{ pointerEvents: processingDislikes[comment.id] ? "none" : "auto", opacity: processingDislikes[comment.id] ? 0.5 : 1 }}> 
                                <ThumbsDown /> 
                            </button>
                            
                            <span>{comment.dislikeCount || 0}</span>

                        </div>
                        <div className="btn-responder">
                            <span>Responder</span>
                        </div>
                    </div>
                    
        
                </div>
            ))}
        </div>
    </div>
  )
};

export default CommentsPanel;