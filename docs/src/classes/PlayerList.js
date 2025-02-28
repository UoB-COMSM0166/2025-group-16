/**
 * Show the player avatars and text on the bottom of the page.
 */
class PlayerList extends UIComponent {
  /**
   * @param {Object} [params] - The parameter for the player list.
   * @param {string} [params.label] - The text content to display.
   * @param {number | string} [params.textSize] - The font size to set for the text.
   * @param {boolean} [params.isShadow] - The text shadow.
   */
  constructor(params) {
    super({ x: params?.x || 0, y: params?.y || 0 });

    this.label = params?.label || '';
    this.textSize = params?.textSize;
    this.isShadow = params?.isShadow || false;
    this.playerAvatars = [];
    this.statusTexts = []; //store players status in order.
    const numPlayers = Object.keys(Resources.images.playerlist).length;
    for (let i = 0; i < numPlayers; i++) {
      this.playerAvatars.push(Resources.images.playerlist[i]);
      this.statusTexts.push({
        text: this.label,
        color: Theme.palette.black,
        textSize: this.textSize,
        isShadow: this.isShadow,
      });
    }
  }

  drawPlayerAvatars() {
    const numPlayers = Object.keys(Resources.images.playerlist).length;
    const spacing = width / (numPlayers + 1) - 10;
    for (let i = 0; i < numPlayers; i++) {
      this.playerAvatars.push(Resources.images.playerlist[i]);
      const avatarSize = this.playerAvatars[i].width;
      const xPos = spacing * (i + 1) - avatarSize / 2 - 60;
      const yPos = height - avatarSize + 50;

      if (this.playerAvatars[i]?.image) {
        imageMode(CENTER);
        image(
          this.playerAvatars[i].image,
          xPos,
          yPos,
          this.playerAvatars[i].width,
          this.playerAvatars[i].height,
        );

        let textXPos = xPos + avatarSize / 2 + 10;
        let textYPos = yPos + avatarSize / 2 - 70;

        let { text, color, textSize, isShadow } = this.statusTexts[i];
        if (this?.label) {
          const statusText = new Text({
            x: textXPos,
            y: textYPos,
            label: text,
            textAlign: [LEFT, CENTER],
            textSize: textSize,
            textFont: 'Press Start 2P',
            color: color,
            maxWidth: spacing - avatarSize,
            isShadow: isShadow,
          });
          statusText.draw();
        }
      }
    }
  }

  updateStatus({ playerIdx, newStatus, textSize, color, isShadow }) {
    if (playerIdx >= 0 && playerIdx < this.statusTexts.length) {
      const update = {};
      if (newStatus) update.text = newStatus;
      if (textSize) update.textSize = textSize;
      if (color) update.color = color;
      if (typeof isShadow == 'boolean') update.isShadow = isShadow;
      this.statusTexts[playerIdx] = update;
    }
  }
}
