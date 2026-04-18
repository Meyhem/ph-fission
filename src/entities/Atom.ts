import Phaser from 'phaser';
import { DecayData } from '../types';
import Proton from './Proton';
import Neutron from './Neutron';

export default class Atom extends Phaser.GameObjects.Container {
  private decayData: DecayData;
  private isotope: string;
  private atomScale: number;
  private radius: number = 0;

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

    // Create a list of nucleons and shuffle them (except for He4)
    const nucleons: ('p' | 'n')[] = [];
    if (protonsCount === 2 && neutronsCount === 2) {
      // Perfect cross for He4
      nucleons.push('p', 'n', 'p', 'n');
    } else {
      for (let i = 0; i < protonsCount; i++) nucleons.push('p');
      for (let i = 0; i < neutronsCount; i++) nucleons.push('n');
      
      // Shuffle types for random appearance
      for (let i = nucleons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nucleons[i], nucleons[j]] = [nucleons[j], nucleons[i]];
      }
    }

    // Get positions
    const positions = this.getNucleonPositions(total, nucleonRadius);

    let maxR = 0;
    nucleons.forEach((type, i) => {
      const { x, y } = positions[i];
      maxR = Math.max(maxR, Math.sqrt(x * x + y * y));
      if (type === 'p') {
        const proton = new Proton(this.scene, x, y, nucleonRadius);
        this.add(proton);
      } else {
        const neutron = new Neutron(this.scene, x, y, nucleonRadius);
        this.add(neutron);
      }
    });
    this.radius = maxR + nucleonRadius;

    // Label position adapts to nucleus size
    const labelY = this.radius + (25 * this.atomScale);
    const label = new Phaser.GameObjects.Text(this.scene, 0, labelY, this.isotope, {
      fontSize: (Math.floor(28 * this.atomScale) + 'px'),
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setStroke('#000000', 3);
    this.add(label);
  }

  private getNucleonPositions(total: number, nucleonRadius: number): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];
    
    // Tight packing: significantly reduce spacing for heavy overlap
    const tightSpacing = nucleonRadius * 0.8;

    if (total === 1) {
      positions.push({ x: 0, y: 0 });
    } else if (total === 2) {
      positions.push({ x: -nucleonRadius * 0.4, y: 0 });
      positions.push({ x: nucleonRadius * 0.4, y: 0 });
    } else if (total === 3) {
      const h = nucleonRadius * Math.sqrt(3) * 0.4;
      positions.push({ x: 0, y: -h * 2/3 });
      positions.push({ x: -nucleonRadius * 0.4, y: h * 1/3 });
      positions.push({ x: nucleonRadius * 0.4, y: h * 1/3 });
    } else if (total === 4) {
      // Extremely tight Cross pattern for He4
      const r = nucleonRadius * 0.5;
      positions.push({ x: 0, y: -r }); // Top
      positions.push({ x: r, y: 0 });  // Right
      positions.push({ x: 0, y: r });  // Bottom
      positions.push({ x: -r, y: 0 }); // Left
    } else {
      // Packed random distribution for organic appearance
      // Scale radius based on total particles to maintain packing
      const radius = nucleonRadius * Math.sqrt(total) * 0.7;
      for (let i = 0; i < total; i++) {
        // Use uniform distribution in circle
        const r = radius * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        positions.push({
          x: Math.cos(theta) * r,
          y: Math.sin(theta) * r
        });
      }
    }
    return positions;
  }

  public getIsotope(): string {
    return this.isotope;
  }

  public getRadius(): number {
    return this.radius;
  }
}
