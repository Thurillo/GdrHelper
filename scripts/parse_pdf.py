import os
import sys

try:
    from pypdf import PdfReader
except ImportError:
    os.system("pip install pypdf")
    from pypdf import PdfReader

def extract_pdf():
    pdf_path = os.path.join("doc", "DeD_5e_manuale-del-giocatore.pdf")
    if not os.path.exists(pdf_path):
        print(f"File non trovato: {pdf_path}")
        return

    print(f"Apertura di {pdf_path}...")
    reader = PdfReader(pdf_path)
    print(f"Pagine totali: {len(reader.pages)}")
    
    # Extract only from page 18 to 43 (0-indexed so 17 to 42)
    start_page = max(0, 18 - 1)
    end_page = min(len(reader.pages), 43)
    
    text = ""
    for i in range(start_page, end_page):
        page = reader.pages[i]
        text += f"\n--- PAGINA {i + 1} ---\n"
        text += page.extract_text()
        
    with open("tmp-races-classes.txt", "w", encoding="utf-8") as f:
        f.write(text)
        
    print(f"Estratte {end_page - start_page} pagine. Testo salvato in tmp-races-classes.txt")

if __name__ == "__main__":
    extract_pdf()
