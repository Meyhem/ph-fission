import Phaser from 'phaser';
import AtomScene from './scenes/AtomScene';

class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }
  preload() {
    this.load.json('decays', '/decay-data.json');
  }
  create() {
    this.scene.start('AtomScene');
  }
}

const config: Phaser.Types.Core.PhaserConfig = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  parent: 'phaser-container',
  backgroundColor: '#000033',
  scene: [BootScene, AtomScene]
};

const game = new Phaser.Game(config);
(window as any).game = game;