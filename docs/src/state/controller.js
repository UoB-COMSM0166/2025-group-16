const Controller = {
  /**
   * Changes the current page.
   * @param {BasePage} page The page instance switch to, e.g. `new Home()`.
   * @param {string} newPageKey The page to switch to, e.g. `Constants.Page.xxx`.
   */
  changePage(page, newPageKey) {
    Store._updateState({ currentPage: page });
    Store._updateState({ currentPageKey: newPageKey });

    if (page.preload) page.preload();
    if (page.setup) page.setup();
  },
};
