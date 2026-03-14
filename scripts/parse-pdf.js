import fs from "fs";
import pdfPkg from "pdf-parse/lib/pdf-parse.js";
import path from "path";
import { fileURLToPath } from "url";

const pdf = pdfPkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function parsePdf() {
  console.log("Leggendo il PDF...");
  const dataBuffer = fs.readFileSync(path.join(process.cwd(), "doc", "DeD_5e_manuale-del-giocatore.pdf"));

  try {
    const data = await pdf(dataBuffer);
    console.log(`PDF letto con successo! Numero di pagine: ${data.numpages}`);
    
    const text = data.text;
    
    // Salviamo uno scorcio di testo su file per analizzarlo e capire come fare il match
    fs.writeFileSync("tmp-pdf-start.txt", text.substring(0, 100000));
    console.log("Ho salvato un estratto in tmp-pdf-start.txt");

    // Cerchiamo le occorrenze di razze comuni per trovare le pagine corrette
    const searchTerms = ["Tratti dei Nani", "Tratti degli Elfi"];
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
