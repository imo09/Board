# [board] - tutte le app e le skill nautargo in un posto solo

Versione 1.5. Indirizzo: board.nautargo.com. Sul telefono si installa come "[board]".

## File

Tutti i file stanno nella radice del repository, senza cartelle: così si caricano anche da telefono.

1. `index.html`: la pagina, con app e skill divise per categoria e le loro descrizioni.
2. `board.js`: come si comporta la pagina (riquadro, interruttore, condivisione, avviso di nuova versione, lettura delle skill). Non serve toccarlo per aggiungere app o skill.
3. Skill: `istruzioni-itinerario-integrato.md` e `lente-istruzioni.md` sono le istruzioni che si leggono nella pagina; `itinerario-integrato.zip` e `lente.zip` sono i pacchetti completi da scaricare (istruzioni più file collegati: il kit dell'itinerario, la scheda CCNL di lente). `schemi-studio-da-scansioni.md` si legge nella pagina, `schemi-studio-da-scansioni.skill` è il pacchetto da caricare su Claude.
4. `manifest.webmanifest`: nome, icona e scorciatoie per installarla.
5. `sw.js`: la tiene sul telefono, così si apre anche senza rete, e avvisa quando ha scaricato una versione nuova.
6. `board-180.png`, `board-192.png`, `board-512.png`, `board-maskable-512.png`: icona di [board]. `sero.png`, `sestante.png`, `folio.png`, `lare.png`, `teca.png`: icone delle app per la pressione lunga. `nembo.png`, `kit.png`, `plico.png`, `hora.png`, `iris.png`, `zeno.png`, `meridian.png`: icone delle app nella pagina, prese dai loro repository.
7. `CNAME`: l'indirizzo board.nautargo.com.
8. `.nojekyll`: file vuoto che impedisce a GitHub di trasformare i `.md` in pagine. Senza, le skill non si aprono.

## Come si usa

1. **Categorie**: app e skill stanno in sezioni, una per categoria, nell'ordine scritto in `index.html`: Viaggi e imprevisti (sero, nembo, kit; skill itinerario-integrato), Soldi e casa (sestante, lare; skill lente), Note e letture (folio, teca, plico; skill schemi-studio-da-scansioni), Produttività (hora, iris, zeno, meridian). Ogni categoria sta in un riquadro tenue con angoli stondati: prima le icone delle app, poi le skill.
2. **Telefono, tablet, computer**: sul telefono una colonna; da 760 px di larghezza le categorie si affiancano in due colonne, da 1180 px in tre, da 1600 px in quattro. Il riquadro dei dettagli compare sopra la pagina, che dietro resta ferma: niente si sposta quando si apre o si chiude.
3. **Interruttore "Al tocco"**: due posizioni, Dettagli (predefinita) e Apri. Resta ricordato sul dispositivo; chi aveva acceso il vecchio "Apri al primo tocco" si ritrova su Apri. Si usa anche da tastiera con la barra spaziatrice. Vale per le app: le skill aprono sempre i dettagli.
4. **Al tocco: Dettagli**: un tocco su un'app apre il riquadro con categoria, indirizzo, descrizione e "Come funziona". Secondo tocco sulla stessa icona, oppure tasto Apri: si apre l'app.
5. **Al tocco: Apri**: un tocco apre subito l'app. I dettagli restano a portata con la pressione lunga (clic destro sul computer).
6. **Tocco su una skill**: sintesi, indice e tempo di lettura. "Leggi tutto" (o secondo tocco) la mostra intera; "Copia testo" copia il file `.md` completo; "Scarica .zip" (o ".skill") salva il pacchetto completo, "Scarica .md" il solo file se la skill non ha pacchetto.
7. **Condividi**: icona nell'intestazione del riquadro, a sinistra della X. Per un'app condivide nome, descrizione breve e indirizzo dell'app (per esempio `https://sero.nautargo.com/`). Per una skill prova a condividere il file `.md`; se il telefono non lo accetta, condivide titolo, sintesi e link a [board]. Usa il foglio di condivisione del telefono; dove non c'è copia negli appunti e mostra "Copiato". Nessun dato passa da server.
8. **Nuova versione**: quando [board] ha scaricato una versione diversa di `index.html`, `board.js` o del manifest, sotto la barra compare "Aggiornata. Tocca per ricaricare". Non ricarica da sola; se la chiudi, torna alla novità successiva. Al primo avvio non compare mai.
9. **Android con Chrome**: se l'app è installata si apre l'app, se no il sito nel browser.
10. **iPhone**: si apre la versione nel browser; il riquadro lo ricorda.
11. **Ultima app aperta**: ha un punto sotto il nome.
12. **Lingua**: italiano se il telefono è in italiano, altrimenti inglese (testi nei `data-en`).

## Aggiungere un'app

1. In `index.html`, sezione APP E SKILL, scegli la categoria (`<section class="categoria">`) e copia un blocco `<li>...</li>` dentro la sua `<ul class="griglia">`.
2. Se la categoria non c'è ancora: copia un blocco `<section class="sezione categoria">...</section>` intero dove vuoi che compaia, cambia il titolo nell'`<h2>` e il testo inglese in `data-en`, e lascia dentro solo la nuova app. Una categoria senza app non si scrive.
3. Cambia `data-id` (nome breve, solo lettere minuscole), indirizzo (`href`), icona e nome. L'icona può essere un SVG scritto nel blocco o un PNG 192 × 192 nella radice (`<img src="nome.png">`), a tutto quadrato: gli angoli li arrotonda la pagina.
4. Nel `<template class="info">` scrivi descrizione e punti di "Come funziona", con il testo inglese in `data-en`.
5. Se la vuoi anche nella pressione lunga sull'icona di [board]: una riga in `shortcuts` nel manifest, con `/?apri=nome` e un'icona PNG 192 × 192 nella radice. Chrome per Android ne mostra al massimo tre.

## Aggiungere una skill

1. Metti il file nella radice, per esempio `nome-skill.md`. In cima può avere `name` e `description` tra due righe `---`, come le skill di Claude.
2. Se la skill ha più file (altre istruzioni, codice, esempi), mettili tutti in uno zip nella radice, per esempio `nome-skill.zip`, compreso il `.md` principale. Va bene anche un file `.skill` di Claude: il tasto diventa "Scarica .skill".
3. In `index.html`, sezione APP E SKILL, copia un blocco `<li>...</li>` nella `<ul class="elenco">` della categoria giusta (se la categoria non ha ancora skill, aggiungi l'elenco sotto la griglia, come in "Viaggi e imprevisti"). Cambia `data-id`, `data-md` (file da leggere), `data-zip` (pacchetto `.zip` o `.skill`, oppure togli l'attributo), nome e sintesi.
4. L'indice nel riquadro si costruisce da solo con i titoli `##` del file.
5. `data-esempio` aggiunge l'etichetta "esempio" a una skill di prova.

Dopo ogni modifica carica su GitHub i file cambiati. Chi ha [board] aperta vede l'avviso "Aggiornata. Tocca per ricaricare"; altrimenti la trova aggiornata dall'apertura successiva. Perché compaia l'avviso non serve cambiare il nome della cache in `sw.js` (`board-7`): basta che cambi uno dei tre file.

## Pubblicazione (una volta sola)

1. **Repository**: su GitHub (account `imo09`) crea il repository `board`, pubblico.
2. **File**: carica nella radice tutto il contenuto dello zip.
3. **`.nojekyll`**: controlla che ci sia nel repository. Se il caricamento l'ha saltato (succede ai file che iniziano con il punto): Add file > Create new file, nome `.nojekyll`, contenuto vuoto, Commit.
4. **Pages**: Settings > Pages > Source "Deploy from a branch", branch `main`, cartella `/ (root)`, Save.
5. **DNS Aruba**: nel pannello DNS di nautargo.com aggiungi un record CNAME con nome `board` e valore `imo09.github.io`.
6. **Dominio**: in Settings > Pages il campo Custom domain mostra `board.nautargo.com`. Quando il controllo è verde, spunta "Enforce HTTPS".
7. **Installazione**: apri board.nautargo.com con Chrome sul telefono, menu a tre punti, "Installa app". Su iPhone: Safari, Condividi, "Aggiungi alla schermata Home".
