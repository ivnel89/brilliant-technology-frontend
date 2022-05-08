
import * as $ from "jquery";
import {  Comment } from "../../api/contract";

export const renderUpVoteButton = (comment: Comment) => {
    return `
    <button class="py-1 px-3 text-sm text-slate-500 upvote-btn">
    ${comment.upVoted ? "▼" : "▲"} ${comment.upVotes ? comment.upVotes : "upvote"}
    </button>
    `
  } 