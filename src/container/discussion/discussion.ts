
import * as $ from "jquery";
import { Article, Comment } from "../../api/contract";
import { formatDistance } from 'date-fns'
import Api from "../../api";
import { getUserId } from "../../helper/getUserId";
import { getUser } from "../../helper/getUser";
import { renderUpVoteButton } from "../upvote/upvote";
import { CustomEventKey } from "../../helper/customEventKey";

const api = new Api();

const renderComment = (comment: Comment, isReply=false): JQuery<HTMLElement> => {
    return $(`
    <div>
      <div data-comment-id="${comment.id}" class="flex my-8">
        <div class="w-9 mr-3">
        <img src="${comment.author.displayPicture}" class="rounded-full h-9 w-9"/>
        </div>
        <div class="w-fit">
            <div>
                <span class="font-semibold">
                    ${comment.author.firstName} ${comment.author.lastName}
                </span>
                <span class="text-sm font-extralight">
                ・ ${formatDistance(new Date(comment.createdDate), new Date())}
                </span>
            </div>
            <p class="font-light mb-2 mt-1">
                ${comment.content}
            </p>
            <div class="flex">
              <div id="up-vote-${comment.id}">
              </div>
              ${isReply ? `` : `<button class="py-1 px-3 text-sm text-slate-500 reply-btn">Reply</button>`}
            </div>
            <form class="add-reply-form" >
              <input style="display:none;" name="reply-content" class="border-solid border-2 border-gray-200 rounded w-full px-2 py-1 reply-input"/>
            </form>
            </div>
      </div>
      <div class="pl-10">
      ${comment.replies.map(
        reply => renderComment(reply, true).html()
      ).join("")}
      </div>
    </div>
    `);
}

const renderComments = (comments: Array<Comment>) => comments.map(comment => renderComment(comment));

const renderAllUpVoteButtons = (comments: Array<Comment>) =>{
  comments.forEach(comment => {
    renderUpVoteButton(comment, `up-vote-${comment.id}`);
    renderAllUpVoteButtons(comment.replies);
  })
}

export const renderDiscussion = async (article: Article) => {
  const comments = await api.getCommentsByArticleId(article.id)
  $(`[data-article-id="${article.id}"]`).append(`
 <div class="" id="add-comment-form-container">
    <h2 class="text-xl font-bold my-10">Discussion</h2>
 </div>
 <div class="py-5" id="comments-section">
 </div>
 `);
  $("#comments-section").append(renderComments(comments));
  renderAllUpVoteButtons(comments);
  $(document).on(`click`,`.reply-btn`,function(){
    const commentId = $(this).parents(`[data-comment-id]`).attr(`data-comment-id`);
    const input = $(`[data-comment-id="${commentId}"] .reply-input`)
    if(input.css("display") == "none")
      input.show()
    else
      input.hide() 
  })
  setInterval(async () => {
    const commentIds = $(`[data-comment-id]`)
      .map(function (this) {
        const rect = $(this).get()[0].getBoundingClientRect();
        if (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= $(window).height() &&
          rect.right <= $(window).width()
        ) {
          return $(this).attr("data-comment-id");
        }
      })
      .toArray()
      .filter((_) => Boolean(_));
    const comments = await api.getCommentsById(commentIds)
    const upVotesObject: Record<string,number> = {}
    comments.forEach((comment) => {
      upVotesObject[comment.id] = comment.upVotes
    })
    $(document).trigger(CustomEventKey.UP_VOTE_UPDATE, [upVotesObject]);
  },10000)

    const user = getUser();
    if(!user){
      return
    }
    $(`#add-comment-form-container`).append(`
     <form class="flex flex-row content-center" id="add-comment-form">
        <img src="${user.displayPicture}" class="rounded-full h-9 mr-3"/>
        <input name="content" class="border-solid border-2 border-gray-200 rounded w-full px-2 py-1" placeholder="What are your toughts?" />
        <button type="submit" class="rounded bg-violet-700 text-white px-5 py-1 ml-3">Comment</button>
     </form>
     <div class="pt-10 w-full h-0 border-gray-200 border-b-2" />`);
    $("#add-comment-form").on("submit", function (e) {
      e.preventDefault();
      const inputs = $("#add-comment-form :input");
      let values: Record<any, any> = {};
      inputs.each(function (this) {
        values[$(this).attr("name")] = $(this).val();
      });
      api
        .addComment(getUserId(), article.id, values.content)
        .then((comment: Comment) => {
          $("#comments-section").prepend(renderComment(comment));
          renderUpVoteButton(comment, `up-vote-${comment.id}`);
          inputs.each(function (this) {
            $(this).val("");
          });
        });
    });

    $(document).on("submit",".add-reply-form", function (e) {
      e.preventDefault();
      const inputs = $(this).children(`input`);
      let values: Record<any, any> = {};
      inputs.each(function (this) {
        values[$(this).attr("name")] = $(this).val();
      });
      const parentCommentId = $(this).parents(`[data-comment-id]`).attr(`data-comment-id`);
      console.log(parentCommentId)
      api
        .addComment(getUserId(), article.id, values["reply-content"], parentCommentId)
        .then((comment: Comment) => {
          $(`[data-comment-id="${parentCommentId}"] + div`).prepend(renderComment(comment,true));
          renderUpVoteButton(comment, `up-vote-${comment.id}`);
          inputs.each(function (this) {
            $(this).val("");
          });
        });
    });

}
