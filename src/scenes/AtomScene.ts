import Phaser from 'phaser';
import { DecayData } from '../types';
import Atom from '../entities/Atom';
import Electron from '../entities/Electron';

export default class AtomScene extends Phaser.Scene {
  private decayData!: DecayData;
  currentIsotope!: string;

  constructor() {
    super({ key: 'AtomScene' });
  }

  create() {
    this.decayData = this.cache.json.get('decays') as DecayData;
    this.currentIsotope = 'U238';

    this.setupUI();
    this.setupCameraDrag();
  }

  setupCameraDrag() {
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      // Only drag if the pointer is down AND not over an interactive object
      // this.input.manager.activePointer.downElement can be used or we check what's hit
      if (!pointer.isDown) return;
      
      const hitTest = this.input.hitTestPointer(pointer);
      if (hitTest.length > 0) return;

      this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
      this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
    });

    // Add zoom
    this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: any, deltaX: number, deltaY: number) => {
      const zoomSpeed = 0.001;
      const newZoom = Phaser.Math.Clamp(this.cameras.main.zoom - deltaY * zoomSpeed, 0.2, 2);
      this.cameras.main.setZoom(newZoom);
    });
  }

  setupUI() {
    this.children.removeAll(true);
    // Reset camera position when isotope changes
    this.cameras.main.scrollX = 0;
    this.cameras.main.scrollY = 0;
    
    const centerX = this.cameras.main.centerX;
    const startY = 100;

    const renderedIsotopes = new Set<string>();
    this.renderChain(centerX, startY, this.currentIsotope, renderedIsotopes);
  }

  renderChain(x: number, y: number, isotope: string, rendered: Set<string>, depth: number = 0) {
    if (depth > 20 || rendered.has(isotope)) return; 
    rendered.add(isotope);

    const scale = 1.0;
    const atom = new Atom(this, isotope, scale, this.decayData, x, y);

    // Make only the first atom "special" or keep current interaction
    atom.setInteractive(new Phaser.Geom.Circle(0, 0, atom.getRadius() + 20), Phaser.Geom.Circle.Contains);

    atom.on('pointerdown', () => {
      this.currentIsotope = isotope;
      this.setupUI();
    });

    const isoData = this.decayData.isotopes[isotope];
    if (!isoData?.decays?.length) return;

    const spacingX = 600;
    const spacingY = 300;
    const numProducts = isoData.decays.length;
    const startX = x - (numProducts - 1) * spacingX / 2;

    isoData.decays.forEach((decay, index) => {
      const productX = startX + index * spacingX;
      const productY = y + spacingY;

      // Draw Arrow - offset slightly more to avoid overlapping text/nucleus
      this.drawArrow(x, y + 100, productX, productY - 80);

      // Particle visualization
      if (decay.type === 'beta-' || decay.type === 'beta+' || decay.type === 'electron capture') {
        new Electron(this, (x + productX) / 2 + 30, (y + productY) / 2, 8);
      } else if (decay.type === 'alpha') {
        new Atom(this, 'He4', 0.2, this.decayData, (x + productX) / 2 - 40, (y + productY) / 2);
      }

      this.renderChain(productX, productY, decay.product, rendered, depth + 1);
    });
  }

  drawArrow(startX: number, startY: number, endX: number, endY: number) {
    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0xffffff, 0.5);
    
    // Draw line
    graphics.lineBetween(startX, startY, endX, endY);

    // Draw arrowhead
    const angle = Phaser.Math.Angle.Between(startX, startY, endX, endY);
    const size = 15;
    
    const p1 = Phaser.Math.RotateAround({ x: endX, y: endY }, endX, endY, angle + Math.PI - 0.5);
    const p2 = Phaser.Math.RotateAround({ x: endX, y: endY }, endX, endY, angle + Math.PI + 0.5);

    graphics.beginPath();
    graphics.moveTo(endX, endY);
    graphics.lineTo(p1.x - Math.cos(angle) * 5, p1.y - Math.sin(angle) * 5);
    graphics.lineTo(p2.x - Math.cos(angle) * 5, p2.y - Math.sin(angle) * 5);
    graphics.closePath();
    graphics.fillStyle(0xffffff, 0.5);
    graphics.fillPath();
  }
}
