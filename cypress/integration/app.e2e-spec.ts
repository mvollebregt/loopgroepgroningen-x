import {AppPage} from './app.po';

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });
  describe('default screen', () => {
    beforeEach(() => {
      cy.visit('/Inbox');
    });
    it('should say Inbox', () => {
      page.getParagraph().contains('Inbox');
    });
  });
});
