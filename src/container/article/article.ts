import Api from "../../api";
import * as $ from "jquery";
import { Article } from "../../api/contract";

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
    `)
    $(`#root`).append(articleMarkup);

}

renderArticle();