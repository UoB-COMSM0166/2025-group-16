/**
 * Show the player avatars and text on the bottom of the page.
 */
class PlayerList extends UIComponent {
  /**
   * @param {Object} [params] - The parameter for the player list.
   * @param {string} [params.label] - The text content to display.
   * @param {boolean} [params.isDrawPlayerColor] - The text will draw player color if true, default black.
   * @param {number | string} [params.textSize] - The font size to set for the text.
   */
  constructor(params) {
    super({ x: params?.x || 0, y: params?.y || 0 });

    this.label = params?.label || '';
    this.textSize = params?.textSize;
    this.drawColor = params?.isDrawPlayerColor
      ? Object.values(Theme.palette.player)
      : Theme.palette.black;
  }

  drawPlayerAvatars() {
    const numPlayers = Object.keys(Resources.images.playerlist).length;
    const spacing = width / (numPlayers + 1);
    for (let i = 0; i < numPlayers; i++) {
      const playerAvatar = Resources.images.playerlist[i];
      const avatarSize = playerAvatar.width;
      const xPos = spacing * (i + 1) - avatarSize / 2 - 50;
      const yPos = height - avatarSize + 50;

      if (playerAvatar?.image) {
        imageMode(CENTER);
        image(
          playerAvatar.image,
          xPos,
          yPos,
          playerAvatar.width,
          playerAvatar.height,
        );

        let textXPos = xPos + avatarSize / 2 + 10;
        let textYPos = yPos + avatarSize / 2 - 70;
        let color =
          typeof this.drawColor === 'string'
            ? this.drawColor
            : this.drawColor[i];
        if (this?.label) {
          const text = new Text({
            x: textXPos,
            y: textYPos,
            label: this.label,
            textAlign: [LEFT, CENTER],
            textSize: this.textSize,
            textFont: 'Press Start 2P',
            color: color,
            maxWidth: spacing - avatarSize - 10,
          });
          text.draw();
        }
      }
    }
  }
}
