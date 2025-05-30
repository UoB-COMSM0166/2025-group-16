/**
 * Manage the rules setting dialog in the game
 * Allow players to set target score and start the game
 */
class RulesSettingDialog extends Dialog {
  /**
   * @param {Object} params - Configuration parameters
   */
  constructor(params) {
    super({
      ...params,
      title: 'RULES',
      optionGap: 64,
      options: [{ label: 'Play to:  ' }, { label: 'Start' }],
    });

    this.selectingIdx = 0; // current selected option index
    this.targetScoreOptions = [1, 3, 5]; // available target score options
    this.targetScoreOptionIdx = this._getTargetScoreIdx(Store.getTargetScore());
  }

  /**
   * Draw the dialog with updated target score
   * @override
   */
  drawDialog() {
    const score = this.targetScoreOptions[this.targetScoreOptionIdx];
    this.optionObjects[0].label = `Play to:   ${score}`; // update score label
    super.drawDialog();
  }

  /**
   * Get index of current target score
   * @param {number} currentScore - Current target score from store
   * @returns {number} Index of target score or default index
   */
  _getTargetScoreIdx(currentScore) {
    const DEFAULT_SCORE_IDX = 1;

    const scoreIdx = this.targetScoreOptions.indexOf(currentScore);
    const isValid = scoreIdx !== -1;
    if (!isValid) {
      // set default score if current score is invalid
      Controller.updateTargetScore(this.targetScoreOptions[1]);
    }
    return isValid ? scoreIdx : DEFAULT_SCORE_IDX;
  }

  /**
   * Handle option selection
   * @param {number} index - Selected option index
   * @override
   */
  onSelect(index) {
    // change to next page when player select 'Start'
    if (index === 1) {
      const newTargetScore = this.targetScoreOptions[this.targetScoreOptionIdx];
      Controller.updateTargetScore(newTargetScore);
      Controller.changePage(new MapSelection(), Constants.Page.MAP_SELECTION);
    }
  }

  /**
   * Handle key press events
   * @override
   */
  keyPressed() {
    if (!this.isOpen) return;

    super.keyPressed();

    // change target score when on 'Play to' and press 'LEFT' or 'RIGHT'
    if (this.selectingIdx === 0) {
      if (this.isPressed('LEFT', keyCode)) {
        this.targetScoreOptionIdx = this.targetScoreOptionIdx
          ? this.targetScoreOptionIdx - 1
          : this.targetScoreOptions.length - 1;
      } else if (this.isPressed('RIGHT', keyCode)) {
        this.targetScoreOptionIdx =
          (this.targetScoreOptionIdx + 1) % this.targetScoreOptions.length;
      }
    }
  }
}
