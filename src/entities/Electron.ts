import Phaser from 'phaser';

export default class Electron extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, radius: number = 6) {
    super(scene, x, y);

    const circle = new Phaser.GameObjects.Arc(scene, 0, 0, radius, 0, 360, false, 0x00aaff);
    circle.setStrokeStyle(2, 0x000000, 1);
    this.add(circle);

    const minus = new Phaser.GameObjects.Text(scene, 0, 0, '-', {
      fontSize: Math.floor(radius * 1.8) + 'px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    this.add(minus);

    this.setDepth(100);
    scene.add.existing(this);
  }
}
