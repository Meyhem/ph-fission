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
  }

  setupUI() {
    this.children.removeAll(true);
    
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
