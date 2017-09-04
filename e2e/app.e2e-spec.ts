import { PrPage } from './app.po';

describe('pr App', () => {
  let page: PrPage;

  beforeEach(() => {
    page = new PrPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
