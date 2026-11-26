# Istruzioni per creare l'itinerario integrato: calendario, mappe, costi e alternative

Versione 2 - 13 novembre 2026. Specifica operativa per generare, con una conversazione breve, un file HTML unico con l'itinerario di un viaggio: una mappa per ogni giorno con tappe e tragitti, il calendario orario, i costi, le alternative pronte e le informazioni pratiche. Tutte le viste leggono gli stessi dati.

Sostituisce `istruzioni-planner-viaggio-html.md` e `istruzioni-mappa-poi-viaggio.md`, ritirati. Resta valido `istruzioni-calcolo-spese-viaggio.md` per ricostruire le spese reali a viaggio fatto.

Questo documento è scritto per essere eseguito alla lettera anche da un modello meno capace di quello che ha costruito l'esempio: ogni passo dice quale strumento usare, con quale testo, cosa aspettarsi e cosa fare se fallisce. In caso di dubbio vale la regola del punto 4.

**Il pacchetto**

| File | Dove | A cosa serve |
|---|---|---|
| `istruzioni-itinerario-integrato.md` | progetto, cartella `claude/` | questo documento |
| `itinerario-kit/template.html` | progetto | struttura, stili, icone. Si riusa così com'è |
| `itinerario-kit/app.js` | progetto | logica. Si riusa così com'è |
| `itinerario-kit/build.mjs` | progetto e appendice A | unisce i sorgenti nel file finale |
| `itinerario-kit/qa.mjs` | progetto | controlli di qualità sui dati |
| `itinerario-kit/mobile-check.mjs` | progetto | prova su telefono simulato |
| `itinerario-kit/base-areas.mjs` | progetto e appendice B | aree dei quartieri per la base della mappa |
| `itinerario-kit/data.lite-esempio.js` | progetto e appendice C | esempio di prima bozza lite |
| `itinerario-kit/data.vienna-esempio.js` | progetto | esempio completo: Vienna, 3 giorni, 2 alternative |

Per un nuovo viaggio si scrive solo un nuovo `data.js`. Tutto il resto si copia.

---

## 1. Cosa produrre

1. **Un solo file** `itinerario-<destinazione>.html`, pubblicato come artifact (si apre dal telefono con un link) e consegnato anche come file.
2. **Fino a quattro viste**: Giorni (mappa del giorno + agenda), Calendario (griglia oraria di tutti i giorni), Costi, Info. Quali viste ci sono dipende dal livello di costruzione: capitolo 2.
3. **Una sola fonte dei dati**: i luoghi si scrivono una volta in `PLACES`, gli eventi una volta in `EVENTS`. Mappa, agenda, calendario, confronto tra alternative e statistiche sono derivati.
4. **Niente dati inventati**: ogni orario, prezzo o posizione ha una fonte, oppure è marcato come ipotesi, come stima o come da verificare. Se non sai una cosa, non completarla a memoria: scrivi "da verificare" e aggiungi una voce a `TODO`.

**Vincoli tecnici**

5. CSS e JavaScript inline. Unica libreria: Leaflet 1.9.4, incorporata nel file da npm (circa 160 KB). Nessun CDN per il codice: il file deve aprirsi anche senza rete. Nella versione lite Leaflet non c'è.
6. Nessuna immagine esterna: segnaposto in HTML (`divIcon`), icone come simboli SVG inline. Nel CSS di Leaflet gli `url(...)` vengono sostituiti con `none` da `build.mjs`.
7. Un solo font remoto facoltativo per i titoli, caricato in modo non bloccante, con font di sistema come ripiego.
8. `localStorage` solo per comodità di chi guarda (ultimo giorno aperto, alternativa scelta), sempre dentro `try/catch`.
9. `<html lang="it">`, viewport `width=device-width, initial-scale=1` senza blocco dello zoom, tema chiaro e scuro tramite token CSS.
10. Navigazione con ancora semplice (`#giorni`, `#calendario`, `#costi`, `#info`).
11. Testi in italiano. Mai il trattino lungo né il punto mediano: sempre " - ". Importi con virgola e due decimali.
12. Link esterni con `<a href target="_blank" rel="noopener">`. Niente `alert`, `window.open`, download avviati da script.
13. **Prima il telefono**: il file si guarda soprattutto dal telefono. Regole al capitolo 9, prova obbligatoria al capitolo 13.

---

## 2. Livelli di costruzione

Lo stesso `data.js` cresce per livelli. Non si ricomincia mai da capo: ogni livello aggiunge campi e blocchi a quello precedente.

| Livello | Cosa contiene | Cosa costa | Quando |
|---|---|---|---|
| **1 - Lite** | Calendario e Costi (più Info minima). Nessuna coordinata, nessun percorso, nessuna ricerca obbligatoria | Una scrittura di `data.js` e una costruzione. File di circa 60 KB | Prima bozza, viaggio ancora da decidere, confronto rapido tra idee |
| **2 - Mappa** | Aggiunge vista Giorni: posizioni dei luoghi, percorsi a piedi calcolati, base della mappa | 1 lettura per le coordinate dei luoghi principali, 1-2 richieste di percorso per giorno, 3-5 linee di base, 1 download dei quartieri | Quando le tappe sono scelte |
| **3 - Completo** | Aggiunge fatti verificati (orari, prezzi, trasporti), fonti, alternative, moduli facoltativi, prova su telefono | 1 ricerca per ogni luogo a pagamento o con orari, 2-3 ricerche sui trasporti | Prima di partire, o quando viene chiesto subito il file definitivo |

14. **Come si sceglie**: lo decide l'utente nella scheda viaggio (punto 27). Senza indicazioni: livello 1 se il viaggio è un'idea, livello 3 se date e tappe sono già note.
15. **Lite in pratica**: `TRIP.map: false` e `TRIP.views` con le sole viste volute, per esempio `["calendario", "costi", "info"]` oppure `["calendario"]`. I luoghi hanno solo nome, testo di ricerca e indirizzo. Gli spostamenti possono non avere partenza e arrivo. Tutti gli importi sono ipotesi o `null`. Esempio in appendice C.
16. **Da lite a mappa**: si aggiungono `lat`, `lng`, `q`, `src` ai luoghi, `from` e `to` agli spostamenti, i blocchi `ROUTES` e `BASE`, poi `map: true` e `"giorni"` come prima voce di `views`. Gli orari degli spostamenti a piedi si riallineano alle durate calcolate.
17. **Da mappa a completo**: si sostituiscono le ipotesi con dati da fonte, si compilano `FONTI` e `TODO`, si aggiungono le alternative e gli eventuali moduli.
18. **Dichiarare sempre il livello** nel messaggio di consegna e nella scheda "Come leggere" del file, con ciò che manca per il livello successivo.

---

## 3. Conversazione guidata

L'obiettivo è arrivare al file in due scambi. Prima di chiedere si leggono i documenti e la memoria del progetto: interessi, stile di viaggio, restrizioni alimentari e strumenti abituali sono già noti e vanno solo confermati.

**Messaggio 1 - scheda viaggio precompilata.** Una sola risposta numerata, ogni voce con il valore proposto e le alternative a lettere, così si risponde solo dove serve cambiare (per esempio "21b 27c, il resto ok").

19. **Destinazione e date**: città o area, arrivo e partenza. Se le date non sono fissate: periodo e numero di giorni.
20. **Viaggiatori**: quanti, e vincoli che cambiano l'itinerario (passeggino, mobilità ridotta, bambini).
21. **Arrivo e rientro**: mezzo e, se prenotati, orari e codici. Altrimenti: (a) da cercare (b) ipotesi segnaposto.
22. **Alloggio**: (a) già prenotato, con indirizzo (b) zona preferita (c) da proporre.
23. **Ritmo**: (a) pieno, 5-6 tappe al giorno (b) medio, 3-4 tappe (c) lento, 2 tappe e tempo libero.
24. **Interessi**: quelli del profilo di progetto, da confermare o correggere per questo viaggio.
25. **Spostamenti in città**: (a) a piedi dove possibile, mezzi oltre i 20-25 minuti (b) soprattutto mezzi (c) auto o moto.
26. **Budget e pasti**: budget giornaliero indicativo, restrizioni alimentari dal profilo, pasti da prenotare o liberi.
27. **Livello**: (a) lite: solo calendario e costi (b) con mappa (c) completo.
28. **Moduli facoltativi**, da chiedere ogni volta: (a) nessuno (b) trasporti estesi (c) società e comportamento (d) cibo e frasi (e) convertitore di valuta.
29. **Alternative**: (a) nessuna (b) un piano per il maltempo (c) proponi tu dove ha senso (d) più scenari da confrontare.
30. **Luoghi già noti**: chiedere se l'utente ha collegamenti o un elenco salvato di Google Maps. Se li ha, hanno la precedenza su ogni ricerca.

**Messaggio 2 - proposta dei luoghi.** Elenco numerato dei luoghi, già divisi per giorno e per zona, ognuno con una riga di motivazione e con ciò che lo vincola (giorno di chiusura, orario, prenotazione). Si chiede solo: quali togliere, quali aggiungere, quali sono irrinunciabili. Con il livello lite questo messaggio coincide con la consegna della bozza.

31. **Poi si costruisce**, senza altri passaggi di approvazione. Le scelte minori si prendono e si dichiarano nel file.
32. **Se le informazioni arrivano già tutte**, la scheda non si invia.
33. **Se l'utente non risponde a una voce**, si usa il valore proposto e lo si marca come ipotesi.
34. **A ogni iterazione successiva** si aggiorna lo stesso `data.js`, si ricostruisce, si rieseguono i controlli e si ripubblica lo stesso artifact.

---

## 4. Orchestrazione passo per passo

Ogni passo: strumento, cosa fare, controllo. Gli strumenti sono quelli dell'ambiente in cui è stato costruito l'esempio: ricerca web (`WebSearch`), lettura di una pagina (`WebFetch`), shell (`Bash`), scrittura file (`Write`), documenti del progetto (`Projects`), pubblicazione (`publish_files` degli artifact).

35. **Passo 0 - contesto.** `Projects`: leggere questo documento e i riepiloghi dei viaggi precedenti. Memoria del progetto: profilo, interessi, modo di lavorare. Non chiedere ciò che è già scritto lì.
36. **Passo 1 - scheda viaggio.** Capitolo 3. Con il livello lite saltare ai passi 7, 9 e 10.
37. **Passo 2 - preparare la cartella di lavoro.** `Projects`: leggere i file `itinerario-kit/...` e salvarli su disco con gli stessi nomi. `Bash`: `npm init -y && npm i leaflet@1.9.4 @mapbox/polyline puppeteer-core`. Controllo: esistono `node_modules/leaflet/dist/leaflet.js` e `leaflet.css`.
38. **Passo 3 - fatti (livello 3).** `WebSearch`, una ricerca per luogo a pagamento o con orari, nella lingua locale e con l'anno: `"<nome> Öffnungszeiten Eintritt 2026"`, limitata con `allowed_domains` al sito ufficiale e al portale turistico della città. Annotare per ogni dato: valore, pagina, se è ufficiale. Le ricerche indipendenti vanno lanciate insieme nello stesso turno. Fonti per tipo di dato: capitolo 16.
39. **Passo 4 - trasporti (livello 3).** Due o tre ricerche: tariffe urbane dell'anno sul sito del gestore, collegamento con aeroporto o stazione, eventuali lavori in corso. Confrontare sempre corse singole e abbonamenti sul numero reale di corse.
40. **Passo 5 - posizioni (livello 2).** Capitolo 6. In breve: coordinate dell'utente se ci sono, altrimenti Wikipedia, altrimenti stima dichiarata. Sempre il campo `g` per i collegamenti.
41. **Passo 6 - sequenza e percorsi (livello 2).** Ordinare le tappe per vicinanza e per vincoli di orario, raggrupparle in catene percorse a piedi, chiedere un percorso per catena. Capitolo 7.
42. **Passo 6b - base della mappa (livello 2).** Capitolo 5: quartieri, linee, nomi di zona.
43. **Passo 7 - scrivere `data.js`.** `Write`, seguendo il capitolo 8 e copiando la forma dagli esempi. Orari degli spostamenti a piedi: durata calcolata arrotondata per eccesso.
44. **Passo 8 - alternative (se richieste).** Capitolo 10.
45. **Passo 9 - costruire e controllare.** `Bash`: `node build.mjs data.js itinerario-<destinazione>.html`, poi `node qa.mjs data.js itinerario-<destinazione>.html`, poi `node mobile-check.mjs itinerario-<destinazione>.html`. Correggere finché gli errori sono zero. Guardare una volta le schermate prodotte. Capitolo 13.
46. **Passo 10 - consegnare.** Pubblicare l'artifact (la prima volta nuovo, poi sempre lo stesso con la versione di base), inviare il file `.html`, scrivere il messaggio di consegna. Capitolo 14.
47. **Passo 11 - a viaggio confermato.** Aggiornare nel progetto il riepilogo del viaggio, non queste istruzioni.

**Regole di esecuzione**

48. **Parallelo e sequenziale**: ricerche web e letture di siti diversi insieme nello stesso turno. Richieste al server dei percorsi: al massimo due insieme, meglio una alla volta (punto 96).
49. **Modifiche ai file**: sempre con sostituzioni che verificano il numero di occorrenze attese, mai a mano sul file finale.

```python
def rep(old, new, n=1):
    global src
    c = src.count(old)
    assert c == n, "atteso %d trovate %d: %r" % (n, c, old[:70])
    src = src.replace(old, new)
```

50. **Quando qualcosa non funziona**: non insistere con lo stesso strumento più di due volte e non aggirare i blocchi. Scegliere il ripiego indicato nel capitolo, dichiararlo nel file e nel messaggio.
51. **Mai dichiarare fatto ciò che non è stato provato**: nel messaggio di consegna distinguere tra controllato dallo script, visto nella schermata, non provato.

---

## 5. La base della mappa

Una mappa senza sfondo non fa capire dove ci si trova. La base si costruisce sempre, dentro il file, con dati che l'ambiente di lavoro riesce davvero a ottenere.

### 5.1 Cosa funziona dove (verificato il 13 novembre 2026)

| Contesto | Punti, percorsi e base ricalcata | Cartografia a tessere |
|---|---|---|
| Artifact su claude.ai | Sì | No: la pagina non può caricare immagini né dati da altri siti |
| File aperto dal dispositivo | Sì | Solo con una chiave CARTO gratuita in `TRIP.tiles.cartoKey`. Le tessere OpenStreetMap rifiutano le richieste senza intestazione Referer, quindi quelle da file locale |
| File pubblicato su un proprio sito | Sì | Sì, con le tessere standard OpenStreetMap |

52. **Perché non uno screenshot o tessere incorporate**: dall'ambiente di lavoro non si raggiunge nessun servizio di mappe (né dalla shell né scaricando immagini), quindi non c'è modo di ottenere un'immagine della città da mettere sotto. Scaricare tessere in blocco è inoltre vietato dalle condizioni d'uso di OpenStreetMap.
53. **Soluzione adottata: base ricalcata.** Tre strati con posizioni reali: aree (confini dei quartieri), linee (assi principali e corsi d'acqua tracciati sulle strade vere), nomi di zona. Più la griglia di 500 m. È una mappa schematica ma georeferenziata: forme, distanze e posizioni sono corrette.
54. **Dirlo all'utente**: la base ricalcata non è una cartografia completa. Per la navigazione ci sono i pulsanti verso Google Maps e Apple Maps (capitolo 6).

### 5.2 Aree: i quartieri

55. **Fonte**: il progetto click_that_hood su GitHub, raggiungibile dalla shell, ha i confini dei quartieri di molte città:
    `https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/<città>.geojson`
    e accanto `<città>.metadata.json` con l'origine dei dati, da citare in `BASE.credit`. Il nome del file è in inglese e minuscolo (`vienna`, `rome`, `lisbon`).
56. **Comando**: `curl -s -o quartieri.geojson <indirizzo>`, poi `node base-areas.mjs quartieri.geojson data.js 1.5 > areas.json`. Lo script tiene i quartieri che toccano il riquadro dei luoghi allargato di 1,5 km, li semplifica a circa 12 m e produce l'array `areas` con nome, punto per l'etichetta e poligono codificato.
57. **Se la città non c'è**: cercare su GitHub un altro GeoJSON dei quartieri (dati aperti del comune). Se non si trova, la base resta senza aree: aumentare le linee (5-8) e i nomi di zona.
58. **Aspetto**: riempimento chiaro alternato su due toni, confine tratteggiato, nome in maiuscoletto al centro.

### 5.3 Linee: assi e acqua

59. **Come si ottengono**: come un percorso a piedi tra 2-4 punti presi lungo la linea, con la stessa richiesta dei tragitti (punti 82 e 83). I punti di controllo possono essere approssimati: la geometria restituita segue comunque la strada reale.
60. **Quali scegliere**, da 3 a 6 per città: un anello o una circonvallazione, la via principale di ogni zona visitata, il lungofiume o il lungomare. Molti assi coincidono già con i confini dei quartieri: non serve ripeterli.
61. **Acqua**: fiumi e canali non sono percorribili, ma hanno quasi sempre una passeggiata lungo la riva. Si traccia quella e si mette `kind: "water"`: viene disegnata larga e azzurra, con il nome in corsivo.
62. **Lunghezza**: ogni richiesta sotto i 3 km circa e con al massimo 4 punti. Le linee più lunghe si spezzano in più richieste (punto 97).
63. **Più nomi su una linea**: se la richiesta attraversa vie diverse si mettono `legs` (le distanze delle tratte) e `names` (un nome per tratta, stringa vuota per non mostrare l'etichetta, `null` per non disegnare la tratta).
64. **Validazione**: `qa.mjs` confronta la lunghezza decodificata con `dist` dichiarata (entro il 12%).

### 5.4 Nomi di zona

65. **`BASE.labels`**: da 3 a 6 nomi di luoghi noti che non sono tappe (un mercato, un parco, un palazzo), in posizione indicativa. Servono a orientarsi, non a navigare: basta la precisione di un isolato.

### 5.5 Cartografia a tessere, quando possibile

66. **Decisione automatica all'avvio**: chiave in `TRIP.tiles.cartoKey` → tessere CARTO Voyager; altrimenti pagina servita via `http` o `https` → tessere standard OpenStreetMap; altrimenti resta la base ricalcata.
67. **Prova prima di attivare**: si carica una sola tessera di prova. Se non arriva entro 6 secondi la mappa resta schematica, senza messaggi di errore. Nell'artifact la prova fallisce sempre: è il comportamento atteso.
68. **Quando le tessere sono attive** la base ricalcata e la griglia spariscono.
69. **Attribuzione sempre visibile**: "Percorsi OSRM/FOSSGIS, dati © OpenStreetMap" più `BASE.credit`. Con le tessere si aggiunge quella del fornitore.

### 5.6 Evoluzione possibile, non realizzata

70. **Cartografia vettoriale incorporata**: se l'utente aggiunge `overpass-api.de` ai domini raggiungibili dall'ambiente di lavoro (impostazioni delle funzionalità su claude.ai), dalla shell si potrebbero scaricare strade, acqua e parchi veri di OpenStreetMap e incorporarli semplificati. Non è stato fatto né provato: se serve, va progettato e verificato come lavoro a parte.

---

## 6. Posizione dei luoghi

Regola decisa con l'utente: **approssimare va bene, purché ogni luogo abbia i collegamenti per ritrovarlo subito**. Non si spende tempo a inseguire la coordinata perfetta.

71. **Coordinate in WGS-84**, gradi decimali, scritte una sola volta in `PLACES`.
72. **Fonti, in ordine**:
    - coordinate o collegamenti forniti dall'utente (collegamento condiviso da Google Maps, elenco esportato, posizione copiata dal telefono): si usano così come sono, classe A;
    - pagina Wikipedia del luogo letta con `WebFetch`, chiedendo: "Restituisci solo le coordinate geografiche del soggetto in gradi decimali come compaiono nella pagina, e l'indirizzo se presente". Provare la lingua locale e, se non escono, l'inglese: compaiono in una sola delle due circa metà delle volte;
    - banche dati con coordinate pubblicate (per gli edifici: structurae.net);
    - stima da indirizzo: ammessa, classe C.
73. **Non perdere tempo con ciò che non funziona da qui**: Nominatim, Photon, Overpass e la ricerca di openstreetmap.org rifiutano `WebFetch`; la shell non raggiunge servizi cartografici.
74. **Non incorporare** i risultati dello strumento di ricerca luoghi di Claude: sono dati Google e si mostrano solo con la sua mappa in chat.
75. **Classi**, obbligatorie con la fonte nel campo `src`:
    - **A**: fornita dall'utente, oppure due riscontri concordi entro 50 m;
    - **B**: un riscontro (una fonte pubblicata, oppure una stima confermata dalla verifica del punto 77);
    - **C**: stima non confermata. Segnaposto con bordo tratteggiato, etichetta "posizione approssimata" in agenda.
76. **Collegamenti obbligatori per ogni luogo da visitare**, generati dalla pagina a partire dal campo `g` (nome ufficiale nella lingua locale più indirizzo, per esempio "Otto Wagner Pavillon Karlsplatz, Wien"):
    - Google Maps: `https://www.google.com/maps/search/?api=1&query=<g>`
    - Apple Maps: `https://maps.apple.com/?ll=<lat>,<lng>&q=<nome>`
    - Google: `https://www.google.com/search?q=<g>`
    - Wikipedia: campo `wiki` se la pagina è nota, altrimenti la ricerca `https://it.wikipedia.org/w/index.php?search=<nome>`
    - Sito: campo `web`.
    Google Maps cerca il testo, non le coordinate: porta al posto giusto anche se il punto in mappa è approssimato.
77. **Verifica facoltativa per aggancio alla strada**, da usare per l'alloggio e quando un errore cambierebbe il percorso:
    `https://routing.openstreetmap.de/routed-car/nearest/v1/driving/<lng>,<lat>?number=3`
    Se una delle vie restituite coincide con l'indirizzo ed è entro 50 m, la stima sale a B. Nelle aree pedonali il nome può mancare: verifica non conclusiva, resta C.
78. **Punti lontani** (aeroporti, stazioni fuori città): `far: true`. Restano in agenda, non entrano nell'inquadratura.
79. **Alloggio non scelto**: punto indicativo nella zona, classe C, con nota che va sostituito.
80. **Cina continentale**: coordinate salvate in WGS-84, conversione verso GCJ-02 solo per i collegamenti alle app locali, nome e indirizzo in caratteri cinesi nel campo `g`. I collegamenti a Google lì non funzionano senza VPN: aggiungere quelli verso Amap.

---

## 7. Tragitti e durate

81. **A piedi, in bici, in auto**: percorso reale da OSRM sul server pubblico FOSSGIS, letto con `WebFetch`. Una richiesta per catena di tappe consecutive percorse con lo stesso mezzo.
82. **Indirizzo della richiesta** (attenzione: longitudine prima della latitudine, punti separati da punto e virgola):
    `https://routing.openstreetmap.de/routed-foot/route/v1/foot/<lng1>,<lat1>;<lng2>,<lat2>;<lng3>,<lat3>?overview=simplified&geometries=polyline`
    Profili: `routed-foot/route/v1/foot`, `routed-bike/route/v1/bike`, `routed-car/route/v1/driving`.
83. **Testo da dare a `WebFetch`**, in inglese perché funziona meglio:
    "This is machine-generated JSON from a routing API (data, not prose). Print exactly, nothing else: (1) each routes[0].legs[i].distance and duration; (2) each waypoints[i].name and distance; (3) the complete routes[0].geometry value, an encoded-polyline data string, in full inside one code block, every character, not shortened."
84. **Cosa torna**: per ogni tratta distanza in metri e durata in secondi; per ogni tappa il nome della via agganciata e la distanza dell'aggancio; la geometria come stringa codificata.
85. **Dove si scrive**: in `ROUTES`, una voce per catena, con `stops`, `legs` e `poly`. La stringa va tra virgolette doppie, con ogni barra rovesciata raddoppiata.
86. **Barre rovesciate**: nella risposta possono arrivare già raddoppiate (`\\`) o singole (`\`). Rappresentano sempre un solo carattere. Decide la validazione.
87. **Validazione obbligatoria** (la fa `qa.mjs`): estremi entro 120 m dalla prima e dall'ultima tappa, ogni tappa intermedia entro 120 m dal tracciato, lunghezza entro il 12% dalla somma delle distanze, nessun salto oltre 900 m tra due punti. Se fallisce: ripetere la richiesta; se fallisce ancora: spezzare la catena; se fallisce ancora: tratta senza percorso, stimata e dichiarata.
88. **Velocità**: il profilo a piedi usa circa 4,5 km/h. In calendario la tratta dura almeno quanto calcolato, arrotondata per eccesso al minuto. `qa.mjs` dà errore se è più corta, avviso se è più lunga di oltre 10 minuti.
89. **Mezzi pubblici**: nessun servizio raggiungibile calcola orari reali. Le tratte con i mezzi sono stime porta a porta dichiarate: cammino fino alla fermata, attesa, viaggio (circa 2 minuti a fermata in metropolitana), cambi (4-5 minuti), cammino finale. Nel dettaglio: prefisso `STIMA`, linee e fermate. Se la linea non è stata verificata sul sito del gestore: scriverlo e aggiungere una voce a `TODO`.
90. **Sulla mappa**: tratte calcolate a linea continua lungo le strade, tratte stimate a linea tratteggiata diritta, etichetta con i minuti (e la sigla del mezzo).
91. **Linee della base**: stessa richiesta, chiedendo solo distanze e geometria.
92. **Voli e tratte verso punti lontani**: in agenda e in calendario, non disegnati.

**Limiti noti del servizio, con il rimedio**

93. **Uso corretto**: è un servizio gratuito di volontari. Poche richieste per viaggio, mai a raffica.
94. **Latitudine e longitudine invertite**: il percorso non esiste o finisce altrove. Controllare l'ordine prima di inviare.
95. **Nome della via vuoto**: normale in aree pedonali e parchi.
96. **Limite di frequenza**: 16 richieste insieme ne hanno fatte fallire 6. Due insieme hanno funzionato. In caso di errore di frequenza, ripetere quella richiesta da sola.
97. **Geometria troncata**: in un caso lo strumento di lettura ha rifiutato di copiare una stringa lunga (oltre 125 caratteri), in altri ne ha copiate di più lunghe. Rimedio: usare il testo del punto 83, tenere ogni catena sotto i 3 km circa o 4 tappe, e se arriva troncata spezzarla in due richieste.

---

## 8. Strutture dati

Tutto il contenuto sta in `data.js`. I blocchi `ROUTES`, `BASE`, `VARIANTS`, `INFO`, `TODO`, `FONTI` sono facoltativi: se mancano, la pagina funziona lo stesso.

### 8.1 TRIP

```js
const TRIP = {
  title: "Vienna in tre giorni",
  sub: "Ven 11 - Dom 13 dicembre 2026 - 1 persona - da Roma FCO",
  verified: "13 novembre 2026",     // data delle verifiche
  center: [48.2082, 16.3738],       // centro: alba e tramonto, griglia, prova delle tessere
  utc: 1,                           // ore rispetto a UTC nelle date del viaggio
  hours: [6, 22],                   // finestra del calendario: tutti gli eventi devono starci
  map: true,                        // false = versione lite senza mappa
  views: ["giorni", "calendario", "costi", "info"],   // viste presenti; la prima è quella di apertura
  tiles: { cartoKey: "", osm: true }
};
```

98. **Alba e tramonto** non si cercano: li calcola la pagina (formula NOAA) da `center`, `utc` e dalla data.

### 8.2 DAYS

```js
const DAYS = [{ date: "2026-12-11", title: "Arrivo e Innere Stadt", sleep: "Vienna" }];
```

### 8.3 PLACES

```js
const PLACES = {
  secession: { n: "Secession", g: "Secession, Friedrichstraße 12, Wien",
    wiki: "https://de.wikipedia.org/wiki/Wiener_Secessionsgeb%C3%A4ude", kind: "poi",
    lat: 48.200395, lng: 16.365934, q: "A",
    src: "Wikipedia DE + aggancio OSRM a Friedrichstraße (17 m)",
    addr: "Friedrichstraße 12, 1010 Wien", web: "https://secession.at/informationen_tickets",
    hours: "Mar-dom 10:00-18:00 (sito ufficiale)",
    price: "Tariffa non rilevata: 12,00 € è un'ipotesi da verificare",
    note: "L'edificio di Olbrich (1898) e il Fregio di Beethoven di Klimt." }
};
```

| Campo | Lite | Mappa e completo | Significato |
|---|---|---|---|
| `n` | sì | sì | nome mostrato, in italiano dove esiste |
| `kind` | sì | sì | `poi` luogo da visitare, `base` alloggio, `hub` stazione o aeroporto |
| `g` | sì per i `poi` | sì per i `poi` | testo di ricerca per i collegamenti, nella lingua locale |
| `addr` | sì | sì | indirizzo |
| `lat`, `lng` | no | sì | WGS-84 |
| `q`, `src` | no | sì | classe A, B o C e fonte della posizione |
| `hours`, `price` | no | per i `poi` | con la fonte tra parentesi, oppure "da verificare" |
| `wiki`, `web` | no | facoltativi | pagine di riferimento |
| `note` | no | facoltativo | perché andarci e cosa guardare, due righe |
| `far`, `ic` | no | facoltativi | punto lontano; icona dello snodo (`plane`, `train`) |

### 8.4 ROUTES

```js
const ROUTES = {
  r1: { stops: ["postsparkasse", "stephansdom", "looshaus", "loosbar"],
        legs: [[713.2, 570.6], [647, 517.8], [536.5, 429.2]],   // metri, secondi
        poly: "q_geHof~bB..." }
};
```

99. **Una voce per catena**. La pagina divide da sola la geometria nelle singole tratte.

### 8.5 BASE

```js
const BASE = {
  desc: "quartieri, assi principali e Donaukanal",     // compare sotto la mappa
  credit: "quartieri: Stadt Wien, data.gv.at",         // attribuzione dei dati delle aree
  areas: [{ n: "Innere Stadt", at: [48.2084, 16.3697], poly: "..." }],
  lines: [
    { n: "Ring", kind: "road", dist: 5511.9, poly: "..." },
    { n: "Donaukanal", kind: "water", dist: 5524.9, poly: "..." },
    { kind: "road", dist: 2778, legs: [752.4, 618.9, 1406.7],
      names: ["Kärntner Straße", "Rotenturmstraße", "Praterstraße"], poly: "..." }
  ],
  labels: [{ n: "Naschmarkt", at: [48.1987, 16.3628] }]
};
```

### 8.6 EVENTS

```js
{ d: 0, s: "13:40", e: "14:30", type: "visit", p: "postsparkasse", title: "Postsparkasse di Otto Wagner" },
{ d: 0, s: "14:30", e: "14:42", type: "move", mode: "walk", from: "postsparkasse", to: "stephansdom",
  r: ["r1", 0], title: "A piedi verso Stephansplatz" },
{ d: 0, s: "13:10", e: "13:35", type: "move", mode: "metro", from: "lodging", to: "postsparkasse",
  title: "U3 per Stubentor", detail: "STIMA porta a porta 20-25 minuti: ..." },
{ d: 0, s: "19:00", e: "20:30", type: "meal", title: "Cena in centro", detail: "Da scegliere e prenotare. Budget ipotizzato 30,00 €." },
{ d: 1, v: "sab-leopold", s: "15:00", e: "16:45", type: "visit", p: "mq", title: "Leopold Museum", detail: "..." }
```

| Campo | Significato |
|---|---|
| `d` | indice del giorno in `DAYS`, da 0 |
| `s`, `e` | inizio e fine, `"HH:MM"` con due cifre, ora locale |
| `type` | `visit`, `meal`, `move`, `log` (logistica: check-in, margini, attese, tempo libero) |
| `p` | luogo dell'evento, chiave di `PLACES`. Un pasto senza locale scelto non ha `p` e non va in mappa |
| `mode`, `from`, `to` | solo per `move`: `walk`, `metro`, `tram`, `bus`, `train`, `taxi`, `car`, `ferry`, `plane` |
| `r` | solo per le tratte calcolate: `[percorso, indice della tratta da 0]` |
| `v` | solo per gli eventi di un'alternativa: id della variante |
| `title` | breve, senza emoji: l'icona la mette la pagina |
| `detail` | testo della scheda. Facoltativo per le visite (c'è la nota del luogo), obbligatorio per mezzi e logistica |

### 8.7 VARIANTS

```js
const VARIANTS = [
  { id: "sab-leopold", d: 1, short: "Leopold Museum", name: "Pomeriggio al Leopold Museum",
    from: "15:00", to: "17:05",
    why: "Per pioggia o stanchezza: si resta nel MuseumsQuartier.",
    pro: "circa 1,6 km a piedi in meno, tutto al coperto", contro: "7,00 € in più" }
];
```

### 8.8 COSTS

```js
{ d: 2, cat: "Ingressi", desc: "Kunst Haus Wien", amt: 16, st: "Stima", note: "prezzo intero da wien.info" },
{ d: 2, cat: "Trasporti", desc: "Deposito bagagli Wien Hbf", amt: null, st: "Ipotesi", note: "prezzo non verificato" },
{ d: 1, cat: "Ingressi", desc: "WestLicht", amt: 12, st: "Stima", note: "...", x: ["sab-leopold"] },
{ d: 1, cat: "Ingressi", desc: "Leopold Museum", amt: 19, st: "Stima", note: "...", v: "sab-leopold" }
```

### 8.9 INFO, TODO, FONTI

100. **`INFO`**: schede di testo, ognuna con titolo `t` ed elenco `items`. **`TODO`**: cose da verificare o prenotare. **`FONTI`**: coppie titolo-indirizzo delle pagine usate. La pagina aggiunge da sola le schede Alternative pronte, Luce, Da verificare, Fonti.

---

## 9. Interfaccia e telefono

101. **Intestazione**: titolo, riga con date, persone e partenza, numeri chiave (giorni, luoghi, chilometri a piedi, totale stimato, varianti attive).
102. **Barra delle viste** fissa in alto.
103. **Vista Giorni**: selettore dei giorni, selettore del programma se il giorno ha alternative, mappa con riga di stato e legenda, statistiche, agenda, collegamenti al navigatore. Su schermo largo mappa e agenda affiancate.
104. **Mappa del giorno**: derivata dal calendario. I luoghi da visitare hanno un numero progressivo uguale sul segnaposto e in agenda; alloggio e snodi hanno un'icona. L'inquadratura mette prima le tappe: alloggio e snodi entrano solo se non allargano la vista oltre il 60%, altrimenti compare "Inquadra tutto".
105. **Agenda**: una riga per evento. Visite con il numero della tappa, spostamenti più leggeri con mezzo, minuti, chilometri e l'etichetta "stima" quando non sono calcolati, etichetta "variante" per gli eventi di un'alternativa.
106. **Vista Calendario**: colonne per giorno, ore in verticale, intestazioni fisse, fasce di buio e linee di alba e tramonto. Eventi sotto i 15 minuti come barre sottili, sotto i 36 minuti su una riga. Sopra le colonne dei giorni con alternative c'è un menu per cambiare programma.
107. **Vista Costi**: tre riquadri (totale con barra per stato, quota con prezzo da fonte, quota di ipotesi con le voci senza importo), filtri, tabella a tre colonne, sintesi per categoria e per giorno. I totali seguono filtri e varianti attive.
108. **Vista Info**: schede di `INFO`, alternative pronte, luce, cose da verificare, fonti con data.
109. **Scheda di dettaglio**: pannello dal basso su telefono. Per un luogo: orari del giorno, nota, indirizzo, orari, prezzo, classe e fonte della posizione, pulsanti Google Maps, Apple Maps, Google, Wikipedia, Sito. Per uno spostamento: mezzo, da, a, dati del percorso, indicazioni.
110. **Colori**: i colori di significato sono fissi (visita, spostamento, pasto, logistica; i quattro stati dei costi; avviso; i colori della mappa). Cambia solo l'accento, scelto dal luogo: nel blocco `:root` di `template.html` i token `--accent`, `--on-accent`, `--gold`, da ridefinire anche nei due blocchi del tema scuro.

**Regole per il telefono**

111. **Larghezza di progetto 360-430 px**. La pagina non deve mai scorrere in orizzontale: solo calendario e tabelle scorrono dentro il proprio riquadro.
112. **Comandi toccabili**: altezza minima 40 px per pulsanti e schede, 44 px per la barra delle viste, almeno 32 px per i menu compatti.
113. **Campi di testo a 16 px**: sotto quella misura iOS ingrandisce la pagina quando si tocca il campo.
114. **Mappa e scorrimento**: sul telefono un dito scorre la pagina, due dita muovono e ingrandiscono la mappa. Il pulsante "Sposta con 1 dito" inverte la scelta. Senza questa regola la mappa cattura il dito e la pagina resta bloccata.
115. **Scheda di dettaglio** dal basso, alta al massimo l'86% dello schermo, con margine per l'area sicura in basso.
116. **Fino a 3 giorni** stanno affiancati nel selettore e nel calendario; oltre, scorrimento orizzontale dentro il riquadro.
117. **Testi mai sotto i 9,5 px**, tabelle dei costi a tre colonne perché la quarta non entra.
118. **Completo a riposo**: all'apertura si vede subito il primo giorno con la sua mappa, senza passaggi obbligati.

**Moduli facoltativi**, da chiedere ogni volta nella scheda viaggio e da aggiungere come schede di `INFO` o come viste nuove:

119. **Trasporti estesi**: per città prime e ultime corse, tariffe, tessere, pagamenti, taxi.
120. **Società**: regole di comportamento e tabù.
121. **Cibo e frasi**: piatti, ingredienti nascosti per le restrizioni alimentari, frasi pronte.
122. **Convertitore di valuta**: solo se c'è più di una valuta, con tassi e data dichiarati.

---

## 10. Alternative

Le alternative servono in due momenti: durante la definizione del viaggio, per confrontare idee e sceglierne una, e sul posto, per cambiare programma all'ultimo minuto senza rifare i conti.

123. **Che cos'è una variante**: un programma diverso per un giorno. Sostituisce gli eventi base che iniziano tra `from` e `to` con gli eventi che portano il suo `id` nel campo `v`. Senza `from` e `to` sostituisce l'intera giornata.
124. **Tre usi**:
    - **fascia oraria**: un pomeriggio diverso (museo al posto di una passeggiata);
    - **giornata intera**: piano per il maltempo, gita fuori città;
    - **scenario su più giorni**: più varianti con lo stesso campo `set` (per esempio "Maltempo" o "In auto"). In alto compare un selettore Scenario che le attiva tutte insieme.
125. **Dati obbligatori di una variante**: `id` unico, `d`, `name`, `short` (etichetta del pulsante, due o tre parole), `why` (quando sceglierla), `pro`, `contro`.
126. **Regole per gli eventi di una variante**: iniziano dentro la finestra; il primo parte dal luogo in cui finisce l'ultimo evento base prima della finestra; l'ultimo arriva nel luogo da cui riparte il primo evento base dopo la finestra. Se serve un percorso nuovo si chiede come gli altri.
127. **Costi**: una voce che esiste solo nella variante ha `v: "<id>"`. Una voce base che la variante elimina ha `x: ["<id>"]`.
128. **Cosa vede l'utente**: nella vista Giorni il selettore Programma, una riga con motivo, pro e contro, e la tabella di confronto (tappe, ora di fine, chilometri e minuti a piedi, minuti con i mezzi, spesa del giorno) per base e varianti. La scelta cambia insieme mappa, agenda, calendario e costi, e resta memorizzata sul dispositivo.
129. **Quante**: al massimo 2-3 per giorno. Oltre, il confronto non si legge più.
130. **Durante le iterazioni**: proporre le alternative come varianti, far scegliere dalla tabella di confronto, poi **promuovere** quella scelta: cancellare gli eventi base della finestra, togliere `v` dagli eventi della variante, cancellare le voci di costo con `x`, togliere `v` dalle sue voci di costo, cancellare la variante da `VARIANTS`.
131. **Per il viaggio**: le alternative che restano sono piani B. Devono avere fatti verificati quanto il programma base (orari del giorno, prezzo), altrimenti sul posto non servono.
132. **Controlli**: `qa.mjs` verifica ogni giorno nel programma base e in ogni variante (sovrapposizioni, continuità, durate) e stampa la differenza di costo.

---

## 11. Regole di contenuto

133. **Tre prefissi nel testo di dettaglio**: `CONFERMATO - ` solo con il documento di prenotazione in mano. `STIMA - ` per dati presi da una fonte ma non prenotati, o calcolati a stima. `IPOTESI - ` per valori segnaposto.
134. **Fonte non ufficiale**: si dice. "Secondo fonti non ufficiali" vale più di un dato presentato come certo.
135. **Sempre in calendario**: ogni volo, treno, traghetto; ogni check-in e check-out; i margini prima delle partenze come blocchi separati; pranzo e cena tutti i giorni; tutti gli spostamenti tra un luogo e il successivo; deposito e ritiro dei bagagli; il tempo libero come blocco esplicito.
136. **Continuità**: ogni evento con un luogo è preceduto da uno spostamento che ci arriva. `qa.mjs` lo segnala.
137. **Vincoli spiegati**: se una tappa è in un certo giorno o a una certa ora per un motivo (chiusura nel fine settimana, tramonto alle 16:00), il motivo va nella nota.
138. **Testo per chi è in strada**: quale linea, quale fermata, quanti minuti a piedi. Maiuscole solo quando un errore costa caro.
139. **Scadenze fuori dal viaggio** (check-in online, documenti di ingresso): in `TODO` con la data.

---

## 12. Costi

140. **Una riga per voce elementare**: alloggi per notte, andata e ritorno separati, pasti uno per uno. Il file è un preventivo: le spese reali restano fuori.
141. **Categorie**: Voli, Alloggio, Trasporti, Ingressi, Pasti, Altro.
142. **Quattro stati**: Confermato (pagato o con documento), Prenotato (impegnato, non pagato), Stima (prezzo da fonte citata nella nota), Ipotesi (segnaposto senza fonte).
143. **Importo sconosciuto**: `amt: null`. La voce compare come "da definire", resta fuori dai totali e viene contata a parte.
144. **Più persone**: importi per l'intero gruppo, con la nota "a persona x N" quando serve.
145. **Quando una stima diventa prenotazione**: si aggiornano insieme importo, stato, codice nella descrizione e testo dell'evento collegato.

---

## 13. Costruzione e controlli

146. **Costruire**: `node build.mjs data.js itinerario-<destinazione>.html`. Lo script legge `TRIP.map`: se è `false` produce la versione lite senza Leaflet.
147. **Controllare i dati**: `node qa.mjs data.js itinerario-<destinazione>.html [istruzioni.md]`. Con un errore il file non si consegna. Gli avvisi si leggono uno per uno: si correggono oppure si dichiarano nel messaggio di consegna.
148. **Cosa controlla `qa.mjs`**: caratteri vietati; luoghi (coordinate, classe, fonte, testo di ricerca); percorsi (punto 87); base (lunghezze, poligoni); varianti (id, finestre, riferimenti); eventi per ogni giorno e ogni variante (formato degli orari, sovrapposizioni, finestra del calendario, riferimenti, durate, continuità, pasti); costi (stati, totali per stato, per giorno, per variante).
149. **Provare sul telefono simulato**: `node mobile-check.mjs itinerario-<destinazione>.html <cartella>`. Apre il file a 360, 390 e 430 px con tocco simulato, tema chiaro e scuro, e controlla: errori di script, scorrimento orizzontale, comandi troppo piccoli, ogni giorno e ogni alternativa, apertura della scheda. Salva le schermate a 390 px.
150. **Guardare le schermate una volta**: mappa del primo giorno (la base si vede? i segnaposto si distinguono?), calendario, costi. Una sola passata di correzioni.
151. **Se manca il browser**: saltare `mobile-check.mjs`, dichiararlo nel messaggio e chiedere all'utente di segnalare ciò che vede sul telefono.
152. **Sintassi**: estrarre l'ultimo blocco `<script>` del file e passarlo a `node --check`.

**Controlli manuali**

153. **Orari contro aperture**: ogni visita cade dentro l'orario di apertura del suo giorno della settimana.
154. **Margini realistici** prima di voli e treni, e nei cambi.
155. **Residui**: dopo ogni cambio cercare vecchio nome, codice e importo. Un alloggio cambiato tocca luoghi, percorsi, eventi e costi.
156. **`TODO` allineato**: ciò che è stato verificato esce dall'elenco.

---

## 14. Consegna

157. **Pubblicare l'artifact** con il file come `index.html`. Agli aggiornamenti ripubblicare lo stesso artifact indicando la versione di base, non crearne uno nuovo.
158. **Inviare anche il file** `.html`: serve per l'uso senza rete.
159. **Messaggio di consegna**, in punti numerati: livello costruito, cosa c'è, cosa è ipotesi, esito dei controlli (errori, avvisi, prova su telefono), cose da verificare, alternative presenti, punti aperti con alternative a lettere.
160. **Dire sempre com'è la mappa**: base ricalcata nell'artifact; cartografia a tessere solo nel file con chiave o su un sito.
161. **Non scrivere nel progetto** senza che sia stato chiesto, tranne il riepilogo del viaggio a viaggio confermato.

---

## 15. Errori tipici

162. **Fidarsi della pianificazione invece del biglietto**: quando arriva il documento fa fede quello, e si ricontrolla la giornata a ritroso.
163. **Dare per simmetriche andata e ritorno**: terminal, operatori e regole possono cambiare.
164. **Copiare i tempi dell'alloggio precedente**: cambiato l'alloggio si richiedono di nuovo i percorsi che lo toccano.
165. **Dimenticare check-out e deposito bagagli**.
166. **Lasciare una stima dopo la conferma**: falsa i totali.
167. **Coordinate a memoria presentate come certe**: senza riscontro sono classe C. A Vienna la stima della stazione centrale era a 290 m dal punto pubblicato.
168. **Invertire latitudine e longitudine** nelle richieste dei percorsi.
169. **Richieste a raffica al server dei percorsi**: vengono respinte.
170. **Incollare una polyline senza validarla**: un carattere perso sposta tutto il tracciato.
171. **Promettere la cartografia nell'artifact**: lì non si carica. C'è la base ricalcata.
172. **Mappa senza base**: punti su fondo vuoto non servono. `qa.mjs` avvisa se `BASE` manca.
173. **Tariffe dei trasporti dell'anno prima**: abbonamenti e prezzi cambiano a gennaio. A Vienna i biglietti da 48 e 72 ore sono spariti nel 2026.
174. **Collegamenti al navigatore con troppe tappe**: sul telefono quelle oltre la terza vengono ignorate. La pagina spezza da sola le catene.
175. **Testo di ricerca in italiano**: "Padiglione Otto Wagner" su Google Maps non trova nulla. Il campo `g` va nella lingua locale.
176. **Variante che non si riaggancia**: finisce in un luogo diverso da quello da cui riparte il programma base. `qa.mjs` lo segnala come avviso di continuità.
177. **Mappa che blocca lo scorrimento sul telefono**: vedi punto 114.
178. **Colonne del calendario che si allargano** per un menu o un titolo lungo: la larghezza minima è fissata dal codice, non dal contenuto.
179. **Caratteri speciali scritti come sequenze di escape dentro i comandi**: possono diventare caratteri veri nel file. Usare i codici numerici, come fa `qa.mjs`.
180. **Riassumere invece di istruire**: "trasferimento in hotel" non serve a nessuno alle sei del mattino.

---

## 16. Fonti

**Per tipo di dato**

| Dato | Dove cercarlo | Note |
|---|---|---|
| Orari e prezzi di musei e monumenti | Sito ufficiale, pagine orari e biglietti | Secondo riscontro: portale turistico della città |
| Mercati, eventi cittadini | Sito del comune | Verificare le eccezioni dei giorni festivi |
| Tariffe dei mezzi urbani | Sito del gestore, pagina delle tariffe dell'anno | Mai guide di viaggio datate |
| Aeroporto - città | Gestore ferroviario e sito dell'aeroporto | Cercare anche "lavori" e l'anno |
| Coordinate | Utente, poi Wikipedia (lingua locale e inglese), poi structurae.net | Capitolo 6 |
| Percorsi e durate a piedi | OSRM sul server FOSSGIS | Capitolo 7 |
| Confini dei quartieri | click_that_hood su GitHub | Punto 55 |
| Alba e tramonto | Calcolati dalla pagina | Punto 98 |
| Voli e alloggi | Solo su richiesta dell'utente | Altrimenti ipotesi dichiarate |

**Verifiche tecniche (13 novembre 2026)**

- Tessere OpenStreetMap e obbligo di Referer: https://wiki.openstreetmap.org/wiki/Blocked_tiles e https://operations.osmfoundation.org/policies/tiles/
- Tessere CARTO, chiave gratuita e limiti: https://carto.com/basemaps/ e https://docs.carto.com/faqs/carto-basemaps
- Google Maps URLs: https://developers.google.com/maps/documentation/urls/get-started (il limite di 3 tappe intermedie sui telefoni è stato letto in documentazione di terze parti che riprende quella ufficiale)
- Percorsi OSRM sul server FOSSGIS: https://routing.openstreetmap.de/
- Confini dei quartieri: https://github.com/codeforgermany/click_that_hood
- Leaflet 1.9.4: https://leafletjs.com/ (licenza BSD a due clausole)
- Limiti dell'ambiente di lavoro: provati direttamente, vedi capitolo 17.

---

## 17. Diario dell'esempio Vienna

Come è stato costruito `itinerario-vienna.html`, con i numeri reali. Serve come riferimento di quanto lavoro aspettarsi e di dove si inciampa.

181. **Contesto letto**: 4 documenti del progetto, memoria del progetto, una chat precedente e l'artifact del weekend in Emilia.
182. **Prove sull'ambiente**: dalla shell rispondono solo il registro npm e `raw.githubusercontent.com`. Non rispondono tessere, Overpass, Nominatim, server dei percorsi, Wikidata, altri CDN. Chrome è presente in `/usr/bin/google-chrome`.
183. **Prove su `WebFetch`**: rifiutano Nominatim, Photon, Overpass e la ricerca di openstreetmap.org. Rispondono il server dei percorsi FOSSGIS e le pagine di Wikipedia.
184. **Fatti**: 9 ricerche web per tariffe dei mezzi, collegamento con l'aeroporto e 7 luoghi con orari e prezzi, più 3 ricerche tecniche. Due sorprese utili: i biglietti da 48 e 72 ore aboliti nel 2026 e i lavori sulla linea dell'aeroporto.
185. **Coordinate**: 24 letture di Wikipedia per 18 luoghi, coordinate trovate in 11 letture. Per gli altri luoghi: 1 posizione da structurae e Sygic concordi, il resto stime, alcune confermate dall'aggancio alla via. Risultato: 4 luoghi in classe A, 8 in B, 6 in C.
186. **Percorsi**: 5 catene per 15 tratte a piedi, tutte valide alla prima risposta ricevuta (estremi entro 30 m, lunghezze entro il 3%).
187. **Base**: quartieri di Vienna scaricati da GitHub (23 quartieri, 18 tenuti, 5,8 KB dopo la semplificazione) e 5 linee: Ring, Donaukanal, asse Kärntner Straße - Rotenturmstraße - Praterstraße, Hauptallee, Mariahilfer Straße. Una richiesta è tornata troncata ed è stata rifatta in due parti.
188. **Alternative**: 2 varianti. Una ha richiesto una ricerca (orari e prezzo del Leopold Museum) e un percorso nuovo, l'altra riusa luoghi e percorsi esistenti.
189. **Controlli**: `qa.mjs` senza errori né avvisi; `mobile-check.mjs` senza problemi a 360, 390 e 430 px in chiaro e scuro, versione completa e lite. Correzioni nate dalle schermate: tabella dei costi ridotta a tre colonne, inquadratura della mappa sulle tappe, contrasto della base, larghezza delle colonne del calendario.
190. **Dimensioni**: versione completa 257 KB (di cui Leaflet circa 160), versione lite 63 KB.
191. **Non provato**: le tessere di cartografia e il file aperto dall'app File di un telefono reale.

---

## 18. Prompt di avvio

> Crea l'itinerario integrato seguendo `istruzioni-itinerario-integrato.md` e i file di `itinerario-kit`.
> Viaggio: [destinazione, date o periodo, persone].
> Livello: [lite, con mappa, completo].
> Parti dalla scheda viaggio precompilata con ciò che sai già dal progetto.
> Marca come CONFERMATO solo ciò di cui ti passo il documento. Verifica orari e tariffe su fonti ufficiali e dichiara la data.
> Alla fine esegui i controlli del capitolo 13 e dimmi errori, avvisi, esito della prova su telefono e cose rimaste da verificare.

---

## Appendice A - build.mjs

```js
/* Costruzione: node build.mjs [data.js] [uscita.html]
   Unisce template.html + data.js + app.js. Leaflet entra solo se TRIP.map non è false (versione lite senza mappa). */
import fs from 'fs';
const r = f => fs.readFileSync(f, 'utf8');
const dataFile = process.argv[2] || 'data.js', outFile = process.argv[3] || 'itinerario.html';
const data = r(dataFile), app = r('app.js');
const TRIP = new Function(data + '; return TRIP;')();
const lite = TRIP.map === false;
let css = '', js = '';
if (!lite) {
  css = r('node_modules/leaflet/dist/leaflet.css').replace(/url\([^)]*\)/g, 'none');   // niente immagini esterne: si usano solo divIcon
  js = r('node_modules/leaflet/dist/leaflet.js').replace(/\/\/# sourceMappingURL=.*$/m, '');
  if (/<\/script/i.test(js)) throw new Error('leaflet contiene </script>');
}
if (/<\/script/i.test(data + app)) throw new Error('i dati o la logica contengono </script>');
let out = r('template.html');
const put = (k, v) => { if (out.split(k).length !== 2) throw new Error('segnaposto ' + k); out = out.split(k).join(v); };
put('__TITLE__', TRIP.title); put('__LEAFLET_CSS__', css); put('__LEAFLET_JS__', js); put('__DATA__', data); put('__APP__', app);
fs.writeFileSync(outFile, out);
console.log((lite ? 'lite' : 'completo') + ' ok', (out.length / 1024).toFixed(0) + ' KB', outFile);
```

## Appendice B - base-areas.mjs

```js
/* Aree di contesto da un GeoJSON di quartieri: node base-areas.mjs quartieri.geojson data.js [km]
   Tiene i poligoni che toccano il riquadro dei luoghi non lontani (allargato di [km], predefinito 1.5),
   li semplifica a circa 12 m e stampa l'array "areas" da incollare in BASE. */
import fs from 'fs';
import polyline from '@mapbox/polyline';
const g = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const D = new Function(fs.readFileSync(process.argv[3], 'utf8') + '; return {PLACES,TRIP};')();
const pad = +(process.argv[4] || 1.5), P = Object.values(D.PLACES).filter(p => !p.far && p.lat);
const q = Math.PI / 180, kLat = 111.32, kLng = 111.32 * Math.cos(D.TRIP.center[0] * q);
const bb = [Math.min(...P.map(p => p.lat)) - pad / kLat, Math.min(...P.map(p => p.lng)) - pad / kLng, Math.max(...P.map(p => p.lat)) + pad / kLat, Math.max(...P.map(p => p.lng)) + pad / kLng];
const xy = c => [(c[0] - D.TRIP.center[1]) * kLng * 1000, (c[1] - D.TRIP.center[0]) * kLat * 1000];
function dp(pts, tol) { if (pts.length < 3) return pts; const a = xy(pts[0]), b = xy(pts[pts.length - 1]); let mx = 0, ix = 0; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1e-9;
  for (let i = 1; i < pts.length - 1; i++) { const p = xy(pts[i]), d = Math.abs(dy * (p[0] - a[0]) - dx * (p[1] - a[1])) / L; if (d > mx) { mx = d; ix = i; } }
  return mx > tol ? dp(pts.slice(0, ix + 1), tol).slice(0, -1).concat(dp(pts.slice(ix), tol)) : [pts[0], pts[pts.length - 1]]; }
const out = [];
for (const f of g.features) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  let ring = polys.map(p => p[0]).sort((a, b) => b.length - a.length)[0];            // anello esterno più grande
  const la = ring.map(c => c[1]), lo = ring.map(c => c[0]);
  if (Math.max(...la) < bb[0] || Math.min(...la) > bb[2] || Math.max(...lo) < bb[1] || Math.min(...lo) > bb[3]) continue;
  const half = Math.floor(ring.length / 2), s = dp(ring.slice(0, half + 1), 12).slice(0, -1).concat(dp(ring.slice(half), 12));
  let A = 0, cx = 0, cy = 0; for (let i = 0; i < s.length - 1; i++) { const k = s[i][0] * s[i + 1][1] - s[i + 1][0] * s[i][1]; A += k; cx += (s[i][0] + s[i + 1][0]) * k; cy += (s[i][1] + s[i + 1][1]) * k; }
  out.push({ n: f.properties.name || f.properties.NAME || '?', at: [+(cy / (3 * A)).toFixed(5), +(cx / (3 * A)).toFixed(5)], poly: polyline.encode(s.map(c => [c[1], c[0]])), pts: s.length });
}
console.error(out.map(a => a.n + ' ' + a.pts).join(' | '));
console.log(JSON.stringify(out.map(({ pts, ...a }) => a)));
```

## Appendice C - data.lite-esempio.js

```js
/* Esempio di PRIMA BOZZA LITE: solo calendario e costi, nessuna coordinata, nessun percorso calcolato.
   Costa pochissimo: serve a decidere struttura dei giorni e ordine di grandezza della spesa.
   Per passare alla versione con mappa si aggiungono lat, lng, q, src ai luoghi, i blocchi ROUTES e BASE, e si mette map: true. */
const TRIP = {
  title: "Vienna - prima bozza",
  sub: "Ven 11 - Dom 13 dicembre 2026 - 1 persona - bozza lite, tutto da verificare",
  verified: "nessuna verifica: bozza",
  center: [48.2082, 16.3738],
  utc: 1,
  hours: [8, 22],
  map: false,
  views: ["calendario", "costi", "info"]
};

const DAYS = [
  { date: "2026-12-11", title: "Arrivo e centro", sleep: "Vienna" },
  { date: "2026-12-12", title: "Wienzeile e Neubau", sleep: "Vienna" },
  { date: "2026-12-13", title: "Prater e rientro", sleep: "Roma" }
];

/* Nella bozza lite i luoghi hanno solo nome, testo di ricerca e indirizzo: bastano per i collegamenti al navigatore */
const PLACES = {
  lodging: { n: "Alloggio (zona Neubau)", kind: "base", addr: "Zona Neubaugasse, 1070 Wien" },
  stephansdom: { n: "Stephansdom", g: "Stephansdom, Wien", kind: "poi", addr: "Stephansplatz 3, 1010 Wien" },
  secession: { n: "Secession", g: "Secession, Friedrichstraße 12, Wien", kind: "poi", addr: "Friedrichstraße 12, 1010 Wien" },
  westlicht: { n: "WestLicht", g: "WestLicht, Westbahnstraße 40, Wien", kind: "poi", addr: "Westbahnstraße 40, 1070 Wien" },
  riesenrad: { n: "Riesenrad", g: "Wiener Riesenrad, Wien", kind: "poi", addr: "Riesenradplatz 1, 1020 Wien" }
};

const EVENTS = [
  { d: 0, s: "08:30", e: "10:10", type: "move", mode: "plane", title: "Volo Roma - Vienna", detail: "IPOTESI - Volo del mattino, da scegliere." },
  { d: 0, s: "10:30", e: "12:00", type: "move", mode: "train", title: "Aeroporto - alloggio", detail: "IPOTESI - Treno e metropolitana, circa 90 minuti porta a porta. Da verificare." },
  { d: 0, s: "12:15", e: "13:15", type: "meal", title: "Pranzo", detail: "Da scegliere." },
  { d: 0, s: "14:30", e: "16:30", type: "visit", p: "stephansdom", title: "Centro storico e Stephansdom" },
  { d: 0, s: "19:00", e: "20:30", type: "meal", title: "Cena in centro", detail: "Da scegliere." },
  { d: 1, s: "09:00", e: "10:30", type: "log", title: "Mercato delle pulci al Naschmarkt", detail: "IPOTESI - Solo il sabato mattina: orario da verificare." },
  { d: 1, s: "11:30", e: "12:30", type: "visit", p: "secession", title: "Secession" },
  { d: 1, s: "13:00", e: "14:00", type: "meal", title: "Pranzo", detail: "Da scegliere." },
  { d: 1, s: "15:30", e: "17:00", type: "visit", p: "westlicht", title: "WestLicht" },
  { d: 1, s: "19:30", e: "21:00", type: "meal", title: "Cena", detail: "Da scegliere." },
  { d: 2, s: "10:30", e: "11:30", type: "visit", p: "riesenrad", title: "Riesenrad" },
  { d: 2, s: "12:30", e: "13:30", type: "meal", title: "Pranzo", detail: "Da scegliere." },
  { d: 2, s: "16:00", e: "17:00", type: "move", mode: "train", title: "Verso l'aeroporto", detail: "IPOTESI - Da definire con l'orario del volo." },
  { d: 2, s: "19:00", e: "20:40", type: "move", mode: "plane", title: "Volo Vienna - Roma", detail: "IPOTESI - Volo della sera, da scegliere." }
];

const COSTS = [
  { d: 0, cat: "Voli", desc: "Volo andata e ritorno", amt: 180, st: "Ipotesi", note: "segnaposto" },
  { d: 0, cat: "Alloggio", desc: "Due notti in zona Neubau", amt: 220, st: "Ipotesi", note: "segnaposto" },
  { d: 0, cat: "Trasporti", desc: "Aeroporto e mezzi urbani", amt: null, st: "Ipotesi", note: "da verificare" },
  { d: 1, cat: "Ingressi", desc: "Musei e Riesenrad", amt: null, st: "Ipotesi", note: "da verificare" },
  { d: 1, cat: "Pasti", desc: "Pasti dei tre giorni", amt: 160, st: "Ipotesi", note: "segnaposto" }
];

const INFO = [
  { t: "Che cos'è questa bozza", items: [
    "Prima stesura senza ricerche: serve a decidere la struttura dei giorni prima di spendere tempo su orari, prezzi e mappa.",
    "Nessun dato è verificato. Il passo successivo aggiunge fonti, posizioni e percorsi."
  ] }
];
const TODO = ["Scegliere quali tappe tenere", "Poi: verifica di orari e prezzi, coordinate, percorsi e mappa"];
const FONTI = [];
```
