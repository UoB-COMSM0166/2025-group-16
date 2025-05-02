/**
 * Manages the exit dialog in the game
 * Prompts players to exit or stay
 */
class ExitDialog extends Dialog {
  /**
   * @param {Object} params - Configuration parameters for the dialog
   */
  constructor(params) {
    super({
      ...params,
      title: 'EXIT ANYWAY?',
      options: [{ label: 'Yes' }, { label: 'No' }],
    });

    this.selectingIdx = 0; // current selected option index
  }

  /**
   * Handles option selection and performs corresponding actions
   * @param {number} index - The index of the selected option
   * @override
   */
  onSelect(index) {
    if (index === 0) {
      // hard reset game state when 'Yes' is selected
      Controller.resetPlayerJustWon();
      Controller.resetPlayersScore();
      Controller.resetLastMapIdx();
      Controller.changePage(new Welcome(), Constants.Page.WELCOME);
    } else {
      this.close();
    }
  }
}
