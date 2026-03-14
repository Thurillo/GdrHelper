# ⚔️ GdrHelper VTT (Virtual Tabletop)

GdrHelper è una web application self-hosted progettata su misura per i Dungeon Master. Dispone di strumenti completi per gestire sessioni di gioco di ruolo cartaceo, schede dei personaggi, inventari di gruppo e un compendio consultabile dei manuali, attualmente incentrato su Dungeons & Dragons 5e ma estensibile ad altri sistemi di gioco (sviluppato su stack Next.js, Prisma e Postgres).

---

## 🚀 Guida all'Installazione (Debian 13)

Questa guida illustra tutti i passaggi necessari per preparare un server pulito con **Debian 13** e mettere in esecuzione la propria istanza di GdrHelper.

### 1. Prerequisiti: Aggiornamento Sistema e Tool Base

Accedi al tuo server via SSH (o terminale) ed esegui i seguenti comandi per preparare l'ambiente:

```bash
# Aggiorna i pacchetti di sistema
sudo apt update && sudo apt upgrade -y

# Installa strumenti base (curl, git, build-essential)
sudo apt install curl git build-essential -y
```

### 2. Installazione di Node.js e npm

L'applicazione è basata su Next.js e richiede Node.js. È consigliata la versione LTS.

```bash
# Aggiungi il repository NodeSource per la versione LTS (es. Node 20.x o 22.x)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

# Installa Node.js
sudo apt install nodejs -y

# Verifica l'installazione
node -v
npm -v
```

### 3. Installazione e Configurazione di PostgreSQL

Prisma (l'ORM utilizzato dalla webapp) necessita di un database PostgreSQL.

```bash
# Installa PostgreSQL e i contrib addons
sudo apt install postgresql postgresql-contrib -y

# Lancia il servizio ed assicurati che sia abilitato all'avvio
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Crea un utente e un database per GdrHelper
sudo -u postgres psql -c "CREATE USER gdr_user WITH PASSWORD 'la_tua_password_sicura';"
sudo -u postgres psql -c "CREATE DATABASE gdrhelper OWNER gdr_user;"
```

> **Nota:** Ricorda di sostituire `la_tua_password_sicura` con una vera password!

### 4. Setup e Clonazione dell'Applicazione

Ora recuperiamo i sorgenti di GdrHelper dalla repository GitHub.

```bash
# Clona il repository
git clone https://github.com/Thurillo/GdrHelper.git

# Entra nella directory del progetto
cd GdrHelper

# Installa tutte le dipendenze del progetto
npm install
```

### 5. Configurazione delle Variabili d'Ambiente

Dovrai creare un file `.env` che Prisma e NextAuth leggeranno alla partenza.

```bash
# Copia il file di esempio se l'autore ne ha fornito uno, oppure crealo:
nano .env
```

Inserisci il seguente contenuto all'interno del tuo file `.env`:

```env
# Connessione al DB Postgres creato allo step 3. 
# Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://gdr_user:la_tua_password_sicura@localhost:5432/gdrhelper"

# URL di base dove gira l'app (es. http://il-tuo-ip:3000 o il tuo dominio)
NEXTAUTH_URL="http://localhost:3000"

# Stringa segreta usata per firmare i token jwt (PUOI GENERARNE UNA CON: `openssl rand -base64 32`)
NEXTAUTH_SECRET="la_tua_chiave_segreta_generata_casualmente"
```
*(Premi `CTRL+O`, `Invio` per salvare e `CTRL+X` per uscire da nano)*

### 6. Migrazione Schema e Generazione Prisma

Configura la struttura delle tabelle (Models NextAuth, Users, Campaigns, ecc...) eseguendo i file Prisma:

```bash
# Pusha lo schema nel DB creando le tabelle necessarie
npx prisma db push

# (Opzionale, di solito lo fa in automatico) Genera il client Prisma
npx prisma generate
```

### 7. Avvio in Produzione

Per mantenere l'applicazione stabile ed efficiente per i tuoi giocatori, compila i sorgenti con Next.js e usa un PM (Process Manager) come PM2 (oppure Systemd) per eseguirla in background.

```bash
# Compila il progetto per produrre la build ottimizzata
npm run build
```

Esegui il server:
**Metodo 1: Avvio Manuale Semplice**
```bash
npm start
```

**Metodo 2: (Raccomandato) Avvio con PM2**
```bash
# Installa pm2 globalmente
sudo npm install -g pm2

# Avvia l'applicazione chiamandola "gdrhelper"
pm2 start npm --name "gdrhelper" -- start

# Fai in modo che PM2 ricarichi l'app al riavvio del server
pm2 startup
pm2 save
```

### 8. Accesso all'Applicazione
L'applicazione girerà di default sulla porta `3000`. 
Apri un browser e naviga su `http://indirizzo_ip_del_server:3000`. Verrai ridiretto alla schermata di Login.

---

## 🛠 Comandi Utili (Gestione Successiva)

- **Aggiornare l'applicazione:**
  ```bash
  cd GdrHelper
  git pull origin main
  npm install
  npm run build
  pm2 restart gdrhelper
  ```
- **Visualizzare i log (se usi pm2):**
  ```bash
  pm2 logs gdrhelper
  ```

---
*Progetto MVP sviluppato con Next.js (App Router), Prisma, TailwindCSS v4, Auth.js*
