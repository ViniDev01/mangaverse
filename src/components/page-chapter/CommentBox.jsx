import React,{ useState, useContext } from 'react';
import { SendHorizontal } from "lucide-react";
import {db} from "../../firebase/firebaseConfig";
import { doc, collection, addDoc, updateDoc, increment } from "firebase/firestore";
import { UserContext } from "../../context/UserContext";


const CommentBox = ({ mangaId, chapterId }) => {
    const [comment, setComment] = useState("");
    const {user} = useContext(UserContext);

    const handleComment = async () => {
        if (!user) {
            alert("Você precisa estar logado para comentar.");
            return;
        }

        if (comment.trim() === "") {
            alert("O comentário não pode estar vazio.");
            return;
        }

        try {

        const chapterRef = doc(db, "containerMangas", mangaId, "chapters", chapterId);
        const commentRef = collection(chapterRef, "comments");

        await addDoc(commentRef, {
            avatar: user.photoURL || null,
            text: comment,
            autor: user.displayName || "Anonimo",
            uid: user.uid,
            criadoEm: new Date(),
            likeCount: 0,
            dislikeCount: 0
        });

        await updateDoc(chapterRef, {
            commentCount: increment(1)
        });

        setComment("");

        } catch (err) {
            console.error("Erro ao adicionar comentario:", err);
        }
    } 

    return(
        <div className="comment-box">
            <textarea 
            placeholder="Escreva um comentário..." 
            rows={4} 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            />

            <button className="btn-comment" onClick={handleComment}>
                <SendHorizontal />
            </button>
        </div>
    )
}


export default CommentBox;