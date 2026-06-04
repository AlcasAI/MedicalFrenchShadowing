# 🩺🇫🇷 Medical French Shadowing

Web-app (PWA) per portare un **medico italiano** verso il **francese medico C2**,
con focus sull'**ascolto passivo** e sullo **shadowing**.

### ▶️ Prova l'app: https://alcasai.github.io/MedicalFrenchShadowing/
Si apre su telefono e desktop e si può installare come app (Aggiungi a schermata Home).

> ⚠️ **Prototipo.** L'esperienza è centrata sulla **modalità passiva**, completa e
> funzionante. L'audio usa per ora la sintesi vocale del browser (Web Speech API)
> come segnaposto; i contenuti sono materiale didattico, non linee guida cliniche.

## Cosa fa
- 🎧 **Ascolto passivo** — frasi cliniche in francese con traduzione italiana, in
  loop, con ripetizioni e pause configurabili. Pensato per l'uso "a mani libere".
- 🗣️ **Shadowing** — ripetizione ad alta voce con loop, gap (pausa per ripetere) e
  velocità 0.7×/1×.
- 📘 **Grammatica integrata** — ogni frase mostra la regola che la governa
  (passé composé, congiuntivo, ipotetiche, partitivi…) con spiegazione, focus
  specifico e schema del pattern. Copertura: **tutte le ~5.000 frasi**.

## Contenuti
~5.000 frasi su **50+ specialità** (cardiologia, chirurgia, pediatria, urgenze,
neurologia…), graduate per livello CEFR **B2 / C1 / C2** e per fase della visita
(anamnesi, esame obiettivo, diagnosi, terapia, comunicazione).

## Principi pedagogici
Comprehensible input · Shadowing · Ascolto passivo continuo · Doppio sottotitolo
FR↔IT · Chunking di frasi mediche · Grammatica contestuale · Progressione verso il C2.

## Sviluppo
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build di produzione
```
Il tag grammaticale di ogni frase è generato da `scripts/tag_grammar.py`
(euristica sul testo francese) → `src/data/grammarMap.ts`.

## Stack
React + TypeScript + Vite · React Router · stato locale (localStorage, nessun
server) · deploy automatico su GitHub Pages.

## Prossimi passi
1. Audio pre-generato reale (TTS cloud → file mp3) + sincronizzazione waveform
2. Contenuti medici validati clinicamente
3. Valutazione della pronuncia (ASR) nello shadowing
4. SRS completo (FSRS) + sincronizzazione multi-dispositivo
