import Api from "../../api";
import * as $ from "jquery";
import { Article } from "../../api/contract";

const api = new Api();

export const fetchArticlesAndDisplay = () => api.fetchAllArticles().then((articles: Array<Article>) => {
    if(!articles?.length){
        alert("Seeding data, page will refresh soon!")
        seed()
    }
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

const seed = () => {
    api.createUser({
        displayPicture:"https://i.pravatar.cc/100?img=68",
        firstName:"John",
        lastName:"Cook"
    })
    api.createUser({
        displayPicture:"https://i.pravatar.cc/100?img=49",
        firstName:"Lisa",
        lastName:"Goodman"
    })
    api.createUser({
        displayPicture:"https://i.pravatar.cc/100?img=47",
        firstName:"Nosrat",
        lastName:"Mogamev"
    }).then( user => {
        api.createArticle({
            authorId: user.id,
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae dolor risus. Suspendisse sed velit eu orci bibendum fringilla ac vel risus. Vestibulum sit amet ligula in augue varius pretium. Suspendisse non nisl ultrices, efficitur eros ac, maximus nibh. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer iaculis pretium nisi, sit amet elementum diam tincidunt a. Quisque convallis efficitur leo. Mauris congue ligula nisl, eu vulputate felis aliquet at."
        }).then(()=>window.location.reload())
    })
}

fetchArticlesAndDisplay();