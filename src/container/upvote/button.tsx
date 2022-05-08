import react from "react";
import Api from "../../api";
import { Comment } from "../../api/contract";

const api = new Api();

export function UpVoteButton({ comment }: { comment: Comment }) {
  
  const [upVotes, setUpVotes] = react.useState(0);
  const [upVoted, setUpVoted] = react.useState(false);

  react.useEffect(() => {
    setUpVotes(comment.upVotes)
  },[comment.upVotes])

  react.useEffect(() => {
    setUpVoted(comment.upVoted)
  },[comment.upVoted])
  
  const handleClick = (e: react.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (upVoted) {
      api.downVote(comment.id).then(comment => {
          setUpVotes(comment.upVotes)
          setUpVoted(comment.upVoted)
      });
    } else {
      api.upVote(comment.id).then(comment => {
        setUpVotes(comment.upVotes)
        setUpVoted(comment.upVoted)
    });;
    }
  };

  return (
    <button
      onClick={handleClick}
      className="py-1 px-3 text-sm text-slate-500 upvote-btn"
    >
      {upVoted ? "▼" : "▲"}
      {upVotes ? upVotes : "upvote"}
    </button>
  );
} 