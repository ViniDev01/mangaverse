import React from "react";
import { ChevronsLeft, MessageCircleMore } from "lucide-react";

const CommentToggleButton = ({ setShowComments, showComments }) => (
    <div className={`buttons-comments ${showComments ? "show" : ""}`} onClick={() => setShowComments(!showComments)}>
        <ChevronsLeft />
        <MessageCircleMore />
    </div>
)

export default CommentToggleButton;