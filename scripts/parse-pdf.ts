import fs from "fs";
import * as pdf from "pdf-parse";
import path from "path";

async function parsePdf() {
  console.log("Leggendo il PDF...");
  const dataBuffer = fs.readFileSync(path.join(process.cwd(), "doc", "DeD_5e_manuale-del-giocatore.pdf"));

  try {
    const data = await pdf(dataBuffer);
    console.log(`PDF letto con successo! Numero di pagine: ${data.numpages}`);
    
    // Il testo estratto è in data.text
    // Cerchiamo l'indice o la sezione delle Razze (Capitolo 2)
    const text = data.text;
    
    // Salviamo uno scorcio di testo su file per analizzarlo e capire come fare il match
    // Salviamo solo i primi 50.000 caratteri in un file temporaneo per sbirciarlo
    fs.writeFileSync("tmp-pdf-start.txt", text.substring(0, 50000));
    console.log("Ho salvato un estratto in tmp-pdf-start.txt");

    // Cerchiamo le occorrenze di razze comuni per trovare le pagine corrette
    const searchTerms = ["Nani", "Elfi", "Halfling", "Umani"];
    searchTerms.forEach(term => {
      const index = text.indexOf(term);
      if (index !== -1) {
        console.log(`Trovato "${term}" all'indice ${index}`);
      }
    });

  } catch (error) {
    console.error("Errore durante il parsing del PDF:", error);
  }
}

parsePdf();
