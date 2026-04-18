import Phaser from 'phaser';

export default class Electron extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, radius: number = 6) {
    super(scene, x, y);

    const circle = scene.add.arc(0, 0, radius, 0, 360, false, 0x00aaff);
    circle.setStrokeStyle(1, 0x000000, 0.5);
    this.add(circle);

    const minus = scene.add.text(0, 0, '-', {
      fontSize: Math.floor(radius * 1.5) + 'px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add(minus);

    scene.add.existing(this);
  }
}
