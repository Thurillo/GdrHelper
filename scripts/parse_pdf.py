import fitz # PyMuPDF
import os

pdf_path = os.path.join(os.getcwd(), "doc", "DeD_5e_manuale-del-giocatore.pdf")

print("Leggendo il PDF con PyMuPDF...")
try:
    doc = fitz.open(pdf_path)
    print(f"PDF letto con successo! Numero di pagine: {len(doc)}")
    
    text = ""
    # Extract first 50 pages to be safe and find Races (Capitolo 2)
    for i in range(min(50, len(doc))):
        text += doc[i].get_text()
        
    with open("tmp-pdf-start.txt", "w", encoding="utf-8") as f:
        f.write(text[:100000])
        
    print("Ho salvato un estratto in tmp-pdf-start.txt")
    
    search_terms = ["Tratti dei Nani", "Tratti degli Elfi", "Nano", "Elfo"]
    for term in search_terms:
        idx = text.find(term)
        if idx != -1:
            print(f'Trovato "{term}" all\'indice {idx}')
            
except Exception as e:
    print(f"Errore durante il parsing: {e}")
