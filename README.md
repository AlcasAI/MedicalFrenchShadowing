# 🩺🇫🇷 Medical French Shadowing

Suite per portare un **medico italiano** al **francese medico C2**, con focus sullo
**shadowing** e sull'apprendimento **passivo**.

> ⚠️ **Stato attuale: PROTOTIPO VISIVO.** UI e navigazione complete con dati demo.
> La voce usa il TTS del browser come segnaposto; nella versione reale si userà
> **audio pre-generato** e contenuti medici validati.

## Decisioni di progetto
- **Piattaforma:** PWA (web + mobile, un solo codice)
- **Audio:** pre-generato (segnaposto: Web Speech API)
- **Contenuti:** generati internamente, per livello CEFR (B2/C1/C2) e specialità

## Principi pedagogici implementati nel design
Comprehensible input · Shadowing (loop / gap / velocità) · Spaced Repetition (SRS) ·
Chunking di frasi mediche · Doppio sottotitolo FR↔IT · Ascolto passivo continuo ·
Progressione verso il C2.

## Schermate del prototipo
| Schermata | Descrizione |
|---|---|
| **Home** | Dashboard: livello stimato, streak, CTA rapide |
| **Libreria** | Frasi per specialità e livello |
| **Shadowing** | Player con loop, gap (pausa per ripetere), velocità 0.7×/1×, registrazione (demo) |
| **Passivo** | Riproduzione continua a schermo intero (FR / FR+IT / FR×2) |
| **Ripasso** | Flashcard SRS con valutazione (Leitner) |
| **Progressi** | Statistiche e distribuzione per livello |

## Sviluppo
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build di produzione
```

## Stack
React + TypeScript + Vite · routing con React Router · stato locale (localStorage).

## Prossimi passi (post-validazione UI)
1. Audio pre-generato reale (TTS cloud → file mp3) + sincronizzazione waveform
2. Contenuti medici ampi validati (via MCP letteratura medica)
3. Valutazione pronuncia (ASR) nello shadowing
4. SRS completo (FSRS) + sync multi-dispositivo
