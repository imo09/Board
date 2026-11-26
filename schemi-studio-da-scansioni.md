---
name: "schemi-studio-da-scansioni"
description: "Trasforma le scansioni PDF di un libro di studio (es. La Degustazione AIS) in un documento di schemi: indice, sintesi, mappe mentali, ripasso, glossario analitico e glossario del libro."
---

# Schemi di studio da scansioni di un libro

Versione 7 (17/10/2026). A ogni modifica delle specifiche questa skill va riproposta per intero, così la nuova versione sostituisce la precedente. Novità rispetto alla v6: figure, schemi, grafici e tabelle del libro riportati nel documento; sommario anche nel Ripasso; differenze alla fine di ogni paragrafo dei capitoli variante, con sintesi in fondo al Ripasso; scheda unica adattabile a libri senza scheda ufficiale. Documento di riferimento già fatto: "La Degustazione" (AIS vol. 2), https://claude.ai/code/artifact/0dec89ab-74fd-4e94-859f-77b6f90cdb8a, da leggere per stile e formati, non da modificare. Istruzioni estese con codice: doc di progetto Wine "corsi/istruzioni-schemi-studio-ais-vol1.md".

## Quando usarla
L'utente carica scansioni (PDF di foto di pagine) di un libro che sta studiando e vuole un documento di studio. Il libro può arrivare in più parti: si lavora una parte alla volta e si completa il documento esistente, senza ricrearlo.

## Vincoli sul testo
1. **Niente trascrizione integrale**: il libro è protetto da copyright. Si riformula con parole proprie; si riportano esatti solo nomi propri, numeri, unità, termini tecnici, classificazioni e scale ufficiali. Citazioni testuali solo brevi, tra virgolette e con pagina.
2. **Fedeltà dei contenuti**: nessun dato inventato, nessuna aggiunta esterna al libro. Se un passaggio è illeggibile o dubbio, lo si segnala.
3. **Incongruenze del libro**: se il libro si contraddice (un esempio di calcolo che non torna con la sua tabella, una scala elencata in due modi, due descrizioni diverse dello stesso metodo, soglie non contigue, un rimando a una pagina o figura sbagliata, una figura che contraddice il testo, un refuso evidente) NON lo si scrive nel documento di studio: nel testo si usa la versione coerente (scheda ufficiale, tabella, indice) senza commenti. Le incongruenze vanno in un PDF separato "<Titolo> - Incongruenze del libro" (A4 orizzontale, reportlab), con una tabella numerata: N., pagine, argomento, cosa dice il libro, problema, tipo (rimando, lacuna, terminologia, valori numerici, refuso, descrizioni diverse), versione usata nel documento. Il PDF copre tutte le parti già verificate e si rigenera quando ne arrivano di nuove. Non sono incongruenze le differenze volute dal libro tra casi diversi, né regole esterne riportate fedelmente (es. intervalli di legge che si sovrappongono).
4. **Lingua e stile**: italiano; mai usare il trattino lungo o il punto mediano, sempre " - " (anche in widget e PDF); numeri con la virgola decimale (es. 0,5 g/l).

## Lettura delle scansioni
1. Rasterizzare ogni pagina (pdftoppm, 100 dpi; 200 dpi e ritaglio per tabelle ruotate, figure, didascalie o testo piccolo) e fare l'OCR in italiano in background (tesseract, lingua ita; il file ita.traineddata si scarica da raw.githubusercontent.com, repository tessdata).
2. Leggere l'OCR come base e guardare le immagini, ritagliate, dove l'OCR è confuso: tabelle, schemi, colonne, riquadri, inizio e fine pagina. Le immagini lette spariscono presto dal contesto: annotare subito i contenuti in testo.
3. Ricostruire la corrispondenza "pagina PDF -> numero di pagina del libro" leggendo il numero stampato.
4. **Pagine assenti**: le pagine mancanti sono di norma immagini a tutta pagina e non vanno segnalate. Si segnala una pagina solo se c'è un indizio concreto di testo perso: frase troncata a fine pagina che non riprende nella successiva presente, paragrafo o voce di elenco che salta, paragrafo dell'indice senza testo.
5. Leggere anche i riquadri "Se vuoi approfondire", le tabelle, le schede riprodotte e le didascalie con contenuto. Guardare anche le pagine di apertura dei capitoli: se il libro etichetta un capitolo come "Approfondimento", lo si dice nella riga priorità.
6. Per le incongruenze, cercare nell'OCR i rimandi interni ("p.", "pag.", "pp.", "capitolo", "fig.", "tab.") e verificarne la destinazione; confrontare soglie, scale, termini e date tra testo, tabelle, figure, schede riprodotte e glossario.

## Livelli di priorità (usati ovunque)
- **Da sapere a memoria**: voci e scale della scheda ufficiale, classificazioni, numeri e regole operative.
- **Da capire**: concetti e processi da comprendere, non da memorizzare alla lettera.
- **Fuori scheda ma utile**: non in scheda o non oggetto di esame, ma serve per altri giudizi (es. termini di legge, termini descritti nel testo ma assenti dalla scheda).
- **Approfondimento**: facoltativo; vale per i riquadri "Se vuoi approfondire" e per i capitoli che il libro stesso chiama approfondimento.
Il livello si deduce dalle etichette del libro, dalla presenza in scheda o nelle classificazioni ufficiali e dal tono operativo del testo; se è dubbio, va nei Punti aperti.

## Struttura del documento (artifact Docs, una scheda per sezione)
- **Titolo** = titolo effettivo del libro, letto dalle scansioni; sottotitolo con editore e volume. Il nome del documento si imposta con la patch di progetto sul campo "name". Se il titolo nella galleria Artifacts resta quello vecchio, avvisare l'utente che va rinominato dall'app.
- **Scheda "Indice"**: sommario del libro riportato per intero, con la stessa numerazione dei paragrafi usata nel testo (1.1, 2.3, e i sottoparagrafi numerati come 2.3.1, annidati), pagine, ogni capitolo con chip alla sua scheda; appendici, glossario e bibliografia con chip alla scheda che li contiene; legenda dei livelli di priorità; link a Ripasso, Glossario analitico e Glossario del libro; tabella "Figure e tabelle del libro" (vedi sotto).
- **Scheda "Ripasso"** (subito dopo l'Indice), unico luogo per gli schemi tra capitoli. In ordine: titolo, **sommario cliccabile** delle sue sezioni, riga sulle fonti; scheda unica interattiva con tutte le scale della scheda ufficiale, una fase per sezione della scheda (comprese le considerazioni finali); tabelle delle voci con schema fisso (cosa misura, da cosa dipende, come si valuta, pagine), una per fase; tabella "da non confondere"; elenco "trappole" (cosa NON indica qualità); tabella dei numeri chiave con pagina; procedura operativa passo-passo; disegno della bilancia o altro schema di sintesi; per ultima, la sintesi delle differenze dei capitoli variante. Se il libro non ha una scheda ufficiale, la scheda unica si adatta al contenuto (classificazioni, fasi di un processo, calendari) e l'adattamento si propone nei Punti aperti alla prima parte, con alternative (a), (b). Si aggiorna a ogni nuova parte del libro.
- **Una scheda per capitolo**, con questo ordine:
  1. Riga "Pagine X-Y" (più eventuali pagine con possibile testo mancante, motivando).
  2. **Sommario** cliccabile dei paragrafi, con link interni ai titoli (`[2.1 Titolo](#<id del titolo>)`) separati da " - ", comprese Sintesi, Introduzione, sezioni aggiunte, Rimandi e Mappa mentale; nei capitoli lunghi anche i sottoparagrafi numerati, tra parentesi.
  3. Riga priorità del capitolo con i quattro livelli, PRIMA della sintesi.
  4. **Sintesi del capitolo**: 3-5 frasi.
  5. **Una sezione per paragrafo** del libro, con le pagine nel titolo. Numerazione gerarchica solo per i paragrafi originali del sommario del libro (es. 2.1, 2.2) e per i loro sottoparagrafi originali che nel libro hanno un titolo proprio (es. 2.3.1); le sezioni aggiunte (Sintesi, introduzione senza titolo nel libro, tabelle riassuntive, schemi, Rimandi, Mappa) restano senza numero. Se il sommario del libro mette un paragrafo in un punto poco logico, si tiene la numerazione del libro, lo si colloca dove ha senso e si scrive dove sta nel libro. Subito sotto il titolo, prima dei punti, la riga "**Priorità:** ..." del paragrafo. Poi bullet "concetto in grassetto: spiegazione breve". Ogni voce di valutazione o descrittiva segue lo schema fisso: definizione, da cosa dipende, come si valuta o riconosce, scala o classificazione, esempi tipici. Scale, classificazioni e confronti in tabella. Approfondimenti marcati "(approfondimento)". Le figure del libro vanno nel paragrafo a cui appartengono.
  6. **Schemi di studio del capitolo**: disegni dentro la sezione del paragrafo a cui si riferiscono, solo su argomenti del capitolo corrente e solo dove aiutano davvero (flussi, sequenze di esame, cicli, parabole, pesi e punteggi, esempi di calcolo passo per passo, intervalli numerici a confronto, parti di un oggetto, livelli annidati, origine ed effetto, zone di lettura, tempi). Gli schemi tra capitoli vanno solo nel Ripasso. Controllare ogni disegno con uno screenshot.
  7. **Rimandi**: link (chip) alle altre schede dove lo stesso concetto ritorna.
  8. **Mappa mentale** finale: diagramma ad albero, radice = capitolo, un ramo colorato per paragrafo, foglie = parole chiave con descrizione all'osso; deve riportare quasi tutto il capitolo.
- **Capitoli "variante"** (una tipologia con logica simile ma differenze, es. frizzanti e spumanti rispetto ai vini fermi): stessa struttura, più quattro elementi.
  1. Sezione aggiunta "**Le differenze in breve**" subito dopo la sintesi: tabella "aspetto | caso base | variante", con uno schema della sequenza di esame che segna ogni passo come nuovo, diverso o uguale.
  2. **Scheda interattiva propria** della variante, subito dopo, con lo stesso schema della scheda unica e in più una lettera per voce che dice la differenza dal caso base: N voce nuova, B voce già presente nella scheda base, D termini diversi, L stessi termini con lettura o esempi diversi, = uguale. Nella nuvoletta della voce si aggiunge "Rispetto a ..."; i termini nuovi hanno un bordo di colore proprio. Termini di legge o altri elenchi fuori scheda vanno in una riga segnata come tali.
  3. **Alla fine di ogni paragrafo e sottoparagrafo**, un titolo "**Differenze rispetto ai ...**" con 2-4 punti, ancorati ai capitoli del caso base; se il libro non indica differenze, lo si scrive esplicitamente.
  4. **Sintesi nel Ripasso**, ultima sezione: tabella "Ambito | Caso base | Variante | Pagine" con concetti chiave in grassetto e chip al capitolo; "-" dove il libro non fa un confronto esplicito.
- **Scheda "Glossario"** (analitico): tabella alfabetica con termine in grassetto, significato breve, pagine del libro e chip al capitolo che le tratta (più chip se il termine ricorre). Si integra a ogni parte: si rigenera l'intera tabella in ordine alfabetico, riscrivendo le chip con una chiave per capitolo ripetuta.
- **Scheda "Glossario del libro"** (ultima), separata dal glossario analitico: il glossario che il libro riporta in fondo, con definizioni riformulate e pagina, e la bibliografia del libro (autore, titolo, editore o rivista, anno). Il glossario analitico e l'Indice la collegano con una chip.

## Figure, schemi, grafici e tabelle del libro
1. **Inventario prima di scrivere**: per ogni parte, elenco di tutte le figure con pagina, numero o didascalia (o "senza numero"), tipo (tabella, schema o flusso, grafico, disegno tecnico o anatomico, mappa, cronologia, foto o illustrazione), paragrafo di appartenenza e contenuto informativo trascritto in testo (file di lavoro, es. fig/inventario.csv).
2. **Come si riporta**:
   - tabella: tabella Docs con gli stessi dati; intestazioni e valori esatti, descrizioni lunghe riformulate;
   - schema, flusso, cronologia: ridisegnato come widget SVG originale, mai la scansione incollata; stessi elementi, relazioni, frecce, numeri ed etichette tecniche;
   - grafico con dati: ridisegnato solo con valori dichiarati nel testo o letti con certezza sugli assi; se letti dal grafico, la didascalia dice "valori indicativi"; se illeggibili, solo andamento qualitativo dichiarato;
   - disegno tecnico o anatomico: schema con le parti etichettate come nel libro, oppure tabella "parte | posizione | funzione";
   - mappa: schema solo se l'informazione è nella disposizione, altrimenti tabella "zona | caratteristiche | pagina";
   - foto o illustrazione decorativa: non si riporta; se mostra qualcosa che il testo usa, una riga "Nel libro, p. N: foto di ...".
3. **Distinguere libro e aggiunte**: didascalia "**Dal libro**, fig. X, p. N - <titolo>" per le figure del libro, con etichetta "Libro, p. N" nel titolo del disegno; "**Schema di studio** - <titolo> (pp. N-M)" per quelli creati. Nelle figure dal libro non si aggiungono informazioni: le integrazioni vanno in uno schema di studio separato.
4. **Elenco nell'Indice**: tabella "Figure e tabelle del libro" con N., pagina, fig./tab., titolo breve, tipo, come è riportata (tabella, schema ridisegnato, grafico indicativo, descritta, non riportata perché decorativa), chip al capitolo. Ogni voce dell'inventario deve avere una riga.
5. **Controllo**: screenshot di ogni figura ridisegnata confrontato con il ritaglio della scansione (elementi, frecce, numeri, etichette).

## Schede interattive (scheda unica nel Ripasso e schede delle varianti)
- Widget `claude.Visualize` con due sorgenti di righe: le voci (nome, gesto per valutarla, fase, capitolo, pagine, cosa misura; per le varianti anche lettera e testo della differenza) e i livelli (termine, etichetta breve, definizione, flag).
- Ogni scala è una riga di caselle con colore crescente dal minimo al massimo; le righe di tonalità o famiglie sono grigie perché non sono scale di valore. Sotto il nome della voce si scrive il gesto da fare. Un colore per fase (vista, olfatto, gusto, considerazioni finali). Elenchi lunghi (oltre 7 termini) si spezzano in due righe "(1)" e "(2)".
- Passaggio del mouse con `Tooltip`: sulla voce mostra cosa misura, come si valuta, differenza (se variante), capitolo e pagine; sul termine mostra la definizione con capitolo e pagine.
- **Niente `datum(...)` sugli elementi dentro un `Tooltip`**: il documento mostrerebbe una seconda nuvoletta automatica con i dati grezzi della riga, sovrapposta alla prima (l'avviso "no datum path" del validatore va ignorato).
- Pulsante `Button` "Nascondi i termini" / "Mostra i termini" in alto a destra, con stato `React.useState` nel componente esterno (radice `<div>` che contiene il pulsante e il `claude.Visualize`): svuota le caselle per il ripasso attivo, la nuvoletta continua a mostrare il termine per la verifica.
- Bordo verde solo sui livelli che il libro indica come norma o più frequenti, tratteggio rosso sui livelli negativi o rari.
- Sotto il widget vanno le istruzioni d'uso e le chip ai capitoli e al Glossario, perché i widget non contengono link.
- Modifiche piccole (aggiungere voci o una fase): `draft-edit` con citazioni esatte del codice, screenshot del draft, poi `publish`; un draft con basePub si pubblica direttamente.

## Grafica dei disegni
- Colori solo con i token del documento (`var(--cds-text-primary)`, `var(--cds-text-secondary)`, `var(--cds-chart-axis)`, `var(--cds-chart-categorical-1..8)`), così funzionano anche in modalità scura. viewBox largo 760.
- Circa 6,05 px per carattere a 11,5 px: contare la larghezza delle righe rispetto ai riquadri prima di inviare; note lunghe su due righe; etichette e badge in basso a destra del riquadro.
- Generare i disegni con script Python da liste di dati (mappa mentale: un ramo per paragrafo, foglie "parola chiave: descrizione" con a capo automatico), così le correzioni si fanno sui dati.

## Note tecniche sul documento
- Creazione: la prima chiamata è lo scheletro del documento (titolo, sottotitolo, un blocco pending per sezione); poi `guide` topic.index e, se serve, topic.editing.
- Letture: `read` con payload `{"kind":"view","outline":true}` per lo schema della scheda, `{"kind":"view","parentId":"<id>"}` per un blocco intero, `{"kind":"search","text":"..."}` per cercare. Annotare in un file gli id di schede, body, widget e titoli.
- Chip a una scheda: `{"type":"mention","ref":"file/<id scheda>"}` (la stessa chiave si può ripetere nel markdown); embed: `{"type":"embed","ref":"node/<id>","caption":"..."}`.
- Widget molto lunghi: crearli prima da soli (`create` di un nodo widget nella scheda), poi inserire l'embed con l'id ottenuto.
- Testo nei disegni: ogni `<text>` con il suo id letterale; niente id su un `<text>` che contiene `<tspan>`: etichetta in grassetto e descrizione vanno in due `<text>` separati.
- Sommario con link: si scrive il capitolo con un sommario segnaposto, poi si inserisce il paragrafo con i link (`insert` dopo il segnaposto) e si cancella il segnaposto; la sostituzione diretta di un paragrafo con link viene rifiutata.
- Spostare sezioni: `move` con gli id dei blocchi e `to:{target, side}` (`{"kind":"root"}` + `"end"` = fondo della scheda).
- Righe da aggiungere a una tabella: `insert` con `"as":"blocks"` e `side "end"` sull'id della tabella. Una cella si cambia con find + `replace "as":"text"`. Un punto di elenco si toglie con `delete` sull'id del listItem, con ifHash e ifRev.
- Export PDF: il risultato finisce in un file JSON in tool-results; il PDF è nel `bytes_b64` dell'ultimo elemento. Lo script di conteggio va lanciato dalla cartella dei file; i file elaborati si spostano in tool-results/old/. Al massimo 3 export di fila, poi 20 secondi di attesa.

## Verifica finale
Prima di consegnare, rileggere le pagine sorgente e confrontare numeri, unità, scale, esempi di vini e vitigni, attribuzioni. Per un controllo sistematico si usa l'OCR e si cercano i numeri citati; si controlla che l'elenco delle figure coincida con l'inventario. All'utente si riportano solo le correzioni significative; le incongruenze del libro vanno solo nel PDF separato.

## A ogni consegna
Riportare la lunghezza del documento stampato in A4: esportare ogni scheda in PDF A4, contare le pagine con pdfinfo, dare il totale per scheda e del documento.

## Versione HTML (su richiesta, a testo concluso)
Solo quando il documento è completo e l'utente lo chiede: un'unica pagina web interattiva con tutti i capitoli, paragrafi richiudibili ("collassa tutto"), nuvolette e pulsante delle schede; va rigenerata dopo ogni modifica del documento.

## Esclusioni
Niente domande, quiz o esercizi salvo richiesta esplicita. Eccezione approvata: il pulsante "Nascondi i termini" delle schede interattive.