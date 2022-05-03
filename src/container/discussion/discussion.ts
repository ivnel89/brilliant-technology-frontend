
import * as $ from "jquery";
import { Article, Comment } from "../../api/contract";
import { formatDistance } from 'date-fns'
import Api from "../../api";
import { getUserId } from "../../helper/getUserId";
import { getUser } from "../../helper/getUser";

const api = new Api();

const renderUpVoteButton = (comment: Comment) => {
  return `${comment.upVoted ? "▼" : "▲"} ${comment.upVotes ? comment.upVotes : "upvote"}`
} 

const renderComment = (comment: Comment) => {
    return $(`
    <div data-comment-id="${comment.id}" data-user-upvoted="${comment.upVoted||false}" class="flex my-8">
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
        <div>
            <button class="py-1 px-3 text-sm text-slate-500 upvote-btn">
                ${renderUpVoteButton(comment)}
            </button>
        </div>
    </div>
</div>
    `)
}

const renderComments = (comments: Array<Comment>) => comments.map(comment => renderComment(comment));

export const renderDiscussion = (article: Article) => {
  $(`[data-article-id="${article.id}"]`).append(`
 <div class="" id="add-comment-form-container">
    <h2 class="text-xl font-bold my-10">Discussion</h2>
 </div>
 <div class="py-5" id="comments-section">
 </div>
 `);
  $("#comments-section").append(renderComments(article.comments));
  $(`#comments-section`).on('click','[data-comment-id] .upvote-btn', function(){
    const commentId = $(this).parents(`[data-comment-id]`).attr(`data-comment-id`)
    const userUpvoted =  JSON.parse($(this).parents(`[data-comment-id]`).attr(`data-user-upvoted`))
    if(userUpvoted)
      api.downVote(commentId).then(comment => {
        $(this).parents(`[data-comment-id]`).attr(`data-user-upvoted`,"false")
        $(this).html(
          renderUpVoteButton(comment)
        )
      })
    else
      api.upVote(commentId).then(comment => {
        $(this).parents(`[data-comment-id]`).attr(`data-user-upvoted`,"true")
        $(this).html(
          renderUpVoteButton(comment)
        )
      })
  })

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
          inputs.each(function (this) {
            $(this).val("");
          });
        });
    });

}
