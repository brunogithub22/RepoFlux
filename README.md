# Portfolio Digitale — Progetti Software ed Elettronica

Documento di presentazione del progetto: un portfolio digitale per
raccogliere e mostrare progetti di software ed elettronica, con un pannello
admin per organizzare il lavoro.

## Idea del progetto

Il progetto nasce come portfolio digitale personale dedicato a due ambiti:

- **Progetti software**: applicazioni, script, siti, strumenti sviluppati.
- **Progetti di elettronica**: circuiti, prototipi, schede, esperimenti hardware.

Ogni progetto viene presentato con descrizione, immagini e dettagli tecnici,
in modo da avere una vetrina unica e organizzata per entrambe le discipline.

## Stack tecnologico

- **Next.js** — framework per il sito, sia per le pagine pubbliche del
  portfolio sia per il pannello di amministrazione.
- **Supabase** — database del progetto: memorizza i progetti, le categorie
  (software / elettronica), i testi descrittivi e i metadati.
- **Cloudinary** — storage e gestione delle immagini: ogni progetto può avere
  una o più foto/render caricate e ottimizzate automaticamente, senza
  appesantire il server con i file.

## Pannello admin

Il pannello admin è il cuore organizzativo del progetto: permette di gestire
tutto il lavoro senza toccare codice.

- Creazione, modifica ed eliminazione dei progetti mostrati nel portfolio.
- Caricamento delle immagini di ciascun progetto direttamente su Cloudinary.
- Organizzazione dei progetti per categoria (software / elettronica) e per
  stato di avanzamento (es. in corso, completato, archiviato).
- Salvataggio di tutti i dati su Supabase, così il portfolio pubblico si
  aggiorna automaticamente non appena un progetto viene pubblicato.

## Obiettivo finale

Avere un unico spazio digitale dove organizzare, aggiornare e presentare in
modo professionale sia i progetti software che quelli di elettronica,
gestendo tutto comodamente dal pannello admin.