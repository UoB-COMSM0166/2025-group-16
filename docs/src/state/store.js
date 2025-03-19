const Store = (function () {
  /** @type {{
   *   currentPage: BasePage | null,
   *   currentPageKey: string,
   *   playerNumber: number,
   *   players: Array<{name: string}>,
   *   isAllowSound?: boolean
   * }} */
  var _state = {
    currentPage: null,
    currentPageKey: '',
    playerNumber: 2,
    players: [
      { name: 'A', score: 0, isJustWon: false },
      { name: 'B', score: 0, isJustWon: false },
    ],
    targetScore: 3,
  };

  return {
    // private method, should only be used by "controller.js"
    _updateState(newState) {
      _state = { ..._state, ...newState };
    },

    getCurrentPage() {
      return _state.currentPage;
    },

    getCurrentPageKey() {
      return _state.currentPageKey || '';
    },

    getPlayerNumber() {
      return _state.playerNumber;
    },

    getPlayers() {
      return _state.players;
    },

    getTargetScore() {
      return _state.targetScore;
    },
  };
})();
