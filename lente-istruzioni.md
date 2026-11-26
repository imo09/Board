# Lente - istruzioni per semplificare i cedolini

Versione 1.4 - ottobre 2026

Queste istruzioni descrivono come trasformare i PDF dei cedolini paga di una persona in un'unica pagina HTML semplificata, leggibile da telefono, che cresce mese dopo mese. Non contengono dati di un cedolino specifico.

File collegati:
1. `lente-ccnl.md`: schede dei CCNL e dei fondi di categoria; va consultato dopo aver letto la testata (punto 3.10).
2. `lente-festivita.md`: festività nazionali, ex festività e patroni per anno; va consultato per il calendario e i controlli sui giorni (punto 6).

## 0. Flusso continuativo e registro

1. **Una pagina per persona:** la pagina contiene tutti i cedolini caricati nel tempo. Ogni nuovo cedolino non crea una pagina nuova: aggiorna quella esistente.
2. **Registro dentro la pagina:** i dati estratti vivono in un blocco `<script type="application/json" id="registro">` nella pagina stessa. Il registro è personale, quindi non va salvato nei documenti del progetto: la persona conserva la pagina e la riallega insieme al nuovo cedolino.
3. **Registro come fonte di verità:** la pagina si rigenera sempre per intero dal registro. Prima di rigenerare, leggi il registro dalla pagina allegata (o, se la pagina è pubblicata come artifact, rileggila), aggiungi o sostituisci il mese, poi riscrivi tutto.
4. **Mese già presente:** se arriva di nuovo un mese già nel registro (per esempio un cedolino corretto), sostituiscilo e segnalalo; non duplicarlo.
5. **Contenuto del registro:**
   - `persona`: nome, datore, sede (solo testo per l'intestazione; oscurabile).
   - `contratto`: CCNL, codice, categoria, livello, data di assunzione, ore annue di ferie e permessi, ore al giorno, divisore, mensilità, patrono della sede con origine e nota.
   - `festivita`: per ogni anno coperto, l'elenco preso da `lente-festivita.md` più il patrono della sede, ciascuno con data, nome e tipo (`naz`, `loc`, `exf`).
   - `mesi`: per ogni cedolino, periodo, lordo, trattenute, fuori dal lordo, netto, giorni del mese per tipo (lavorati, ferie, permessi, malattia), contatori di ferie e permessi (anno precedente, maturato, goduto, saldo), progressivi, voci del costo azienda, esito dei controlli.
   - `promemoria`: elenco di mese e testo, da aggiornare a ogni cedolino (i promemoria scaduti e verificati si tolgono).
   - `piano`: ferie e permessi passati o futuri indicati dalla persona (data `AAAA-MM-GG`, oppure solo `AAAA-MM` se il giorno non è noto; tipo `F` o `P`; ore; motivo; origine). Se la persona allega un foglio di pianificazione, importalo qui; se incolla le voci copiate dalla pagina ("Copia per il registro"), aggiungile senza duplicati.
   - In `contratto` servono anche: stipendio mensile fisso (somma degli elementi retributivi, senza voci forfettarie), mese di pagamento e periodo di maturazione di ogni mensilità aggiuntiva, ex festività pagate in busta (`MM-GG`), scaglioni IRPEF dell'anno.
   - In ogni mese servono anche: IRPEF trattenuta e imponibile fiscale del mese.
6. **Mai nel registro:** gli stessi dati vietati nella pagina (punto 11.3).
7. **Dettaglio del mese:** il markup di ogni mese si genera dalle voci del cedolino come descritto nei punti 4-9; il registro conserva i totali e i dati che servono a riepilogo e calendario.

## 1. Obiettivo

1. **Una domanda alla volta:** la pagina risponde nell'ordine a "quanto prendo", "da dove viene", "dove va", "i giorni tornano", "quanto costo all'azienda", "cosa ho accumulato".
2. **Mai inventare:** ogni numero viene dal cedolino o da un calcolo dichiarato. Le stime sono etichettate come "stima". Ciò che non si legge non compare, oppure compare come "da verificare".
3. **Regole dell'anno del cedolino:** aliquote, festività e norme vanno applicate secondo l'anno a cui si riferisce il cedolino, non l'anno corrente.

## 2. Lettura del PDF

1. **Testo e immagine insieme:** estrai il testo e guarda anche la pagina renderizzata. Il testo dà i numeri esatti, l'immagine dice in quale colonna stanno.
2. **Colonne:** per ogni riga di voce identifica codice, descrizione, quantità (ore, giorni o percentuale), base o compenso unitario, importo in "competenze" o in "trattenute". Un importo nella colonna "base" senza importo in competenze o trattenute è una voce figurativa: non si paga in busta.
3. **Più pagine o più cedolini:** se il PDF contiene più mesi o una mensilità aggiuntiva separata (13ª, 14ª), trattali come cedolini distinti.
4. **Scansioni:** se il PDF è un'immagine, leggi dall'immagine e abbassa la fiducia: ogni numero deve superare i controlli di quadratura, altrimenti segnalalo.

## 3. Dati da raccogliere

1. **Testata:** mese e anno, datore di lavoro, CCNL, qualifica, livello, mansione, data di assunzione, sede di lavoro, comune di residenza, divisore contrattuale se visibile.
2. **Elementi retributivi:** paga base, contingenza, scatti, superminimo (assorbibile o no), elementi territoriali, indennità fisse, totale.
3. **Voci del mese:** tutte le righe del corpo, con la colonna di appartenenza.
4. **Dati fiscali:** imponibile del mese, IRPEF lorda, detrazioni (per tipo), IRPEF netta, addizionali con rate e residui, progressivi annui.
5. **Dati previdenziali:** imponibile, aliquote, giorni e settimane INPS, progressivi.
6. **TFR e fondi:** retribuzione utile, quota del mese, contributo 0,50%, quota versata al fondo, contributi azienda al fondo, fondo accumulato.
7. **Ratei:** ferie, ROL, ex festività, altri permessi, con colonne anno precedente, maturato, goduto, saldo e unità (ore o giorni).
8. **Presenze:** calendario del mese con ore ordinarie, assenze, eventi.
9. **Netto:** netto a pagare e arrotondamenti. Non riportare mai IBAN, codice fiscale, indirizzo, matricola.
10. **Scheda CCNL:** con codice CNEL o nome del contratto e categoria (operaio, impiegato, quadro) cerca la scheda in `lente-ccnl.md`. Da lì prendi mensilità, divisore, ferie, permessi, trattamento delle ex festività, minimi, fondi di categoria. Usa i dati "da verificare" solo come ipotesi dichiarata. Se manca la scheda, lascia i campi vuoti e chiedili nel pannello "Contratto e fondi".

## 4. Classificazione delle voci

| Categoria | Dove va nella pagina | Parole chiave tipiche |
|---|---|---|
| Retribuzione fissa | Lordo, "Stipendio" con sotto-righe degli elementi | stipendio, retribuzione, paga base, contingenza, scatti, superminimo, E.R.T., E.E.T., indennità di funzione |
| Retribuzione variabile | Lordo | straordinario, maggiorazione, trasferta, indennità, reperibilità, turno, festività, festività non goduta |
| Una tantum | Lordo | 13ª, 14ª, premio, una tantum, arretrati, conguaglio a credito |
| Elementi minori | Lordo | EDR, IVC, elemento perequativo |
| Previdenza obbligatoria | Trattenute, gruppo "Previdenza obbligatoria" | INPS, IVS, F.A.P., contributo aggiuntivo, CIGS, FIS |
| Previdenza integrativa | Trattenute, gruppo "Fondo pensione" | fondo, previdenza complementare, nomi dei fondi (Prevedi, Cometa, Fonchim, Fon.Te, ecc.), volontario |
| Fisco | Trattenute, gruppo "Fisco" | imponibile IRPEF, IRPEF lorda, detrazioni, IRPEF netta, imposta netta, codice 1001 |
| Addizionali | Trattenute, gruppo "Fisco" | addizionale regionale, addizionale comunale, acconto, saldo, rata |
| Altre trattenute | Trattenute, gruppo "Altre" | sindacato, cessione del quinto, pignoramento, anticipo, prestito, mensa |
| Fuori dal lordo | Pannello "Fuori dal lordo" | trattamento integrativo, rimborso spese, rimborso 730, somma esente cuneo |
| Figurative | Nota nel pannello pertinente, mai nel netto | buoni pasto, fringe benefit, welfare, valori in sola colonna base |
| Contributi azienda | Costo per l'azienda | c/azienda, c/ditta, contributo contrattuale, assistenza sanitaria ditta, ente bilaterale ditta |

1. **Voce non riconosciuta:** mettila nel gruppo più probabile con l'etichetta "da verificare" e segnalala nei controlli. Non lasciarla fuori dai totali.
2. **Esoneri contributivi:** se compaiono tra le competenze, mostrali come riduzione dei contributi e scrivilo nella nota.
3. **Etichette chiare:** riscrivi la descrizione del cedolino in italiano comune ("Straordinario forfettario" invece di "STR. FORFETTIZZATO"). Il codice originale non serve nella pagina.

## 5. Calcoli e percentuali

1. **Basi delle percentuali:** riepilogo e voci del lordo sul lordo del mese; voci delle trattenute sul totale trattenute; costo azienda come percentuale sul lordo nel riepilogo e sul totale della sezione nel dettaglio.
2. **Righe intermedie senza percentuale:** imponibili, IRPEF lorda, detrazioni e sotto-voci mostrano solo l'importo. La percentuale va sul totale del gruppo.
3. **Barra del netto:** una barra unica, alta circa 30 px, che divide il lordo in netto, previdenza, fondo pensione, fisco, altre trattenute. Ogni parte riporta la sua percentuale, centrata. Le parti strette perdono il simbolo "%" sotto i 520 px di larghezza; quelle troppo strette anche per il numero restano senza scritta ma toccabili (larghezza minima 24 px). La parte selezionata ha un bordo interno, non esterno, per non lasciare residui grafici quando si deseleziona. Sotto la barra: una legenda dei colori e un riquadro di dettaglio. Niente didascalia "su 100,00 € lordi": quell'informazione vive nel dettaglio.
4. **Dettaglio della barra:** toccando una parte, le altre si attenuano e il riquadro mostra nome, importo, percentuale del lordo letta come "X € ogni 100,00 €", da cosa è composta, e un collegamento che apre il pannello corrispondente. Toccando di nuovo la stessa parte si torna al messaggio iniziale "Tocca una parte della barra".
5. **Arrotondamenti:** due decimali. Se le percentuali di un gruppo non sommano a 100,00 per arrotondamento, correggi l'ultima.

## 6. Controlli

### Quadratura (sezione "Quadratura")

1. **Netto:** competenze meno trattenute, più o meno voci fuori dal lordo e arrotondamenti, uguale netto a pagare, con tolleranza 0,01 €.
2. **Stipendio:** somma degli elementi retributivi uguale alla voce stipendio (o al totale in testata).
3. **Imponibile fiscale:** lordo imponibile meno contributi e quote deducibili uguale imponibile del cedolino.
4. **IRPEF:** lorda meno detrazioni uguale netta.
5. **TFR:** retribuzione utile diviso 13,50 uguale quota del mese; quota meno 0,50% uguale quota al fondo, se presente.
6. **Ratei:** anno precedente più maturato meno goduto uguale saldo.
7. **Rispetto al CCNL (sottogruppo separato, solo con scheda):** paga base e contingenza uguali ai valori del livello; ferie e permessi maturati uguali al valore annuo ÷ 12 × mesi di servizio nell'anno (tolleranza dovuta all'arrotondamento del rateo mensile, da indicare); voci a giornata calcolate con il divisore del contratto.
8. **Esito:** nel riepilogo della sezione scrivi "N su N ok", contando entrambi i gruppi. Se un controllo fallisce, mostra la differenza e non correggere i numeri.

### Giorni del mese (sezione "Il mese in giorni")

1. **Ore:** ore lavorate più assenze retribuite uguale ore lavorabili del mese.
2. **Festività:** prendi festività nazionali, ex festività e patrono da `lente-festivita.md`, per l'anno del cedolino. Il patrono è quello del comune della sede di lavoro; se il cedolino riporta solo la provincia, chiedi il comune o la data e segna l'origine "indicato da te".
3. **Festivo in giorno feriale:** non deve risultare come ferie o permesso.
4. **Festivo di domenica:** deve comparire la festività non goduta, nel mese o in quello successivo. Importo indicativo = retribuzione mensile × divisore della scheda CCNL; senza scheda usa 1/26 e dichiaralo.
5. **Ex festività:** 19 marzo, Ascensione, Corpus Domini, 29 giugno, 4 novembre. Il CCNL decide se diventano permessi o pagamento: usa la scheda per spiegare un contatore vuoto o per prevedere un compenso in busta (importo = stipendio × divisore). Ciò che la scheda non copre resta "da verificare".
6. **Promemoria:** guarda i due mesi successivi e segnala festività di domenica, ex festività e patrono in arrivo. Segnala anche, per i mesi senza cedolino, cosa controllare quando arriveranno (per esempio un patrono che non deve risultare ferie). Aggiungi i promemoria al registro.
7. **Altri controlli utili:** voci forfettarie pagate senza ore registrate, addizionali assenti, saldi di ferie negativi, voci non riconosciute, giorni lavorati diversi dai buoni pasto se presenti.
8. **Stati:** verde "ok", ambra "da verificare", lavanda "promemoria". Ogni controllo è una frase completa che dice cosa è stato verificato e cosa fare.

## 7. Costo per l'azienda

1. **Solo ciò che sta sopra il lordo:** non ripetere il lordo né voci già mostrate.
2. **Voci:** contributi previdenziali a carico azienda (23,81% per la pensione, stima minima se il cedolino non li riporta), TFR del mese, un rateo per ciascuna mensilità aggiuntiva prevista dal CCNL (13ª sempre, 14ª e altre solo se confermate), quota azienda al fondo pensione, altri contributi c/azienda presenti nel cedolino.
3. **Mensilità aggiuntive:** il rateo vale la retribuzione mensile fissa diviso 12. Prendi le mensilità dalla scheda CCNL; senza scheda includi solo la 13ª e lascia la 14ª come interruttore spento nel pannello "Contratto e fondi". Il costo si ricalcola quando l'utente cambia l'interruttore.
4. **Etichetta di origine:** ogni riga riporta "cedolino" o "stima".
5. **Nota finale:** costo totale stimato, quota netta su 100,00 € spesi dall'azienda, ed elenco di ciò che è escluso (INAIL, contributi di settore e dimensione).

## 8. Struttura della pagina

1. **Barra fissa in alto:** tab "Cedolini", "Calendario" e "Dizionario" a sinistra, due pulsanti occhio a destra. Su telefono i pulsanti occhio mostrano solo l'icona.
2. **Tab "Cedolini":** una fila di sotto-schede scorrevole orizzontalmente. La prima, "Riepilogo", resta fissa a sinistra ed è quella aperta all'avvio; seguono i mesi dal più vecchio al più recente, con etichetta breve ("Set 2026").
3. **Sotto-scheda "Riepilogo":** cinque riquadri.
   - "Mese per mese": tabella con le colonne raggruppate da un'intestazione colorata: "Paga" (lordo, trattenute, netto, netto %) in sabbia, "Calendario" (giorni lavorati, saldo ferie, saldo ROL) in lavanda, poi i controlli. Le celle riprendono i colori del dettaglio del mese: lordo sabbia, trattenute ruggine, netto verderame, calendario lavanda. Toccando una riga si apre quel mese. La tabella scorre orizzontalmente dentro il suo riquadro.
   - "Prossimi stipendi, stima": i 12 mesi dopo l'ultimo cedolino, con giorni lavorabili, lordo, netto e "cosa cambia". Metodo:
     1. Base: lordo e netto dell'ultimo cedolino ordinario.
     2. Somme in più: festività nazionali di domenica e ex festività pagate (stipendio × divisore), 13ª nel suo mese (stipendio × mesi di servizio nel periodo ÷ 12), 14ª se prevista (stesso calcolo sul suo periodo). Patrono di domenica: segnalato, importo "da verificare" salvo regola della scheda.
     3. Netto delle somme in più: importo × (1 − quota di contributi e fondo pensione dell'ultimo cedolino) × (1 − aliquota IRPEF marginale), con aliquota scelta sugli scaglioni in base all'imponibile annuo stimato.
     4. Righe con somme in più in evidenza; in fondo il totale dei 12 mesi.
     5. Nota sul metodo con ciò che non è stimato: conguaglio fiscale di dicembre, addizionali, aumenti contrattuali (che il superminimo assorbibile può annullare), voci variabili.
   - "Variazioni tra mesi": dal secondo cedolino, per ogni voce che cambia rispetto al mese prima, quanto e perché; con un solo mese, una frase che dice quando compariranno.
   - "Da inizio anno": i progressivi dell'ultimo cedolino.
   - "Promemoria aperti": dal registro.
   - "Cedolini mancanti": i mesi dalla data di assunzione all'ultimo cedolino che non sono nel registro.
4. **Sotto-scheda del mese:** titolo del mese con il pulsante "Apri tutto / Chiudi tutto" a destra, poi la struttura descritta ai punti seguenti. Ogni mese è indipendente: niente `id` ripetuti, gli elementi si cercano dentro il contenitore del mese.
5. **Tab "Calendario":** per l'anno dell'ultimo cedolino, un calendario per mese a partire dal mese di assunzione (i giorni prima dell'assunzione restano vuoti). Due mesi per riga su telefono, tre o più su schermi larghi.
   - Colori dei giorni: lavorato (carta con bordo), ferie (salvia), permesso (lavanda), malattia (ruggine), festa nazionale (verderame pieno), patrono (azzurro polvere pieno), fine settimana (solo numero), mese senza cedolino (grigio tratteggiato). Le ex festività hanno un punto ambra, senza riempimento.
   - Ogni mese indica "cedolino" o "senza cedolino".
   - Sotto: "Ferie e permessi ricostruiti", con tre controlli per ferie e tre per permessi: maturato rispetto all'atteso dalla scheda CCNL (ore annue ÷ 12 × mesi di servizio), saldo = anno precedente + maturato − goduto, goduto ripartito tra mesi con cedolino (dai giorni del calendario) e mesi senza cedolino (giorni non noti).
   - Selettore dell'anno per gli anni presenti in `festivita`; i mesi futuri sono marcati "previsione".
   - I giorni del `piano` compaiono con il colore di ferie o permesso e un bordo tratteggiato; nei mesi con cedolino prevale quanto riportato in busta.
   - "Piano ferie e permessi": modulo con data, tipo, ore (8 per le ferie, 1 per i permessi come valore iniziale), motivo facoltativo; elenco delle voci con origine ("foglio" o "tu"); le voci aggiunte dalla pagina si salvano nel browser, si possono eliminare e si copiano con "Copia per il registro".
   - "Saldi mese per mese": dall'assunzione a dicembre dell'anno dopo l'ultimo cedolino, colonne raggruppate "Ferie" e "Permessi ROL" con maturate (ore annue ÷ 12 per mese, cumulate), godute dal piano (cumulate) e saldo in ore e giorni. Righe future in grigio, ultimo cedolino evidenziato.
   - "Controlli su ferie e permessi": maturato e goduto in busta contro scheda e piano (le differenze vanno segnalate, non corrette); per ogni anno fino a quello dell'ultimo cedolino, ROL residui alla scadenza contrattuale e ferie: almeno 2 settimane nell'anno di maturazione, il resto entro i 18 mesi successivi, calcolati consumando prima le ore più vecchie.
   - Infine "Festività [anno]": elenco con giorno della settimana, tipo, e note su domenica, sabato e origine del patrono.
6. **Pulsante "Apri tutto / Chiudi tutto":** piccolo, allineato a destra accanto al titolo del mese. Se almeno una sezione è aperta dice "Chiudi tutto" e le chiude tutte; altrimenti dice "Apri tutto".
7. **Intestazione:** "Le mie buste paga", poi una riga con nome, qualifica, livello, mansione, CCNL, datore, sede, data di assunzione, presi dall'ultimo cedolino.
8. **Riepilogo del mese a fisarmonica:** ogni riga è un elemento `<details>` chiuso all'avvio, colorato a riempimento; aprendolo, il dettaglio compare sotto con lo stesso sfondo. Ordine:
   1. Lordo del mese
   2. Trattenute
   3. Fuori dal lordo (solo se presente)
   4. Netto in busta: unica riga piena, non apribile, seguita dalla barra selezionabile
   5. Il mese in giorni
   6. Costo in più per l'azienda
9. **Sezioni a parte, chiuse all'avvio, colore neutro:** "Contratto e fondi", "Saldi al [ultimo giorno del mese]" (tempo, accantonamenti, progressivi da inizio anno) e "Quadratura".
   - **Contratto e fondi:** elenco dei dati della scheda CCNL usati nella pagina (mensilità, divisore, ferie, permessi, ex festività, ore al giorno) e dei fondi di categoria, ciascuno con etichetta "scheda CCNL", "cedolino" o "indicato da te". Sono modificabili solo i dati che cambiano i calcoli: interruttori per le mensilità aggiuntive, campo numerico per le ore al giorno (aggiorna la conversione ore e giorni dei saldi). Sotto l'elenco, una nota con scadenze e regole in frase completa, così le righe restano corte.
10. **Righe del riepilogo:** etichetta, percentuale o stato, importo, freccia.
11. **Sezioni vuote:** una riga in corsivo nel pannello vicino ("Nessuna voce una tantum questo mese"), nessun riquadro vuoto.
12. **Piede:** cosa non è riportato (codice fiscale, IBAN, indirizzo) e quali valori sono stime.
13. **Tecnica:** un solo file HTML, CSS inline, poco JavaScript per tab e sotto-schede, pulsanti occhio, popover, barra selezionabile, "Apri tutto", ricalcoli del pannello "Contratto e fondi", e per disegnare Riepilogo e Calendario leggendo il registro. Formatta i numeri con una funzione propria (separatore "." anche sulle migliaia a 4 cifre), non con il formato di sistema. Le sezioni a fisarmonica usano `<details>` senza script.

## 9. Colori

Ogni funzione ha una tinta tenue di fondo e un colore di testo più intenso della stessa famiglia. Le famiglie sono distanti tra loro sul cerchio cromatico, così non si confondono. Il netto è l'unico riempimento pieno.

| Funzione | Fondo chiaro | Testo chiaro | Fondo scuro | Testo scuro |
|---|---|---|---|---|
| Lordo (sabbia) | #EFE5CF | #7A6230 | #2D2819 | #DCC694 |
| Trattenute (ruggine) | #F6DFDA | #A3463B | #35221F | #EE9387 |
| Fuori dal lordo (salvia) | #DDEBD6 | #4C7638 | #1D2C19 | #A6CB92 |
| Netto (verderame pieno) | #287D72 | bianco | #2E8A7E | bianco |
| Giorni (lavanda) | #E5E3F4 | #544E92 | #22213C | #B7B2EC |
| Costo azienda (azzurro polvere) | #DCE9F2 | #36617C | #172A38 | #9CC3DD |
| Saldi e quadratura (carta con bordo) | #FCFDFD, bordo #CBD3D2 | #5C6B77 | #16293A, bordo #2C4357 | #95A5B2 |

1. **Sotto-gruppi delle trattenute:** tre toni della stessa ruggine, dal più chiaro al più scuro: previdenza #E2B7A8, fondo pensione #CF8C83, fisco #A3463B. Gli stessi toni si usano nella barra del netto.
2. **Sezioni neutre:** devono distinguersi dal fondo pagina; per questo usano la carta chiara con un bordo sottile invece di un grigio simile al fondo.
3. **Testo nella barra:** su ogni parte scegli testo chiaro o scuro in base al contrasto, separatamente per tema chiaro e scuro (nel tema scuro i toni ruggine si invertono).
4. **Stati dei controlli:** ok #2E7D5B, da verificare #A2701C, promemoria come il testo lavanda.
5. **Fondo pagina e carta:** #E9EDEC e #F9FBFA in chiaro, #0A1620 e #0E1D2A in scuro; testo #0E1D2A e #E9EDEC.
6. **Tema scuro:** obbligatorio, con gli stessi ruoli.

## 10. Tipografia e numeri

1. **Font:** Space Grotesk per il testo, Space Mono per tutti gli importi, allineati a destra e in colonna.
2. **Formato:** separatore delle migliaia ".", decimali ",", sempre due decimali per importi, ore e percentuali. I conteggi di giorni restano interi.
3. **Segni:** "−" davanti a trattenute e riduzioni, "+" davanti a voci aggiunte nel riepilogo, "=" davanti ai risultati di un calcolo.
4. **Punteggiatura:** niente lineetta lunga "—" né puntino "·"; usare " - ".

## 11. Privacy

1. **Pulsante "Dati personali":** oscura nome, datore di lavoro, sede e comune.
2. **Pulsante "Importi":** oscura tutti gli importi in euro; le percentuali restano visibili, così la pagina si può condividere mostrando solo le proporzioni.
3. **Mai nella pagina né nel registro:** codice fiscale, IBAN, indirizzo, matricola, posizioni INPS e INAIL.
4. **Pagina personale:** la pagina contiene il registro dei propri cedolini; va condivisa con attenzione. Gli occhi oscurano la vista, non il registro nel codice.

## 12. Icona "i" e Dizionario

1. **Icona "i":** accanto a ogni voce non ovvia. Apre un popover con titolo e sintesi di una riga, più "Approfondisci", che apre la tab Dizionario sulla voce evidenziata.
2. **Nessuna didascalia sotto le voci:** le spiegazioni vivono solo nel dizionario.
3. **Voce del dizionario:** titolo, sintesi (una frase, è quella mostrata nel popover), spiegazione (due o tre frasi), "Cosa controllare" (una frase).
4. **Gruppi:** Retribuzione, Contributi e imposte, Giorni e permessi, Accantonamenti e costo azienda.
5. **Solo voci presenti:** il dizionario contiene le voci che compaiono nel cedolino più quelle citate nei controlli e nel pannello "Contratto e fondi" (divisore, fondi di categoria, enti bilaterali).

## 13. Verifica finale

1. Tutti i controlli di quadratura passano, oppure le differenze sono mostrate.
2. Nessun dato del punto 11.3 compare nella pagina.
3. Ogni stima è etichettata.
4. Le percentuali di ogni gruppo sommano a 100,00.
5. La pagina funziona a 390 px di larghezza senza scorrimento orizzontale, in tema chiaro e scuro.
6. Ogni "i" apre una voce esistente nel dizionario.
7. Ogni parte della barra apre un dettaglio; "Apri tutto / Chiudi tutto" agisce su tutte le sezioni.
8. Ogni dato contrattuale ha un'etichetta di origine, e cambiando un interruttore i totali si aggiornano.
9. Il registro contiene tutti i mesi precedenti più quello nuovo, senza duplicati; Riepilogo, Cedolini mancanti e Calendario lo riflettono.
10. Le festività dell'anno vengono da `lente-festivita.md` e il patrono ha la sua origine.
11. La previsione degli stipendi spiega ogni mese diverso dall'ordinario e dichiara il metodo.
12. Il piano ferie torna con le ore godute in busta; ogni differenza è segnalata.
