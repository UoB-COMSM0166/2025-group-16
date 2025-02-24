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
    players: [{ name: 'A' }, { name: 'B' }],
    // browser only allow sound after first user interaction, check if it's allowed to play sound now
    isAllowSound: false,
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

    getIsAllowSound() {
      return _state.isAllowSound;
    },
  };
})();
