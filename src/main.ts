import Phaser from 'phaser';
// import scenes later

class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }
  preload() {
    this.load.json('decays', 'decay-data.json');
  }
  create() {
    this.scene.start('AtomScene');
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  parent: 'phaser-container',
  scene: [BootScene]
};

const game = new Phaser.Game(config);

export default game;