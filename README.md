# [board] - tutte le app e le skill nautargo in un posto solo

Versione 1.3. Indirizzo: board.nautargo.com. Sul telefono si installa come "[board]".

## File

Tutti i file stanno nella radice del repository, senza cartelle: così si caricano anche da telefono.

1. `index.html`: la pagina, con le app divise per categoria, le skill e le loro descrizioni.
2. `board.js`: come si comporta la pagina (riquadro, interruttore, condivisione, avviso di nuova versione, lettura delle skill). Non serve toccarlo per aggiungere app o skill.
3. `pubblica-webapp.md`, `voce-nautargo.md`: le skill, un file `.md` ciascuna.
4. `manifest.webmanifest`: nome, icona e scorciatoie per installarla.
5. `sw.js`: la tiene sul telefono, così si apre anche senza rete, e avvisa quando ha scaricato una versione nuova.
6. `board-180.png`, `board-192.png`, `board-512.png`, `board-maskable-512.png`: icona di [board]. `sero.png`, `sestante.png`, `folio.png`, `lare.png`, `teca.png`: icone delle app per la pressione lunga.
7. `CNAME`: l'indirizzo board.nautargo.com.
8. `.nojekyll`: file vuoto che impedisce a GitHub di trasformare i `.md` in pagine. Senza, le skill non si aprono.

## Come si usa

1. **Categorie**: le app stanno in sezioni, una per categoria (per esempio sero sotto "Viaggi"), nell'ordine scritto in `index.html`. Le skill restano in fondo.
2. **Interruttore "Al tocco"**: due posizioni, Dettagli (predefinita) e Apri. Resta ricordato sul dispositivo; chi aveva acceso il vecchio "Apri al primo tocco" si ritrova su Apri. Si usa anche da tastiera con la barra spaziatrice. Vale per le app: le skill aprono sempre i dettagli.
3. **Al tocco: Dettagli**: un tocco su un'app apre il riquadro con categoria, indirizzo, descrizione e "Come funziona". Secondo tocco sulla stessa icona, oppure tasto Apri: si apre l'app.
4. **Al tocco: Apri**: un tocco apre subito l'app. I dettagli restano a portata con la pressione lunga (clic destro sul computer).
5. **Tocco su una skill**: sintesi, indice e tempo di lettura. "Leggi tutto" (o secondo tocco) la mostra intera; "Copia testo" copia il file `.md` completo; "Scarica .md" lo salva.
6. **Condividi**: icona nell'intestazione del riquadro, a sinistra della X. Per un'app condivide nome, descrizione breve e indirizzo dell'app (per esempio `https://sero.nautargo.com/`). Per una skill prova a condividere il file `.md`; se il telefono non lo accetta, condivide titolo, sintesi e link a [board]. Usa il foglio di condivisione del telefono; dove non c'è copia negli appunti e mostra "Copiato". Nessun dato passa da server.
7. **Nuova versione**: quando [board] ha scaricato una versione diversa di `index.html`, `board.js` o del manifest, sotto la barra compare "Aggiornata. Tocca per ricaricare". Non ricarica da sola; se la chiudi, torna alla novità successiva. Al primo avvio non compare mai.
8. **Android con Chrome**: se l'app è installata si apre l'app, se no il sito nel browser.
9. **iPhone**: si apre la versione nel browser; il riquadro lo ricorda.
10. **Ultima app aperta**: ha un punto sotto il nome.
11. **Lingua**: italiano se il telefono è in italiano, altrimenti inglese (testi nei `data-en`).

## Aggiungere un'app

1. In `index.html`, sezione APP, scegli la categoria (`<section class="categoria">`) e copia dentro un blocco `<li>...</li>`.
2. Se la categoria non c'è ancora: copia un blocco `<section class="sezione categoria">...</section>` intero dove vuoi che compaia, cambia il titolo nell'`<h2>` e il testo inglese in `data-en`, e lascia dentro solo la nuova app. Una categoria senza app non si scrive.
3. Cambia `data-id` (nome breve, solo lettere minuscole), indirizzo (`href`), icona e nome.
4. Nel `<template class="info">` scrivi descrizione e punti di "Come funziona", con il testo inglese in `data-en`.
5. Se la vuoi anche nella pressione lunga sull'icona di [board]: una riga in `shortcuts` nel manifest, con `/?apri=nome` e un'icona PNG 192 × 192 nella radice. Chrome per Android ne mostra al massimo tre.

## Aggiungere una skill

1. Metti il file nella radice, per esempio `nome-skill.md`. In cima può avere `name` e `description` tra due righe `---`, come le skill di Claude.
2. In `index.html`, sezione SKILL, copia un blocco `<li>...</li>` e cambia `data-id`, `data-md` (nome del file), nome e sintesi.
3. Le due skill attuali sono esempi (`data-esempio`, etichetta "esempio"): toglile o togli l'attributo quando metti quelle vere.
4. L'indice nel riquadro si costruisce da solo con i titoli `##` del file.

Dopo ogni modifica carica su GitHub i file cambiati. Chi ha [board] aperta vede l'avviso "Aggiornata. Tocca per ricaricare"; altrimenti la trova aggiornata dall'apertura successiva. Perché compaia l'avviso non serve cambiare il nome della cache in `sw.js` (`board-5`): basta che cambi uno dei tre file.

## Pubblicazione (una volta sola)

1. **Repository**: su GitHub (account `imo09`) crea il repository `board`, pubblico.
2. **File**: carica nella radice tutto il contenuto dello zip.
3. **`.nojekyll`**: controlla che ci sia nel repository. Se il caricamento l'ha saltato (succede ai file che iniziano con il punto): Add file > Create new file, nome `.nojekyll`, contenuto vuoto, Commit.
4. **Pages**: Settings > Pages > Source "Deploy from a branch", branch `main`, cartella `/ (root)`, Save.
5. **DNS Aruba**: nel pannello DNS di nautargo.com aggiungi un record CNAME con nome `board` e valore `imo09.github.io`.
6. **Dominio**: in Settings > Pages il campo Custom domain mostra `board.nautargo.com`. Quando il controllo è verde, spunta "Enforce HTTPS".
7. **Installazione**: apri board.nautargo.com con Chrome sul telefono, menu a tre punti, "Installa app". Su iPhone: Safari, Condividi, "Aggiungi alla schermata Home".
