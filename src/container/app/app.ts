import Api from "../../api";
import * as $ from "jquery";
import { Article } from "../../api/contract";

const api = new Api();

export const fetchArticlesAndDisplay = () => api.fetchAllArticles().then((articles: Array<Article>) => {
    const articleElements: Array<JQuery<HTMLElement>> = articles.map(
      (article) =>
        $(`
        <li>
            <a href="/article.html?id=${article.id}">
                ${article.content.slice(0, 20)}
            </article>
        </li>
        `)
    );
    $(`#root`).append($(`<ol></ol>`).append(articleElements));
});

fetchArticlesAndDisplay();