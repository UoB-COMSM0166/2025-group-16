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

  addPlayerScore(playerIdx, addedScore) {
    const newPlayers = Store.getPlayers();
    newPlayers[playerIdx].score += addedScore;
    Store._updateState(newPlayers);
  },

  subtractPlayerScore(playerIdx, subtractedScore) {
    const newPlayers = Store.getPlayers();
    newPlayers[playerIdx].score -= subtractedScore;
    Store._updateState(newPlayers);
  },

  resetPlayersScore() {
    const newPlayers = Store.getPlayers();
    newPlayers.forEach((player) => {
      player.score = 0;
    });
    Store._updateState(newPlayers);
  },
};
