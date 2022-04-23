import { fetchArticlesAndDisplay } from './app';
import * as $ from "jquery";

jest.mock('../../api', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
              fetchAllArticles: jest.fn().mockResolvedValue([
                {
                  author: {
                    displayPicture: "www.example.com/img.png",
                    firstName: "Ben",
                    id: "mockAuthorId",
                    lastName: "Cook",
                  },
                  comments: [],
                  content: "Title",
                  createdDate: new Date(),
                  id: "mockArticleId",
                },
              ]),
            };   
        })
    }
  });
describe(`fetchArticlesAndDisplay`, () => {
    it(`should add article links to the DOM`, async () => {
        document.body.innerHTML = `
        <div id="root"></div>
      `;
        await fetchArticlesAndDisplay();
        expect($("#root").html()).toMatchSnapshot()
    } )
})