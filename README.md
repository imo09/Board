# [board] - tutte le app e le skill nautargo in un posto solo

Versione 1.2. Indirizzo: board.nautargo.com. Sul telefono si installa come "[board]".

## File

1. `index.html`: la pagina, con app, skill e le loro descrizioni.
2. `board.js`: come si comporta la pagina (riquadro, interruttore, lettura delle skill). Non serve toccarlo per aggiungere app o skill.
3. `skill/`: le skill, un file `.md` ciascuna.
4. `manifest.webmanifest`: nome, icona e scorciatoie per installarla.
5. `sw.js`: la tiene sul telefono, così si apre anche senza rete.
6. `icone/` e `scorciatoie/`: icona di [board] e icone delle app per la pressione lunga.
7. `CNAME`: l'indirizzo board.nautargo.com.
8. `.nojekyll`: file vuoto che impedisce a GitHub di trasformare i `.md` in pagine. Senza, le skill non si aprono.

## Come si usa

1. **Tocco su un'app**: si apre il riquadro con descrizione e "Come funziona". Secondo tocco sulla stessa icona, oppure tasto Apri: si apre l'app.
2. **Interruttore "Apri al primo tocco"**: un tocco apre subito l'app. Resta ricordato sul dispositivo. I dettagli restano a portata con la pressione lunga (clic destro sul computer).
3. **Tocco su una skill**: sintesi, indice e tempo di lettura. "Leggi tutto" (o secondo tocco) la mostra intera; "Copia testo" copia il file `.md` completo; "Scarica .md" lo salva.
4. **Android con Chrome**: se l'app è installata si apre l'app, se no il sito nel browser.
5. **iPhone**: si apre la versione nel browser; il riquadro lo ricorda.
6. **Ultima app aperta**: ha un punto sotto il nome.
7. **Lingua**: italiano se il telefono è in italiano, altrimenti inglese (testi nei `data-en`).

## Aggiungere un'app

1. In `index.html`, sezione APP, copia un blocco `<li>...</li>`.
2. Cambia `data-id` (nome breve, solo lettere minuscole), indirizzo (`href`), icona e nome.
3. Nel `<template class="info">` scrivi descrizione e punti di "Come funziona", con il testo inglese in `data-en`.
4. Se la vuoi anche nella pressione lunga sull'icona di [board]: una riga in `shortcuts` nel manifest, con `/?apri=nome` e un'icona PNG 192 × 192 in `scorciatoie/`. Chrome per Android ne mostra al massimo tre.

## Aggiungere una skill

1. Metti il file in `skill/`, per esempio `skill/nome-skill.md`. In cima può avere `name` e `description` tra due righe `---`, come le skill di Claude.
2. In `index.html`, sezione SKILL, copia un blocco `<li>...</li>` e cambia `data-id`, `data-md` (percorso del file), nome e sintesi.
3. Le due skill attuali sono esempi (`data-esempio`, etichetta "esempio"): toglile o togli l'attributo quando metti quelle vere.
4. L'indice nel riquadro si costruisce da solo con i titoli `##` del file.

Dopo ogni modifica carica su GitHub i file cambiati. Chi ha [board] la vede aggiornata dall'apertura successiva.

## Pubblicazione (una volta sola)

1. **Repository**: su GitHub (account `imo09`) crea il repository `board`, pubblico.
2. **File**: carica nella radice tutto il contenuto dello zip, cartelle comprese.
3. **`.nojekyll`**: controlla che ci sia nel repository. Se il caricamento l'ha saltato (succede ai file che iniziano con il punto): Add file > Create new file, nome `.nojekyll`, contenuto vuoto, Commit.
4. **Pages**: Settings > Pages > Source "Deploy from a branch", branch `main`, cartella `/ (root)`, Save.
5. **DNS Aruba**: nel pannello DNS di nautargo.com aggiungi un record CNAME con nome `board` e valore `imo09.github.io`.
6. **Dominio**: in Settings > Pages il campo Custom domain mostra `board.nautargo.com`. Quando il controllo è verde, spunta "Enforce HTTPS".
7. **Installazione**: apri board.nautargo.com con Chrome sul telefono, menu a tre punti, "Installa app". Su iPhone: Safari, Condividi, "Aggiungi alla schermata Home".
