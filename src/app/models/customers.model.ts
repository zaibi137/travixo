export interface CustomerProfile {
  id: number;
  clicod: string;
  clinam: string;
  clityp: string;
  mobnum: string;
  whtnum?: string;
  emladr: string;
  cnic?: string;
  pasnum?: string;
  pasexp?: string;
  dobdat?: string;
  nation?: string;
  gender?: string;
  agtcod?: string;
  crdlmt: number;
  depamt: number;
  paytrm?: string;
  crdsts?: string;
  address?: string;
  status: number; // 1 for Active, 0 for Inactive
  createdAt?: string;
  createdBy?: string;
}