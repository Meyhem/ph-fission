export interface DecayData {
  atomicNumbers: Record<string, number>;
  isotopes: Record<string, { decays: { branchRatio: number; type: string; product: string }[] }>;
}