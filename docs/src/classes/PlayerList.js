/**
 * Show the player avatars and text on the bottom of the page.
 */
class PlayerList extends UIComponent {
  /**
   * @param {Object} [params] - The parameter for the player list.
   * @param {string} [params.label] - The text content to display.
   * @param {number | string} [params.textSize] - The font size to set for the text.
   * @param {string} [params.color] - The text color. if not setting default is player's color.
   * @param {boolean} [params.isShadow] - The text shadow.
   */
  constructor(params) {
    super({ x: params?.x || 0, y: params?.y || 0 });

    this.label = params?.label || ''; // default text content
    this.color = params?.color; // custom text color
    this.textSize = params?.textSize; // custom text size
    this.isShadow = params?.isShadow || false; // text shadow flag
    this.playerAvatars = []; // player avatar images
    this.playerStatus = []; // player status ('playing' or 'lose')
    this.statusTexts = []; // player status text configurations

    const numPlayers = Resources.images.playerAvatar.ing.length;
    this.cooldowns = new Array(numPlayers).fill(null); // cooldown timers

    for (let i = 0; i < numPlayers; i++) {
      const playerColor = this.color
        ? this.color
        : Object.values(Theme.palette.player)[i];
      this.playerAvatars.push(Resources.images.playerAvatar.ing[i]);
      this.playerStatus.push('playing');
      this.statusTexts.push({
        text: this.label,
        color: playerColor, // default status Text use player color if not setting.
        textSize: this.textSize,
        isShadow: this.isShadow,
      });
    }
  }

  /** Draw player list UI
   * @override
   */
  draw() {
    const numPlayers = this.playerAvatars.length;
    const spacing = width / (numPlayers + 1) - 10; // spacing between avatars

    for (let i = 0; i < numPlayers; i++) {
      const playerImage =
        this.playerStatus[i] === 'lose'
          ? Resources.images.playerAvatar.lose
          : this.playerAvatars[i];

      const avatarSize = playerImage?.width;
      const xPos = spacing * (i + 1) - avatarSize / 2 - 60;
      const yPos = height - avatarSize + 50;

      if (playerImage?.image) {
        imageMode(CENTER);
        image(
          playerImage.image,
          xPos,
          yPos,
          playerImage.width,
          playerImage.height,
        );

        // cooldown effect
        this._drawCooldownEffect(xPos, yPos, avatarSize, i);

        let textXPos = xPos + avatarSize / 2 + 10;
        let textYPos = yPos + avatarSize / 2 - 60;

        let { text, color, textSize, isShadow } = this.statusTexts[i];
        if (this?.label) {
          // render status text
          const statusText = new Text({
            x: xPos + avatarSize / 2 + 10,
            y: yPos + avatarSize / 2 - 60,
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

  /**
   * Mark player as lost
   * @param {number} playerIdx - Player index
   */
  playerLose(playerIdx) {
    if (playerIdx >= 0 && playerIdx < this.playerStatus.length) {
      this.playerStatus[playerIdx] = 'lose';
    }
  }

  /**
   * Update player status text
   * @param {Object} params - Update parameters
   * @param {number} params.playerIdx - Player index
   * @param {string} [params.newStatus] - New status text
   * @param {number | string} [params.textSize] - New text size
   * @param {string} [params.color] - New text color
   * @param {boolean} [params.isShadow] - Whether to apply text shadow
   */
  updateStatus({ playerIdx, newStatus, textSize, color, isShadow }) {
    if (playerIdx >= 0 && playerIdx < this.statusTexts.length) {
      const update = {};
      if (newStatus) update.text = newStatus;
      if (textSize) update.textSize = textSize;
      if (color) update.color = color;
      if (typeof isShadow === 'boolean') update.isShadow = isShadow;
      this.statusTexts[playerIdx] = {
        ...this.statusTexts[playerIdx],
        ...update,
      };
    }
  }

  /**
   * Start cooldown effect for a player
   * @param {number} playerIdx - Player index
   * @param {number} [duration] - Cooldown duration in milliseconds
   */
  startCooldown(
    playerIdx,
    duration = Settings.entity.duration[Constants.EntityStatus.COOLDOWN],
  ) {
    const now = millis();
    this.cooldowns[playerIdx] = now + duration;
  }

  /**
   * Draw cooldown effect for a player
   * @param {number} x - X-coordinate of avatar
   * @param {number} y - Y-coordinate of avatar
   * @param {number} avatarSize - Avatar size
   * @param {number} playerIdx - Player index
   */
  _drawCooldownEffect(x, y, avatarSize, playerIdx) {
    const now = millis();
    const cooldownEnd = this.cooldowns[playerIdx];
    const isCoolingDown = cooldownEnd && cooldownEnd > now;
    if (isCoolingDown) {
      // 1500-1001 ms -> 3
      // 1000-501 ms -> 2
      // 500-1 ms -> 1
      const countdownTime = Math.ceil((cooldownEnd - now) / 500);

      push();
      fill(0, 0, 0, 150);
      noStroke();
      ellipse(x, y, avatarSize, avatarSize);
      pop();

      const countdownText = new Text({
        x,
        y,
        label: countdownTime.toString(),
        textSize: Theme.text.fontSize.large,
        color: Theme.palette.white,
        textAlign: [CENTER, CENTER],
        isShadow: true,
      });
      countdownText.draw();
    }
  }
}
