import Phaser from 'phaser';
import { DecayData } from '../types';
import Proton from './Proton';
import Neutron from './Neutron';

export default class Atom extends Phaser.GameObjects.Container {
  private decayData: DecayData;
  private isotope: string;
  private atomScale: number;

  constructor(scene: Phaser.Scene, isotope: string, scale: number, decayData: DecayData, x: number, y: number) {
    super(scene, x, y);
    this.decayData = decayData;
    this.isotope = isotope;
    this.atomScale = scale;

    this.render();
    scene.add.existing(this);
  }

  private render() {
    const symbol = this.isotope.replace(/\d+$/, '');
    const massStr = this.isotope.match(/\d+$/)![0];
    const mass = parseInt(massStr);
    const protonsCount = this.decayData.atomicNumbers[symbol] || 0;
    const neutronsCount = Math.max(0, mass - protonsCount);

    const nucleonRadius = 8 * this.atomScale;
    const total = protonsCount + neutronsCount;

    // Create a list of nucleons and shuffle them
    const nucleons: ('p' | 'n')[] = [
      ...Array(protonsCount).fill('p'),
      ...Array(neutronsCount).fill('n')
    ];
    
    // Simple shuffle
    for (let i = nucleons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nucleons[i], nucleons[j]] = [nucleons[j], nucleons[i]];
    }

    // Vogel's spiral for tight packing
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    
    nucleons.forEach((type, i) => {
      const r = nucleonRadius * Math.sqrt(i + 1) * 1.1;
      const theta = i * goldenAngle;
      
      const px = Math.cos(theta) * r;
      const py = Math.sin(theta) * r;
      
      if (type === 'p') {
        const proton = new Proton(this.scene, px, py, nucleonRadius);
        this.add(proton);
      } else {
        const neutron = new Neutron(this.scene, px, py, nucleonRadius);
        this.add(neutron);
      }
    });

    // Label
    // Adjust label position based on nucleus size
    const nucleusRadius = nucleonRadius * Math.sqrt(total) * 1.1;
    const labelY = nucleusRadius + (30 * this.atomScale);
    const label = this.scene.add.text(0, labelY, this.isotope, {
      fontSize: (Math.floor(28 * this.atomScale) + 'px'),
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setStroke('#000000', 3);
    this.add(label);
  }

  public getIsotope(): string {
    return this.isotope;
  }
}
