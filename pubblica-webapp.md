---
name: pubblica-webapp
description: Mette online una nuova web app nautargo sul suo sottodominio di nautargo.com, con GitHub Pages e il DNS di Aruba. Usala quando un'app è pronta per la pubblicazione.
---

# Pubblicare una web app nautargo

Skill di esempio per [board]. Ogni app nautargo vive su un suo sottodominio (sero.nautargo.com, folio.nautargo.com), così i dati di un'app restano separati da quelli delle altre.

## Prima di iniziare

- Il nome dell'app, tutto minuscolo, per esempio `teca`.
- La cartella dell'app con `index.html`, `manifest.webmanifest`, le icone e il file `CNAME`.
- Il file `CNAME` contiene una sola riga: l'indirizzo, per esempio `teca.nautargo.com`.

## Passi

1. **Repository**: su GitHub, account `imo09`, crea un repository pubblico con il nome dell'app.
2. **File**: carica nella radice tutto il contenuto della cartella, sottocartelle comprese.
3. **Pages**: Settings > Pages > Source "Deploy from a branch", branch `main`, cartella `/ (root)`, Save.
4. **DNS Aruba**: nel pannello DNS di nautargo.com aggiungi un record CNAME con il nome dell'app e valore `imo09.github.io`.
5. **Dominio**: in Settings > Pages il campo Custom domain mostra l'indirizzo. Quando il controllo è verde, spunta "Enforce HTTPS".
6. **Prova**: apri l'indirizzo con Chrome sul telefono e installa l'app dal menu a tre punti.

## Dopo la pubblicazione

- Aggiungi l'app a [board]: un blocco in `index.html` e, se serve, una scorciatoia nel manifest.
- Aggiungi l'app alla landing nautargo.com.

## Se qualcosa non va

| Sintomo | Cosa fare |
|---|---|
| Il controllo del dominio resta rosso | Ricontrolla nome e valore del record CNAME, poi aspetta: il DNS può impiegare fino a 24 ore. |
| "Enforce HTTPS" non si può spuntare | GitHub sta ancora preparando il certificato: riprova più tardi. |
