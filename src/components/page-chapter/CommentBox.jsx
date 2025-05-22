


const CommentBox = ({ mangaId, chapterId }) => {
    return(
        <div className="comment-box">
            <textarea placeholder="Escreva um comentário..." rows={4} />

            <button className="btn-comment">
                <SendHorizontal />
            </button>
        </div>
    )
}


export default CommentBox;