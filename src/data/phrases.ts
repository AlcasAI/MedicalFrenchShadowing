// Punto d'accesso unico al catalogo di frasi.
// I contenuti vivono in /content (modulari per area), facili da estendere
// verso le 5.000. Le altre pagine continuano a importare da "../data/phrases".

import type { Phrase } from "./taxonomy";
import { ANAMNESI } from "./content/anamnesi";
import { URGENZE } from "./content/urgenze";
import { CARDIOLOGIA } from "./content/cardiologia";
import { IMAGING } from "./content/imaging";

export * from "./taxonomy";

export const PHRASES: Phrase[] = [
  ...ANAMNESI,
  ...URGENZE,
  ...CARDIOLOGIA,
  ...IMAGING,
];
