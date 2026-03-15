import fs from "fs";
import pdf from "pdf-parse";
import path from "path";

async function parsePdf() {
  console.log("Leggendo il PDF...");
  const dataBuffer = fs.readFileSync(path.join(process.cwd(), "doc", "DeD_5e_manuale-del-giocatore.pdf"));

  try {
    const data = await pdf(dataBuffer, {
      max: 43 - 18 + 1, // Number of pages to read
      // pdf-parse doesn't natively support "start from page X" easily via options,
      // it reads all or max pages. But we can read all and split by `\n\n\n` or page breaks.
    });
    
    // Quick workaround to read the text and grab pages 18-43 roughly
    console.log(`PDF letto con successo. Caratteri totali: ${data.text.length}`);
    
    // Save the whole text roughly to a tmp file so we can inspect it and write a regex for it
    fs.writeFileSync("tmp-pdf-all.txt", data.text);
    console.log("Testo completo salvato in tmp-pdf-all.txt");
  } catch (error) {
    console.error("Errore durante il parsing del PDF:", error);
  }
}

parsePdf();
