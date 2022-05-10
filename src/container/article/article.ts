import Api from "../../api";
import * as $ from "jquery";
import { Article } from "../../api/contract";
import { renderDiscussion } from "../discussion/discussion";

const api = new Api();

export const getArticleId = ()=> {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get("id")
} 

export const renderArticle = async () => {
    const articleId = getArticleId();
    const article: Article = await api.fetchArticleById(articleId);
    const articleDatePretty = new Date(article.createdDate).toLocaleString()
    const articleMarkup: JQuery<HTMLElement> = $(`
    <article>
        <div>
            Written by ${article.author.firstName} ${article.author.lastName}
            <br/>
            Published on ${articleDatePretty}
        </div>
        <p>
        ${article?.content}
        </p>
    </article>
    <div class="discussion-container" data-article-id="${article.id}">
    </div>
    `)
    $(`#root`).append(articleMarkup);
    return article;
}


renderArticle().then((article: Article) => {
    api.login().then(() => renderDiscussion(article));
});    