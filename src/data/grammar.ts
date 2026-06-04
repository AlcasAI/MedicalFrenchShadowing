// Libreria delle regole grammaticali (approccio "ibrido")
// Ogni frase porta un tag -> una regola scritta UNA volta qui (titolo + spiegazione + schema).
// La frase può aggiungere un campo "focus" con la forma specifica che incarna la regola.
// Vantaggio: ripetizione spaziata della stessa regola su tante frasi diverse.

export type GrammarTag =
  | "presente-indicativo"
  | "interro-inversione"
  | "interro-inversione-pronome"
  | "interro-t-eufonico"
  | "interro-est-ce-que"
  | "interro-parola-interrogativa"
  | "il-y-a"
  | "depuis-presente"
  | "passato-prossimo"
  | "passato-prossimo-passivo"
  | "imperfetto"
  | "trapassato-prossimo"
  | "futuro-semplice"
  | "futuro-prossimo"
  | "condizionale-presente"
  | "condizionale-passato"
  | "ipotetica-reale"
  | "ipotetica-irreale-presente"
  | "ipotetica-irreale-passato"
  | "congiuntivo-presente"
  | "imperativo"
  | "verbo-pronominale"
  | "pronome-complemento"
  | "semiausiliare-infinito"
  | "articolo-partitivo"
  | "accordo-aggettivo"
  | "negazione"
  | "pronome-on"
  | "futuro-nella-subordinata";

export interface GrammarRule {
  /** Titolo breve mostrato in testa al riquadro */
  title: string;
  /** Spiegazione semplice (1-2 frasi) in italiano */
  explanation: string;
  /** Schema/pattern generico della costruzione */
  pattern: string;
}

export const GRAMMAR_RULES: Record<GrammarTag, GrammarRule> = {
  "presente-indicativo": {
    title: "Presente indicativo",
    explanation:
      "Azione attuale o abituale. I verbi in -er fanno -e/-es/-e/-ons/-ez/-ent.",
    pattern: "je parle · vous parlez · ils parlent",
  },
  "interro-inversione": {
    title: "Interrogativa per inversione",
    explanation:
      "Domanda formale: si inverte verbo e soggetto, uniti da trattino. Tipica del registro medico.",
    pattern: "Verbe-vous … ? (Prenez-vous … ?)",
  },
  "interro-inversione-pronome": {
    title: "Inversione con ripresa pronominale",
    explanation:
      "Quando il soggetto è un nome, si ripete con un pronome dopo il verbo (-il/-elle/-ils/-elles).",
    pattern: "La douleur est-elle … ? (nome + verbe-elle ?)",
  },
  "interro-t-eufonico": {
    title: "Inversione con -t- eufonico",
    explanation:
      "Se il verbo finisce in vocale (3ª pers.), si inserisce -t- tra verbo e pronome per il suono.",
    pattern: "irradie-t-elle … ? · a-t-il … ?",
  },
  "interro-est-ce-que": {
    title: "Interrogativa con « est-ce que »",
    explanation:
      "Forma standard di domanda senza inversione; con « qui/que » introduce soggetto o oggetto.",
    pattern: "Qu'est-ce qui vous amène ? · Est-ce que vous … ?",
  },
  "interro-parola-interrogativa": {
    title: "Domanda con parola interrogativa",
    explanation:
      "Comment, Quand, Où, Combien, Quel… aprono la domanda; spesso seguite da inversione.",
    pattern: "Comment va … ? · Quel est votre … ?",
  },
  "il-y-a": {
    title: "« Il y a » (c'è / ci sono)",
    explanation:
      "Espressione fissa di esistenza, invariabile al singolare e plurale. Interrogativa: « Y a-t-il … ? ».",
    pattern: "Il y a … · Y a-t-il … ?",
  },
  "depuis-presente": {
    title: "« Depuis » + presente (durata)",
    explanation:
      "Per un'azione iniziata nel passato e ancora in corso il francese usa il PRESENTE (non il passato come l'italiano).",
    pattern: "Depuis quand ressentez-vous … ? (presente)",
  },
  "passato-prossimo": {
    title: "Passato prossimo (passé composé)",
    explanation:
      "Azione passata e conclusa: ausiliare avoir/être al presente + participio passato.",
    pattern: "avez-vous remarqué · j'ai pris · il est arrivé",
  },
  "passato-prossimo-passivo": {
    title: "Passé composé passivo",
    explanation:
      "Forma passiva al passato: être + participio dell'azione subìta; il participio si accorda.",
    pattern: "avez-vous été opéré(e) ? (être + participio)",
  },
  "imperfetto": {
    title: "Imperfetto (imparfait)",
    explanation:
      "Descrizione, abitudine o stato nel passato. Desinenze -ais/-ait/-ions/-iez/-aient.",
    pattern: "le mollet était chaud · il toussait souvent",
  },
  "trapassato-prossimo": {
    title: "Trapassato prossimo (plus-que-parfait)",
    explanation:
      "Azione anteriore a un'altra azione passata: ausiliare all'imperfetto + participio.",
    pattern: "avait déjà développé · les fils s'étaient développés",
  },
  "futuro-semplice": {
    title: "Futuro semplice (futur simple)",
    explanation:
      "Azione futura, tono formale (piano terapeutico). Desinenze -ai/-as/-a/-ons/-ez/-ont sull'infinito.",
    pattern: "nous remplacerons · vous suivrez · il recevra",
  },
  "futuro-prossimo": {
    title: "Futuro prossimo (futur proche)",
    explanation:
      "Futuro vicino o intenzione: « aller » coniugato al presente + infinito.",
    pattern: "nous allons opérer · vous allez ressentir",
  },
  "condizionale-presente": {
    title: "Condizionale presente",
    explanation:
      "Cortesia, ipotesi o eventualità. Radice del futuro + desinenze dell'imperfetto (-ais/-ait).",
    pattern: "nous resterions · il faudrait · vous devriez",
  },
  "condizionale-passato": {
    title: "Condizionale passato",
    explanation:
      "Esprime ciò che sarebbe successo: avoir/être al condizionale + participio. Spesso nelle ipotetiche irreali.",
    pattern: "nous aurions agi · l'os ne se serait pas déplacé",
  },
  "ipotetica-reale": {
    title: "Ipotetica reale (si + presente)",
    explanation:
      "Condizione possibile: « si » + presente nella subordinata, presente o futuro nella principale.",
    pattern: "Si oui, combien … · Si cela ne suffit pas, …",
  },
  "ipotetica-irreale-presente": {
    title: "Ipotetica irreale (presente)",
    explanation:
      "Ipotesi sul presente improbabile: « si » + imperfetto → condizionale presente nella principale.",
    pattern: "Si le PSA restait élevé, nous renforcerions …",
  },
  "ipotetica-irreale-passato": {
    title: "Ipotetica irreale (passato)",
    explanation:
      "Rimpianto/ipotesi sul passato: « si » + trapassato → condizionale passato nella principale.",
    pattern: "Si vous aviez arrêté, la cicatrisation aurait été meilleure",
  },
  "congiuntivo-presente": {
    title: "Congiuntivo presente (subjonctif)",
    explanation:
      "Dopo verbi di volontà/emozione e « que ». Desinenze -e/-es/-e/-ions/-iez/-ent.",
    pattern: "je préfère que vos attentes restent · il faut que vous preniez",
  },
  "imperativo": {
    title: "Imperativo (consiglio/istruzione)",
    explanation:
      "Ordine o consiglio diretto, forma « vous » senza pronome soggetto. Centrale nelle prescrizioni.",
    pattern: "Prenez … · Évitez … · Reconsultez si …",
  },
  "verbo-pronominale": {
    title: "Verbo pronominale",
    explanation:
      "Verbo accompagnato da un pronome riflessivo (me/te/se/nous/vous). Frequente per i sintomi.",
    pattern: "se sentir · vous reposer · le ventre se gonfle",
  },
  "pronome-complemento": {
    title: "Pronomi complemento",
    explanation:
      "me/te/lui/nous/vous/le/la/les sostituiscono il complemento e precedono il verbo.",
    pattern: "Pouvez-vous me décrire … · nous vous surveillons",
  },
  "semiausiliare-infinito": {
    title: "Semiausiliare + infinito",
    explanation:
      "Pouvoir, devoir, vouloir, aller… reggono un secondo verbo all'infinito.",
    pattern: "vous devez arrêter · pouvez-vous décrire",
  },
  "articolo-partitivo": {
    title: "Articolo partitivo",
    explanation:
      "Quantità indeterminata: du/de la/de l'/des. In frase negativa diventa « de ».",
    pattern: "de la fièvre · des médicaments · pas de douleur",
  },
  "accordo-aggettivo": {
    title: "Accordo dell'aggettivo",
    explanation:
      "L'aggettivo concorda in genere e numero con il nome (o il soggetto, con « être »).",
    pattern: "selles … normales · êtes-vous essoufflé(e)",
  },
  "negazione": {
    title: "Negazione",
    explanation:
      "Si racchiude il verbo: ne … pas/plus/jamais/rien. Nel passato avvolge l'ausiliare.",
    pattern: "ne … pas · ne stoppez pas · n'a jamais eu",
  },
  "pronome-on": {
    title: "Pronome « on »",
    explanation:
      "« on » = noi (clinico) o si impersonale; verbo sempre alla 3ª persona singolare.",
    pattern: "on palpe · on recherchera · on surveillera",
  },
  "futuro-nella-subordinata": {
    title: "Futuro nella subordinata temporale",
    explanation:
      "Dopo quand/dès que/lorsque il francese usa il FUTURO (l'italiano spesso il presente).",
    pattern: "quand vous irez mieux · dès que possible",
  },
};
