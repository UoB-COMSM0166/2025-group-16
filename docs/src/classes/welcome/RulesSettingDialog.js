class RulesSettingDialog extends Dialog {
  constructor(params) {
    super({
      ...params,
      title: 'RULES',
      optionGap: 64,
      options: [{ label: 'Play to:  ' }, { label: 'Start' }],
    });

    this.selectingIdx = 0;
    this.targetScoreOptions = [1, 3, 5];
    this.targetScoreOptionIdx = this._getTargetScoreIdx(Store.getTargetScore());
  }

  /** @override */
  drawDialog() {
    const score = this.targetScoreOptions[this.targetScoreOptionIdx];
    this.optionObjects[0].label = `Play to:   ${score}`;
    super.drawDialog();
  }

  // if initial score is not in the target score options, set it to the default
  _getTargetScoreIdx(currentScore) {
    const DEFAULT_SCORE_IDX = 1;

    const scoreIdx = this.targetScoreOptions.indexOf(currentScore);
    const isValid = scoreIdx !== -1;
    if (!isValid) {
      Controller.updateTargetScore(this.targetScoreOptions[1]);
    }
    return isValid ? scoreIdx : DEFAULT_SCORE_IDX;
  }

  onSelect(index) {
    // change to next page when player select 'Start'
    if (index === 1) {
      const newTargetScore = this.targetScoreOptions[this.targetScoreOptionIdx];
      Controller.updateTargetScore(newTargetScore);
      Controller.changePage(new MapSelection(), Constants.Page.MAP_SELECTION);
    }
  }

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
