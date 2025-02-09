const Store = (function () {
  // private variables, cannot change directly
  var _state = {
    currentPage: null,
    currentPageKey: '',
    playerNumber: 2,
    players: [{ name: 'A' }, { name: 'B' }],
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
  };
})();
