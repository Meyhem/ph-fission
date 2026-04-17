import Phaser from 'phaser';

interface DecayData {
  atomicNumbers: Record<string, number>;
  isotopes: Record<string, { decays: { branchRatio: number; type: string; product: string }[] }>;
}

export default class AtomScene extends Phaser.Scene {
  private decayData!: DecayData;
  currentIsotope!: string;

  constructor() {
    super({ key: 'AtomScene' });
  }

  create() {
    this.decayData = this.cache.json.get('decays') as DecayData;
    this.currentIsotope = 'U238';

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.height / 3;

    // Render main atom
    this.renderAtom(centerX, centerY, this.currentIsotope, 1.0);

    // Render products
    this.renderProducts(centerX, centerY + 250, this.currentIsotope);
  }

  renderAtom(x: number, y: number, isotope: string, scale: number = 1.0): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const symbol = isotope.replace(/\d+$/, '');
    const massStr = isotope.match(/\d+$/)![0];
    const mass = parseInt(massStr);
    const protons = this.decayData.atomicNumbers[symbol];
    const neutrons = mass - protons;

    const nucleonRadius = 10 * scale;
    const total = protons + neutrons;
    const radius = Math.sqrt(total) * nucleonRadius * 1.2;

    // Protons red
    for (let i = 0; i < protons; i++) {
      const angle = (i / protons) * Math.PI * 2;
      const r = radius * 0.4 * Math.random();
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      const circle = this.add.circle(px, py, nucleonRadius, 0xff0000).setInteractive();
      container.add(circle);
    }

    // Neutrons blue
    for (let i = 0; i < neutrons; i++) {
      const angle = (i / neutrons) * Math.PI * 2;
      const r = radius * 0.4 * Math.random();
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      const circle = this.add.circle(px, py, nucleonRadius, 0x888888).setInteractive();
      container.add(circle);
    }

    // Label
    const labelY = 70 * scale;
    const label = this.add.text(0, labelY, isotope, {
      fontSize: (Math.floor(28 * scale) + 'px'),
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setStroke('#000000', 3);
    container.add(label);

    return container;
  }

  renderProducts(x: number, y: number, isotope: string) {
    const isoData = this.decayData.isotopes[isotope];
    if (!isoData?.decays?.length) return;

    const numProducts = isoData.decays.length;
    const spacing = 250;
    const startX = x - (numProducts - 1) * spacing / 2;

    isoData.decays.forEach((decay, index) => {
      const productX = startX + index * spacing;
      const productContainer = this.renderAtom(productX, y, decay.product, 0.6);
      productContainer.setData('isotope', decay.product);
      productContainer.setData('decayType', decay.type);

      productContainer.setInteractive(new Phaser.Geom.Rectangle(-100, -100, 200, 200), Phaser.Geom.Rectangle.Contains);

      productContainer.on('pointerdown', () => {
        this.children.removeAll(true);
        const newIsotope = productContainer.getData('isotope') as string;
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.height / 3;
        this.renderAtom(centerX, centerY, newIsotope, 1.0);
        this.renderProducts(centerX, centerY + 250, newIsotope);
        this.currentIsotope = newIsotope;
      });
    });
  }
}