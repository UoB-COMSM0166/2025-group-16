/**
 * Manage the tutorial dialog in the game
 * Prompt players to start or skip the tutorial
 */
class TutorialDialog extends Dialog {
  /**
   * @param {Object} params - Configuration parameters
   */
  constructor(params) {
    super({
      ...params,
      title: 'START TUTORIAL?',
      isOpen: localStorage.getItem(Constants.TutorialCompletedKey) !== 'true',
      options: [{ label: 'Yes' }, { label: 'No' }],
      onClose: () => {
        params?.onClose(); // call custom close callback if provided
        localStorage.setItem(Constants.TutorialCompletedKey, 'true'); // mark tutorial as completed
      },
    });

    this.selectingIdx = 0; // current selected option index
  }

  /**
   * Handle option selection
   * @param {number} index - Selected option index
   * @override
   */
  onSelect(index) {
    if (index === 0) {
      // start tutorial when 'Yes' is selected
      Controller.changePage(new Tutorial(), Constants.Page.TUTORIAL);
    } else {
      // close dialog when 'No' is selected
      this.close();
    }
  }
}
