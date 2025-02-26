const Controller = {
  /**
   * Changes the current page.
   * @param {BasePage} page The page instance switch to, e.g. `new Home()`.
   * @param {string} newPageKey The page to switch to, e.g. `Constants.Page.xxx`.
   */
  changePage(page, newPageKey) {
    const isSamePage = Store.getCurrentPageKey() == newPageKey;
    if (isSamePage) return;

    const prevPage = Store.getCurrentPage();
    if (prevPage) prevPage.remove();
    Store._updateState({ currentPage: page });
    Store._updateState({ currentPageKey: newPageKey });
    if (page.setup) page.setup();
  },
};
