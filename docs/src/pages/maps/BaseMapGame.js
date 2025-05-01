/**
 * Base class for all map game pages
 * Handles common game mechanics and entity management
 */
class BaseMapGame extends BasePage {
  /**
   * @param {Object} params - The parameters for the map page.
   * @param {number} [params.robotNumber] - The number of robots.
   * @param {image} [params.background] - Image resources path.
   * @param {{ size: keyof typeof Constants.EntitySize }} [params.playerParams] - The params of players.
   * @param {{ size: keyof typeof Constants.EntitySize }} [params.robotParams] - The params of robots.
   */
  constructor(params) {
    super(params);
    this.players = [];
    this.robots = [];
    this.alivePlayerCtn = Store.getPlayerNumber();

    this.robotNumber = params?.robotNumber || 20;
    this.playerParams = params.playerParams || {};
    this.robotParams = params.robotParams || {};

    this.gameOverText = null;
    this.playerList = null;
    this.isWaitingForGameOver = false;

    this.countDown = 3;
    this.countDownText = null;

    this.hasCooldownEffect = false;
  }

  /**
   * Initialize game elements
   * @override
   */
  setup() {
    super.setup();

    this.gameOverText = new Text({
      label: '',
      x: width / 2,
      y: height / 2,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.large,
      textStyle: BOLD,
      stroke: Theme.palette.text.primary,
      strokeWeight: 1,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    // initialize players
    for (let pIdx = 0; pIdx < Settings.players.length; pIdx++) {
      const newPlayer = {
        ...this.playerParams,
        idx: pIdx,
        controls: Settings.players[pIdx].controls,
        shapeType: this.shapeType,
        size: Constants.EntitySize.M,
        canDie: true,
        isPaused: true,
      };
      if (this.shapeType == Constants.EntityType.PLAYER) {
        newPlayer.color = Object.values(Theme.palette.player)[pIdx];
      }
      this.players.push(new Player(newPlayer));
    }

    // initialize robots
    for (let rIdx = 0; rIdx < this.robotNumber; rIdx++) {
      this.robots.push(
        new Robot({
          ...this.robotParams,
          idx: rIdx,
          size: Constants.EntitySize.M,
          isPaused: true,
        }),
      );
    }

    // initialize player list and text
    this.playerList = new PlayerList({
      label: 'Fight',
      textSize: Theme.text.fontSize.large,
      isShadow: true,
    });

    this._setupCountDown();
  }

  /** Setup countdown before game starts */
  _setupCountDown() {
    Resources.sounds.soundEffect.countdown.play(true);
    this.countDownText = new Text({
      label: this.countDown.toString(),
      x: width / 2,
      y: height / 2,
      color: Theme.palette.yellow,
      textSize: Theme.text.fontSize.largeTitle * 2.5,
      textStyle: BOLD,
      stroke: Theme.palette.text.primary,
      strokeWeight: 12,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    const intervalId = window.setInterval(() => {
      this.countDown--;
      this.countDownText.label = this.countDown
        ? this.countDown.toString()
        : 'GO'; // show 'GO' when countDown is 0
      this.countDownText.textSize = Theme.text.fontSize.largeTitle * 2.5;

      // start the game when count down finish
      if (this.countDown === -1) {
        this.setAllEntitiesPaused(Constants.EntityType.PLAYER, false);
        this.setAllEntitiesPaused(Constants.EntityType.ROBOT, false);
        window.clearInterval(intervalId);
      }
    }, 528);
  }

  /**
   * Render game page
   * @override
   */
  draw() {
    super.draw();

    // override for game 6 to draw additional items, Default: do nothing
    this.preDrawEntities();

    // draw dying entities first to show alive entities on the top
    const sortedEntities = [...this.players, ...this.robots];
    sortedEntities.sort(
      (a, b) =>
        (b.status === Constants.EntityStatus.DIED) -
        (a.status === Constants.EntityStatus.DIED),
    );
    sortedEntities.forEach((entity) => {
      this.drawEntity(entity);

      // update player list label
      if (
        entity.type === Constants.EntityType.PLAYER &&
        entity.status === Constants.EntityStatus.DIED
      ) {
        this.playerList.playerLose(entity.idx);
        this.playerList.updateStatus({
          playerIdx: entity.idx,
          newStatus: 'K.O.',
          textSize: Theme.text.fontSize.large,
          color: Theme.palette.black,
          isShadow: false,
        });
      } else if (
        entity.type === Constants.EntityType.PLAYER &&
        entity.status === Constants.EntityStatus.HIT &&
        !entity.hasCooldownEffect
      ) {
        this._cooldownSession(entity);
      }
    });

    this.playerList.draw();
    this._drawGameFinish();
    if (this.countDown >= 0) this._drawCountDown();
  }

  /** Handle game finish conditions */
  _drawGameFinish() {
    if (this.alivePlayerCtn > 1) return;

    // get winner
    const alivePlayer = this.players.find(
      ({ status }) => status !== Constants.EntityStatus.DIED,
    );

    // if there is a winner, turn winner into player shape
    if (alivePlayer) {
      // turn winner into player shape
      alivePlayer.updateParams({
        shapeType: Constants.EntityType.PLAYER,
        color: Object.values(Theme.palette.player)[alivePlayer.idx],
      });
    }

    // show winner text for 3 seconds
    this.gameOverText?.draw({
      label: alivePlayer
        ? `Winner is Player ${alivePlayer.idx + 1}!`
        : 'No Winner!',
    });
    if (this.isWaitingForGameOver) return;
    this.isWaitingForGameOver = true;

    // update score globally
    if (alivePlayer) Controller.updateScoreAfterGame(alivePlayer.idx);
    window.setTimeout(() => {
      Controller.changePage(new Results(), Constants.Page.RESULTS);
    }, 3000);
  }

  /** Draw countdown animation */
  _drawCountDown() {
    push();
    if (this.countDown > 0) {
      this.countDownText.textSize = this.countDownText.textSize * 0.97;
      this.countDownText.draw();
    } else if (this.countDown == 0) {
      // shake 'GO' when countDown is 0
      translate(this.countDownText.x, this.countDownText.y);
      const angle = this._getRotateAngle();
      rotate(angle * 0.05);
      this.countDownText.draw({ x: 0, y: 0 });
    }
    pop();
  }

  /**
   * Calculate rotation angle for GO animation
   * Rotate angle: 0, 1, 2, 3, 2, 1, 0, -1, -2, -3, -2, -1
   * @returns {number} Rotation angle
   */
  _getRotateAngle() {
    const cycleLength = 12;
    const index = frameCount % cycleLength;
    if (index <= 3) return index;
    if (index <= 9) return 6 - index;
    return index - 12;
  }

  /**
   * Handle key press events
   * @override
   */
  keyPressed() {
    super.keyPressed();

    this.players.forEach((player) => {
      if (player.status === Constants.EntityStatus.DIED) return;
      player.keyPressed([...this.robots, ...this.players], (diedEntity) => {
        if (diedEntity.type !== Constants.EntityType.PLAYER) return;
        this.alivePlayerCtn--;
      });
    });
  }

  /**
   * Handle player cooldown effects
   * @param {Entity} entity - Player entity
   */
  _cooldownSession(entity) {
    // avatars effect
    this.playerList.startCooldown(entity.idx);

    // text effect
    entity.hasCooldownEffect = true;
    this.playerList.updateStatus({
      playerIdx: entity.idx,
      newStatus: 'Fight',
      textSize: Theme.text.fontSize.large,
      color: Theme.palette.darkGrey,
      isShadow: true,
    });

    setTimeout(() => {
      this.playerList.updateStatus({
        playerIdx: entity.idx,
        newStatus: 'Fight',
        color: Object.values(Theme.palette.player)[entity.idx],
        textSize: Theme.text.fontSize.large,
        isShadow: true,
      });
      entity.hasCooldownEffect = false;
    }, Settings.entity.duration[Constants.EntityStatus.COOLDOWN]);
  }

  /**
   * Draw game entity
   * @param {Entity} entity - Entity to draw
   */
  drawEntity(entity) {
    entity.draw?.();
  }

  /**
   * Pre-draw hook for additional elements
   */
  preDrawEntities() {}
}
