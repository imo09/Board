# [board] - tutte le app nautargo in un posto solo

Versione 1.1. Pagina con le icone delle app nautargo: un tocco apre l'app. Indirizzo: board.nautargo.com. Sul telefono si installa come "[board]".

## File

1. `index.html`: la pagina, con icone e nomi delle app.
2. `manifest.webmanifest`: nome, icona e scorciatoie per installarla.
3. `sw.js`: la tiene sul telefono, così si apre anche senza rete.
4. `icone/`: icona di [board] (telefono e browser).
5. `scorciatoie/`: icone delle app per il menu della pressione lunga (Android).
6. `CNAME`: l'indirizzo board.nautargo.com.

## Come si apre un'app

1. **Android con Chrome**: se l'app è installata (folio, lare...), si apre l'app; se no, il sito nel browser.
2. **iPhone**: si apre sempre la versione nel browser. Un avviso, mostrato una volta, lo spiega.
3. **Pressione lunga sull'icona di [board]** (Android): compaiono le scorciatoie alle app. Chrome ne mostra al massimo tre, le prime della lista nel manifest.
4. **Ultima app aperta**: ha un punto sotto il nome.
5. **Lingua**: italiano se il telefono è in italiano, altrimenti inglese.

## Aggiungere un'app

1. In `index.html` copia un blocco `<li>...</li>` dentro `<ul class="app-griglia">`.
2. Cambia `data-app` (nome breve, solo lettere minuscole), indirizzo (`href`), icona (lo `<svg>` o l'`<img>`) e nome.
3. Se la vuoi anche nella pressione lunga: aggiungi una riga in `shortcuts` nel manifest, con `/?apri=nome` e un'icona PNG 192 × 192 in `scorciatoie/`.
4. Carica i file cambiati su GitHub. Chi ha [board] la vede aggiornata dall'apertura successiva; le scorciatoie si aggiornano entro un giorno.

Se modifichi lo `<script>` in fondo alla pagina, va ricalcolata la sua impronta nella riga "Content-Security-Policy": chiedilo a Claude.

## Pubblicazione (una volta sola)

1. **Repository**: su GitHub (account `imo09`) crea il repository `board`, pubblico.
2. **File**: carica nella radice tutto il contenuto dello zip, cartelle `icone` e `scorciatoie` comprese.
3. **Pages**: Settings > Pages > Source "Deploy from a branch", branch `main`, cartella `/ (root)`, Save.
4. **DNS Aruba**: nel pannello DNS di nautargo.com aggiungi un record CNAME con nome `board` e valore `imo09.github.io`.
5. **Dominio**: in Settings > Pages il campo Custom domain mostra `board.nautargo.com` (lo legge dal file CNAME). Quando il controllo è verde, spunta "Enforce HTTPS".
6. **Installazione**: apri board.nautargo.com con Chrome sul telefono, menu a tre punti, "Installa app". Su iPhone: Safari, Condividi, "Aggiungi alla schermata Home".
