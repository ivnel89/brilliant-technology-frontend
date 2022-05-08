
import ReactDOM from "react-dom";
import { UpVoteButton } from "./button";
import {  Comment } from "../../api/contract";

export function renderUpVoteButton(
  comment: Comment,
  targetId: string
  ){
  const app = document.getElementById(targetId);
  ReactDOM.render(<UpVoteButton comment={comment}/>, app)
}
