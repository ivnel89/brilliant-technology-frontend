import { renderArticle } from './article';
import * as $ from "jquery";

jest.mock('../../api', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                fetchArticleById: jest.fn().mockResolvedValue(
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
              ),
            };   
        })
    }
  });
describe(`renderArticle`, () => {
    it(`should render the article`, async () => {
        document.body.innerHTML = `
        <div id="root"></div>
      `;
        await renderArticle();
        expect($("#root").html()).toMatchSnapshot()
    } )
})