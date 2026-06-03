// Dataset DEMO di frasi mediche francesi per il prototipo visivo.
// Nella versione reale questo sarà sostituito da contenuti validati
// (via MCP letteratura medica) con audio pre-generato.

export type Level = "B2" | "C1" | "C2";

export type Specialty =
  | "Anamnèse"
  | "Examen clinique"
  | "Urgences"
  | "Cardiologie"
  | "Pharmacologie"
  | "Annonce diagnostique";

export interface Phrase {
  id: string;
  fr: string;
  it: string;
  ipa?: string;
  level: Level;
  specialty: Specialty;
  // Nota didattica: pronuncia, grammatica o uso clinico
  tip?: string;
}

export const SPECIALTIES: { name: Specialty; emoji: string; color: string }[] = [
  { name: "Anamnèse", emoji: "🗣️", color: "#0d9488" },
  { name: "Examen clinique", emoji: "🩺", color: "#2563eb" },
  { name: "Urgences", emoji: "🚑", color: "#dc2626" },
  { name: "Cardiologie", emoji: "❤️", color: "#db2777" },
  { name: "Pharmacologie", emoji: "💊", color: "#7c3aed" },
  { name: "Annonce diagnostique", emoji: "📋", color: "#ea580c" },
];

export const PHRASES: Phrase[] = [
  // ---- Anamnèse ----
  {
    id: "an-1",
    fr: "Depuis combien de temps ressentez-vous cette douleur ?",
    it: "Da quanto tempo avverte questo dolore?",
    ipa: "də.pɥi kɔ̃.bjɛ̃ də tɑ̃ ʁə.sɑ̃.te vu sɛt du.lœʁ",
    level: "B2",
    specialty: "Anamnèse",
    tip: "Inversione formale soggetto-verbo: tipica del registro clinico.",
  },
  {
    id: "an-2",
    fr: "Pourriez-vous me décrire la nature exacte de vos symptômes ?",
    it: "Potrebbe descrivermi la natura esatta dei suoi sintomi?",
    level: "C1",
    specialty: "Anamnèse",
    tip: "« Pourriez-vous » = condizionale di cortesia, indispensabile col paziente.",
  },
  {
    id: "an-3",
    fr: "Avez-vous des antécédents familiaux de maladies cardiovasculaires ?",
    it: "Ha precedenti familiari di malattie cardiovascolari?",
    level: "B2",
    specialty: "Anamnèse",
    tip: "« antécédents » è il termine clinico per anamnesi/precedenti.",
  },
  {
    id: "an-4",
    fr: "Je vais vous poser quelques questions afin de mieux cerner votre état général.",
    it: "Le farò alcune domande per inquadrare meglio il suo stato generale.",
    level: "C2",
    specialty: "Anamnèse",
    tip: "« cerner » (circoscrivere/inquadrare) eleva il registro a C2.",
  },

  // ---- Examen clinique ----
  {
    id: "ex-1",
    fr: "Allongez-vous sur le dos et détendez votre abdomen, s'il vous plaît.",
    it: "Si sdrai supino e rilassi l'addome, per favore.",
    level: "B2",
    specialty: "Examen clinique",
    tip: "« Allongez-vous » imperativo riflessivo; « sur le dos » = supino.",
  },
  {
    id: "ex-2",
    fr: "Je vais ausculter vos poumons ; respirez profondément par la bouche.",
    it: "Le ausculto i polmoni; respiri profondamente con la bocca.",
    level: "C1",
    specialty: "Examen clinique",
    tip: "« ausculter » falso amico facile da padroneggiare.",
  },
  {
    id: "ex-3",
    fr: "La palpation révèle une sensibilité au niveau de la fosse iliaque droite.",
    it: "La palpazione rivela dolorabilità a livello della fossa iliaca destra.",
    level: "C2",
    specialty: "Examen clinique",
    tip: "Lessico topografico preciso: « fosse iliaque droite ».",
  },

  // ---- Urgences ----
  {
    id: "ur-1",
    fr: "Restez avec moi, les secours arrivent dans quelques minutes.",
    it: "Resti con me, i soccorsi arrivano tra pochi minuti.",
    level: "B2",
    specialty: "Urgences",
    tip: "« les secours » = i soccorsi; registro rassicurante.",
  },
  {
    id: "ur-2",
    fr: "Le patient présente une détresse respiratoire aiguë, il faut l'intuber.",
    it: "Il paziente presenta un'insufficienza respiratoria acuta, bisogna intubarlo.",
    level: "C1",
    specialty: "Urgences",
    tip: "« détresse respiratoire » collocazione fissa da memorizzare.",
  },
  {
    id: "ur-3",
    fr: "Nous avons posé une voie veineuse et débuté un remplissage vasculaire.",
    it: "Abbiamo posizionato un accesso venoso e avviato il riempimento volemico.",
    level: "C2",
    specialty: "Urgences",
    tip: "« poser une voie veineuse » / « remplissage vasculaire »: gergo rianimazione.",
  },

  // ---- Cardiologie ----
  {
    id: "ca-1",
    fr: "Ressentez-vous des palpitations ou un essoufflement à l'effort ?",
    it: "Avverte palpitazioni o affanno sotto sforzo?",
    level: "B2",
    specialty: "Cardiologie",
    tip: "« essoufflement à l'effort » = dispnea da sforzo.",
  },
  {
    id: "ca-2",
    fr: "L'électrocardiogramme met en évidence un sus-décalage du segment ST.",
    it: "L'elettrocardiogramma evidenzia un sopraslivellamento del tratto ST.",
    level: "C2",
    specialty: "Cardiologie",
    tip: "« sus-décalage du segment ST » = sopra-ST, termine cardine in cardiologia.",
  },
  {
    id: "ca-3",
    fr: "Il convient d'instaurer un traitement anticoagulant sans délai.",
    it: "È opportuno instaurare una terapia anticoagulante senza indugio.",
    level: "C1",
    specialty: "Cardiologie",
    tip: "« il convient de » + infinito: formula impersonale molto francese.",
  },

  // ---- Pharmacologie ----
  {
    id: "ph-1",
    fr: "Prenez ce comprimé deux fois par jour, au cours des repas.",
    it: "Prenda questa compressa due volte al giorno, durante i pasti.",
    level: "B2",
    specialty: "Pharmacologie",
    tip: "« au cours des repas » = durante i pasti (posologia).",
  },
  {
    id: "ph-2",
    fr: "Ce médicament peut entraîner une somnolence ; évitez de conduire.",
    it: "Questo farmaco può causare sonnolenza; eviti di guidare.",
    level: "C1",
    specialty: "Pharmacologie",
    tip: "« entraîner » nel senso di « provocare » un effetto.",
  },
  {
    id: "ph-3",
    fr: "La posologie sera adaptée en fonction de votre clairance de la créatinine.",
    it: "La posologia sarà adattata in base alla sua clearance della creatinina.",
    level: "C2",
    specialty: "Pharmacologie",
    tip: "« en fonction de » = in base a; lessico nefro-farmacologico.",
  },

  // ---- Annonce diagnostique ----
  {
    id: "ad-1",
    fr: "Les résultats confirment malheureusement notre première hypothèse.",
    it: "I risultati confermano purtroppo la nostra prima ipotesi.",
    level: "C1",
    specialty: "Annonce diagnostique",
    tip: "Posizione di « malheureusement »: ammorbidisce l'annuncio.",
  },
  {
    id: "ad-2",
    fr: "Je tiens à ce que nous abordions ensemble les options thérapeutiques.",
    it: "Tengo a che affrontiamo insieme le opzioni terapeutiche.",
    level: "C2",
    specialty: "Annonce diagnostique",
    tip: "« Je tiens à ce que » + congiuntivo: alto registro empatico.",
  },
  {
    id: "ad-3",
    fr: "Prenez le temps qu'il vous faut, je reste à votre entière disposition.",
    it: "Si prenda il tempo necessario, resto a sua completa disposizione.",
    level: "B2",
    specialty: "Annonce diagnostique",
    tip: "« à votre entière disposition »: formula di cortesia professionale.",
  },
];

export const LEVELS: Level[] = ["B2", "C1", "C2"];
