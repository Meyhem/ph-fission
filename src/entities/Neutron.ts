import Phaser from 'phaser';

export default class Neutron extends Phaser.GameObjects.Arc {
  constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
    super(scene, x, y, radius, 0, 360, false, 0x888888);
    this.setStrokeStyle(1, 0x000000, 0.5);
  }
}
