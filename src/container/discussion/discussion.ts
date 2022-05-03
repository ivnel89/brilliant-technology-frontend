
import * as $ from "jquery";
import { Article, Comment } from "../../api/contract";
import { formatDistance } from 'date-fns'
import Api from "../../api";

const api = new Api();

const renderComment = (comment: Comment) => {
    return $(`
    <div data-comment class="flex my-8">
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
            <button class="py-1 px-3 text-sm text-slate-500">
                ▲ Upvote
            </button>
            <button class="py-1 px-3 text-sm text-slate-500">
                Reply
            </button>
        </div>
    </div>
</div>
    `)
}

const renderComments = (comments: Array<Comment>) => comments.map(comment => renderComment(comment));

export const renderDiscussion = (article: Article) => {
 $(`[data-article-id="${article.id}"]`).append(`
 <div class="">
    <h2 class="text-xl font-bold my-10">Discussion</h2>
    <form class="flex flex-row content-center" id="add-comment-form">
        <img src="https://i.pravatar.cc/300" class="rounded-full h-9 mr-3"/>
        <input name="content" class="border-solid border-2 border-gray-200 rounded w-full px-2 py-1" placeholder="What are your toughts?" />
        <button type="submit" class="rounded bg-violet-700 text-white px-5 py-1 ml-3">Comment</button>
    </form>
    <div class="pt-10 w-full h-0 border-gray-200 border-b-2" />
 </div>
 <div class="py-5" id="comments-section">
 </div>
 `)
 $("#comments-section").append(renderComments(article.comments))
 $("#add-comment-form").on("submit", function(e){
    e.preventDefault();
    const inputs = $('#add-comment-form :input');
    let values: Record<any,any> = {};
    inputs.each(function(this) {
        values[$(this).attr("name")] = $(this).val();
    });
    api.addComment("589e6aba-ec34-4914-90b8-7a390b171510", article.id, values.content).then(
        (comment: Comment) => {
            $("#comments-section").prepend(renderComment(comment));
            inputs.each(function(this) {
                $(this).val("");
            });
        }
    );
})
}