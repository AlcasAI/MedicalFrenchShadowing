// Punto d'accesso unico al catalogo di frasi.
// I contenuti vivono in /content (modulari per area), facili da estendere
// verso le 5.000. Le altre pagine continuano a importare da "../data/phrases".

import type { Phrase } from "./taxonomy";
import { ANAMNESI } from "./content/anamnesi";
import { URGENZE } from "./content/urgenze";
import { CARDIOLOGIA } from "./content/cardiologia";
import { IMAGING } from "./content/imaging";
import { PNEUMOLOGIA } from "./content/pneumologia";
import { GASTROENTEROLOGIA } from "./content/gastroenterologia";
import { NEUROLOGIA } from "./content/neurologia";
import { NEFROLOGIA } from "./content/nefrologia";
import { ENDOCRINOLOGIA } from "./content/endocrinologia";
import { INFETTIVOLOGIA } from "./content/infettivologia";
import { GINECOLOGIA } from "./content/ginecologia";
import { PEDIATRIA } from "./content/pediatria";
import { ORTOPEDIA } from "./content/ortopedia";
import { DERMATOLOGIA } from "./content/dermatologia";
import { PSICHIATRIA } from "./content/psichiatria";
import { ONCOLOGIA } from "./content/oncologia";
import { CHIRURGIA } from "./content/chirurgia";
import { GERIATRIA } from "./content/geriatria";
import { UROLOGIA } from "./content/urologia";
import { ORL } from "./content/orl";
import { REUMATOLOGIA } from "./content/reumatologia";
import { EMATOLOGIA } from "./content/ematologia";
import { OFTALMOLOGIA } from "./content/oftalmologia";
import { ANESTESIA } from "./content/anestesia";
import { MEDICINA_INTERNA } from "./content/internistica";
import { ALLERGOLOGIA } from "./content/allergologia";
import { VASCOLARE } from "./content/vascolare";
import { PALLIATIVE } from "./content/palliative";
import { RIABILITAZIONE } from "./content/riabilitazione";
import { ODONTOIATRIA } from "./content/odontoiatria";
import { NEUROCHIRURGIA } from "./content/neurochirurgia";
import { CARDIOCHIRURGIA } from "./content/cardiochirurgia";
import { PLASTICA } from "./content/plastica";
import { DOLORE } from "./content/dolore";
import { TOSSICOLOGIA } from "./content/tossicologia";
import { SPORT } from "./content/sport";
import { LAVORO } from "./content/lavoro";
import { NUTRIZIONE } from "./content/nutrizione";
import { GENETICA } from "./content/genetica";
import { ANDROLOGIA } from "./content/andrologia";
import { DIABETOLOGIA } from "./content/diabetologia";
import { EPATOLOGIA } from "./content/epatologia";
import { PROCTOLOGIA } from "./content/proctologia";
import { SENOLOGIA } from "./content/senologia";
import { NUCLEARE } from "./content/nucleare";
import { IMMUNOLOGIA } from "./content/immunologia";
import { NEONATOLOGIA } from "./content/neonatologia";
import { RIPRODUZIONE } from "./content/riproduzione";
import { TRASFUSIONALE } from "./content/trasfusionale";
import { LEGALE } from "./content/legale";
import { CONIUGAZIONE } from "./content/coniugazione";

export * from "./taxonomy";

export const PHRASES: Phrase[] = [
  ...ANAMNESI,
  ...URGENZE,
  ...CARDIOLOGIA,
  ...IMAGING,
  ...PNEUMOLOGIA,
  ...GASTROENTEROLOGIA,
  ...NEUROLOGIA,
  ...NEFROLOGIA,
  ...ENDOCRINOLOGIA,
  ...INFETTIVOLOGIA,
  ...GINECOLOGIA,
  ...PEDIATRIA,
  ...ORTOPEDIA,
  ...DERMATOLOGIA,
  ...PSICHIATRIA,
  ...ONCOLOGIA,
  ...CHIRURGIA,
  ...GERIATRIA,
  ...UROLOGIA,
  ...ORL,
  ...REUMATOLOGIA,
  ...EMATOLOGIA,
  ...OFTALMOLOGIA,
  ...ANESTESIA,
  ...MEDICINA_INTERNA,
  ...ALLERGOLOGIA,
  ...VASCOLARE,
  ...PALLIATIVE,
  ...RIABILITAZIONE,
  ...ODONTOIATRIA,
  ...NEUROCHIRURGIA,
  ...CARDIOCHIRURGIA,
  ...PLASTICA,
  ...DOLORE,
  ...TOSSICOLOGIA,
  ...SPORT,
  ...LAVORO,
  ...NUTRIZIONE,
  ...GENETICA,
  ...ANDROLOGIA,
  ...DIABETOLOGIA,
  ...EPATOLOGIA,
  ...PROCTOLOGIA,
  ...SENOLOGIA,
  ...NUCLEARE,
  ...IMMUNOLOGIA,
  ...NEONATOLOGIA,
  ...RIPRODUZIONE,
  ...TRASFUSIONALE,
  ...LEGALE,
  ...CONIUGAZIONE,
];
