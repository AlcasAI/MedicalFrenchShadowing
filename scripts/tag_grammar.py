#!/usr/bin/env python3
# Tagger euristico: assegna a ogni frase FR una regola grammaticale (GrammarTag)
# + una riga "focus" con la forma specifica. Genera src/data/grammarMap.ts.
import re, glob, os, json

CONTENT = glob.glob(os.path.join(os.path.dirname(__file__), "..", "src", "data", "content", "*.ts"))

OBJ_RE = re.compile(r'id:\s*"([^"]+)"[\s\S]*?fr:\s*"((?:[^"\\]|\\.)*)"')

IMPF_STOP = {"jamais", "mais", "désormais", "frais", "épais", "vrai", "vrais",
             "lait", "fait", "parfait", "extrait", "trait", "souhait", "lais", "biais"}
IMPER_IRREG = {"faites", "sachez", "veuillez", "soyez", "ayez", "allez"}

def first_word(s):
    m = re.match(r"^([A-Za-zÀ-ÿ']+)", s.strip())
    return m.group(1) if m else ""

def find(pattern, s, flags=re.I):
    m = re.search(pattern, s, flags)
    return m.group(0).strip() if m else None

def has(pattern, s, flags=re.I):
    return re.search(pattern, s, flags) is not None

# --- pattern di rilevamento ---
FUTUR = r"\b\w{2,}r(?:a|ai|as|ons|ez|ont)\b"
# Condizionale presente: solo -erait/-irait regolari + irregolari noti
# (evita falsi positivi su imperfetti con stem in -r: montrait, mesurait, entrait...)
COND_PRES = (r"\b\w+(?:erais|erait|erions|eriez|eraient|irais|irait|irions|iriez|iraient)\b"
             r"|\b(?:serais|serait|serions|seriez|seraient|aurais|aurait|aurions|auriez|auraient"
             r"|faudrait|pourrais|pourrait|pourrions|pourriez|pourraient|devrais|devrait|devrions|devriez|devraient"
             r"|voudrais|voudrait|voudrions|voudriez|ferais|ferait|ferions|feriez|feraient"
             r"|saurait|verrait|viendrait|tiendrait|vaudrait)\b")
COND_PASSE = r"\b(?:aurais|aurait|aurions|auriez|auraient|serais|serait|serions|seriez|seraient)\s+\w+"
FUTUR_PROCHE = r"\b(?:allons|allez|vais|va|vont)\s+[a-zà-ÿ]+(?:er|ir|re)\b"
# Passé composé: ammette inversione (avez-vous) e un avverbio (déjà, jamais...) tra ausiliare e participio
ADV = r"(?:déjà\s+|jamais\s+|récemment\s+|souvent\s+|bien\s+|trop\s+|enfin\s+|encore\s+)?"
PC_AVOIR = (r"\b(?:ai|as|a|avons|avez|ont)(?:-(?:je|vous|tu|il|elle|on|nous|ils|elles))?\s+"
            + ADV + r"\w*(?:é|és|ée|ées|is|it|us|u)\b")
PC_PASSIF = r"\bété\s+\w+(?:é|és|ée|ées)\b"
PQP = r"\b(?:avait|avaient|avais|avions|aviez)\s+\w+(?:é|és|ée|ées|is|it|us|u)\b|\bs'étai(?:t|ent)\s+\w+"
IMPF = r"\b\w+(?:ait|aient|ais|ions|iez)\b"
CONJ_TEMP = r"\b(quand|dès que|lorsque|tant que)\b"

def detect(fr):
    s = fr.strip()
    low = s.lower()
    is_q = s.endswith("?")

    # 1. Ipotetiche con "si"
    if has(r"\bsi\b", low) and not has(r"\bsi possible\b", low):
        if has(COND_PASSE, low):
            return "ipotetica-irreale-passato"
        if has(COND_PRES, low):
            return "ipotetica-irreale-presente"
        if has(r"\bsi (oui|non|besoin|nécessaire|vous le souhaitez|possible)\b", low):
            return "ipotetica-reale"
    # 2/3. Condizionale (senza si)
    if has(COND_PASSE, low):
        return "condizionale-passato"
    if has(COND_PRES, low):
        return "condizionale-presente"
    # 4. Congiuntivo
    if has(r"\b(préfère|préférerais|voudrais|faut|faudra|souhaite|souhaitez|aimerais|veux|recommande|jusqu'à ce que|pour que|bien que|avant que)\b", low) and has(r"\bqu[e']", low):
        return "congiuntivo-presente"
    # 5. Futuro prossimo
    if has(FUTUR_PROCHE, low):
        return "futuro-prossimo"
    # 6. Futuro nella subordinata temporale
    if has(CONJ_TEMP, low) and has(FUTUR, low):
        return "futuro-nella-subordinata"
    # 7. Futuro semplice
    if has(FUTUR, low):
        return "futuro-semplice"
    # 8. Trapassato prossimo
    if has(PQP, low):
        return "trapassato-prossimo"
    # 9/10. Passato prossimo (passivo / attivo)
    if has(PC_PASSIF, low) or has(r"\b(?:a|ont|avez|avons|ai|as|est|sont|êtes|suis|avait|avaient)\s+été\b", low):
        return "passato-prossimo-passivo"
    if has(PC_AVOIR, low):
        return "passato-prossimo"
    # 11. Imperfetto (escludi falsi positivi)
    m = re.search(IMPF, low)
    if m and m.group(0) not in IMPF_STOP:
        return "imperfetto"
    # 12. Imperativo (dichiarativa che inizia con verbo vous)
    if not is_q:
        fw = first_word(s).lower()
        if (re.match(r"^[A-ZÉÈÀ][a-zà-ÿ]+ez$", first_word(s)) or fw in IMPER_IRREG
                or re.match(r"^(ne|n')$", fw) and has(r"\b\w+ez\b", low)):
            return "imperativo"
        if re.match(r"^[A-ZÉÈÀ][a-zà-ÿ]+ez-(?:vous|le|la|les|nous|moi|toi|y|en)\b", s):
            return "imperativo"
    # 13. Interrogative (struttura) — solo se nessun tempo marcato
    if is_q:
        if has(r"qu'est-ce|est-ce que", low):
            return "interro-est-ce-que"
        if has(r"^y a-t-il", low):
            return "il-y-a"
        if has(r"\bdepuis (quand|combien)\b", low):
            return "depuis-presente"
        if re.match(r"^(comment|combien|quand|où|pourquoi|quel|quelle|quels|quelles)\b", low):
            return "interro-parola-interrogativa"
        if has(r"\w+-t-(?:il|elle|on)\b", low):
            return "interro-t-eufonico"
        if has(r"\w+-(?:elle|ils|elles)\b", low) or re.search(r"[a-zà-ÿ]+-il\b", low) and not has(r"\bavez-|\bêtes-|\bprenez-", low):
            return "interro-inversione-pronome"
        if has(r"\w+-(?:vous|tu|nous)\b", low):
            return "interro-inversione"
        return "interro-inversione"
    # 14. Dichiarative al presente
    if re.match(r"^on\b", low):
        return "pronome-on"
    if has(r"\b(?:se|s'|me|te)\s+\w+|vous (?:sentez|reposez|levez|pesez)", low):
        return "verbo-pronominale"
    if has(r"\bne\b.{0,40}?\b(?:pas|plus|jamais|rien|aucun)\b|\bn'\w+ (?:pas|plus|jamais)\b", low):
        return "negazione"
    if has(r"\b(?:du|de la|de l'|des)\b", low):
        return "articolo-partitivo"
    return "presente-indicativo"

def make_focus(tag, fr):
    s = fr.strip()
    def F(pat):
        return find(pat, s)
    if tag == "interro-inversione":
        t = F(r"[A-Za-zà-ÿ]+-vous"); return (f"« {t} »: inversione verbo-soggetto (domanda formale)." if t else "Inversione verbo-soggetto: domanda formale.")
    if tag == "interro-inversione-pronome":
        t = F(r"[a-zà-ÿ]+-(?:elle|il|ils|elles)"); return (f"« {t} »: ripresa pronominale del soggetto." if t else "Il soggetto-nome è ripreso da un pronome dopo il verbo.")
    if tag == "interro-t-eufonico":
        t = F(r"[a-zà-ÿ]+-t-(?:il|elle|on)"); return (f"« {t} »: -t- eufonico tra verbo (in vocale) e pronome." if t else "-t- eufonico tra verbo e pronome.")
    if tag == "interro-est-ce-que":
        return "« est-ce que / qu'est-ce qui » apre la domanda senza inversione."
    if tag == "interro-parola-interrogativa":
        return f"« {first_word(s)} »: parola interrogativa che apre la domanda."
    if tag == "il-y-a":
        return "« Y a-t-il » = forma interrogativa di « il y a » (c'è / ci sono)."
    if tag == "depuis-presente":
        return "« depuis » + presente: azione iniziata nel passato e ancora in corso (in italiano spesso passato)."
    if tag == "passato-prossimo":
        t = F(PC_AVOIR); return (f"« {t} »: passé composé (avoir + participio passato)." if t else "Passé composé: ausiliare + participio passato.")
    if tag == "passato-prossimo-passivo":
        t = F(PC_PASSIF) or "été"; return f"« {t} »: passé composé passivo (être + participio)."
    if tag == "trapassato-prossimo":
        t = F(PQP); return (f"« {t} »: trapassato prossimo (anteriorità nel passato)." if t else "Trapassato prossimo: ausiliare all'imperfetto + participio.")
    if tag == "imperfetto":
        t = F(IMPF); return (f"« {t} »: imperfetto (descrizione o stato nel passato)." if t else "Imperfetto: descrizione o stato nel passato.")
    if tag == "futuro-semplice":
        t = F(FUTUR); return (f"« {t} »: futuro semplice (azione futura, tono formale)." if t else "Futuro semplice: azione futura.")
    if tag == "futuro-prossimo":
        t = F(FUTUR_PROCHE); return (f"« {t} »: futur proche (aller + infinito)." if t else "Futur proche: aller + infinito.")
    if tag == "futuro-nella-subordinata":
        c = F(CONJ_TEMP); return (f"dopo « {c} » il francese usa il futuro (l'italiano spesso il presente)." if c else "Dopo quand/dès que il francese usa il futuro.")
    if tag == "condizionale-presente":
        t = F(COND_PRES); return (f"« {t} »: condizionale presente (cortesia / eventualità)." if t else "Condizionale presente: cortesia o eventualità.")
    if tag == "condizionale-passato":
        t = F(COND_PASSE); return (f"« {t} »: condizionale passato." if t else "Condizionale passato: ciò che sarebbe successo.")
    if tag == "ipotetica-irreale-passato":
        return "« si » + trapassato → condizionale passato (ipotesi o rimpianto sul passato)."
    if tag == "ipotetica-irreale-presente":
        return "« si » + imperfetto → condizionale presente (ipotesi sul presente)."
    if tag == "ipotetica-reale":
        return "« si » + presente: condizione reale e possibile."
    if tag == "congiuntivo-presente":
        return "dopo « que » (volontà / preferenza) il verbo va al congiuntivo."
    if tag == "imperativo":
        return f"« {first_word(s)} »: imperativo (vous), istruzione diretta."
    if tag == "verbo-pronominale":
        return "verbo pronominale: pronome riflessivo (se / vous / nous) col verbo."
    if tag == "pronome-on":
        t = F(r"\bon\s+\w+"); return (f"« {t} »: « on » = noi (clinico), verbo alla 3ª persona." if t else "« on » = noi (clinico), verbo alla 3ª persona.")
    if tag == "articolo-partitivo":
        t = F(r"\b(?:du|de la|de l'|des)\b"); return (f"« {t} »: articolo partitivo (quantità indeterminata)." if t else "Articolo partitivo: du / de la / des.")
    if tag == "negazione":
        return "negazione: ne … pas / plus / jamais / rien avvolge il verbo."
    if tag == "accordo-aggettivo":
        return "l'aggettivo concorda in genere e numero col nome."
    return "verbo al presente indicativo."

def main():
    entries = {}
    counts = {}
    for path in sorted(CONTENT):
        text = open(path, encoding="utf-8").read()
        for m in OBJ_RE.finditer(text):
            pid, fr = m.group(1), m.group(2)
            if pid in entries:
                continue
            tag = detect(fr)
            focus = make_focus(tag, fr)
            entries[pid] = (tag, focus)
            counts[tag] = counts.get(tag, 0) + 1

    out = os.path.join(os.path.dirname(__file__), "..", "src", "data", "grammarMap.ts")
    with open(out, "w", encoding="utf-8") as f:
        f.write("// GENERATO da scripts/tag_grammar.py — non modificare a mano.\n")
        f.write("// Mappa id frase -> regola grammaticale (tag) + focus specifico.\n")
        f.write('import type { GrammarTag } from "./grammar";\n\n')
        f.write("export const GRAMMAR_BY_ID: Record<string, { grammar: GrammarTag; focus: string }> = {\n")
        for pid in sorted(entries):
            tag, focus = entries[pid]
            focus_esc = focus.replace("\\", "\\\\").replace('"', '\\"')
            f.write(f'  "{pid}": {{ grammar: "{tag}", focus: "{focus_esc}" }},\n')
        f.write("};\n")

    print("TOT frasi taggate:", len(entries))
    for t in sorted(counts, key=lambda k: -counts[k]):
        print(f"  {counts[t]:5d}  {t}")

if __name__ == "__main__":
    main()
