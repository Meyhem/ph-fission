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
    const centerY = this.cameras.main.height / 3;

    // Render main atom
    new Atom(this, this.currentIsotope, 1.0, this.decayData, centerX, centerY);

    // Render products
    this.renderProducts(centerX, centerY + 300, this.currentIsotope);
  }

  renderProducts(x: number, y: number, isotope: string) {
    const isoData = this.decayData.isotopes[isotope];
    if (!isoData?.decays?.length) return;

    const numProducts = isoData.decays.length;
    const spacing = 350;
    const startX = x - (numProducts - 1) * spacing / 2;

    isoData.decays.forEach((decay, index) => {
      const productX = startX + index * spacing;
      
      // Decay type label
      this.add.text(productX, y - 100, `Decay: ${decay.type}`, {
        fontSize: '18px',
        color: '#aaaaaa'
      }).setOrigin(0.5);

      // Arrow
      this.add.text(productX, y - 70, '↓', {
        fontSize: '32px',
        color: '#ffffff'
      }).setOrigin(0.5);

      // Visualize emitted particle
      if (decay.type === 'beta-') {
        new Electron(this, productX + 80, y - 50, 10);
      } else if (decay.type === 'beta+' || decay.type === 'electron capture') {
        // For beta+, we'll use Electron but maybe we should color it differently? 
        // Let's just make it visible first.
        new Electron(this, productX + 80, y - 50, 10);
      } else if (decay.type === 'alpha') {
        // Alpha particle is just a small He4 atom
        new Atom(this, 'He4', 0.3, this.decayData, productX - 80, y - 50);
      }

      const productAtom = new Atom(this, decay.product, 0.7, this.decayData, productX, y);
      
      // Interaction
      productAtom.setInteractive(new Phaser.Geom.Circle(0, 0, 80), Phaser.Geom.Circle.Contains);
      productAtom.on('pointerdown', () => {
        this.currentIsotope = decay.product;
        this.setupUI();
      });
      
      // Hover effect
      productAtom.on('pointerover', () => {
        productAtom.setScale(1.1);
      });
      productAtom.on('pointerout', () => {
        productAtom.setScale(1.0);
      });
    });
  }
}
