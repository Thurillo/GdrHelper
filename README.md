# ⚔️ GdrHelper VTT (Virtual Tabletop)

GdrHelper è una web application self-hosted progettata su misura per i Dungeon Master. Dispone di strumenti completi per gestire sessioni di gioco di ruolo cartaceo, schede dei personaggi, inventari di gruppo e un compendio consultabile dei manuali, attualmente incentrato su Dungeons & Dragons 5e ma estensibile ad altri sistemi di gioco (sviluppato su stack Next.js, Prisma e Postgres).

---

## 🚀 Guida all'Installazione (Debian 13 come root)

Questa guida illustra tutti i passaggi necessari per preparare un server pulito con **Debian 13** e mettere in esecuzione la propria istanza di GdrHelper operando con l'**utente root**.

### 1. Prerequisiti: Aggiornamento Sistema e Tool Base

Accedi al tuo server via SSH (o terminale) ed esegui i seguenti comandi per preparare l'ambiente:

```bash
# Aggiorna i pacchetti di sistema
apt update && apt upgrade -y

# Installa strumenti base (curl, nano, git, build-essential)
apt install curl nano git build-essential -y
```

### 2. Installazione di Node.js e npm

L'applicazione è basata su Next.js e richiede Node.js. È consigliata la versione LTS.

```bash
# Aggiungi il repository NodeSource per la versione LTS (es. Node 20.x o 22.x)
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -

# Installa Node.js
apt install nodejs -y

# Verifica l'installazione
node -v
npm -v
```

### 3. Installazione e Configurazione di PostgreSQL

Prisma (l'ORM utilizzato dalla webapp) necessita di un database PostgreSQL.

```bash
# Installa PostgreSQL e i contrib addons
apt install postgresql postgresql-contrib -y

# Lancia il servizio ed assicurati che sia abilitato all'avvio
systemctl start postgresql
systemctl enable postgresql

# Crea un utente e un database per GdrHelper
su - postgres -c "psql -c \"CREATE USER gdr_user WITH PASSWORD 'la_tua_password_sicura';\""
su - postgres -c "psql -c \"CREATE DATABASE gdrhelper OWNER gdr_user;\""
```

> **Nota:** Ricorda di sostituire `la_tua_password_sicura` con una vera password!

### 4. Setup e Clonazione dell'Applicazione

Ora recuperiamo i sorgenti di GdrHelper dalla repository GitHub nella directory root standard per i servizi web:

```bash
# Spostati nella root directory /var/www (o se preferisci resta in /root, questa guida la clonerà in /opt/)
cd /opt

# Clona il repository
git clone https://github.com/Thurillo/GdrHelper.git

# Entra nella directory del progetto
cd GdrHelper

# Installa tutte le dipendenze del progetto
npm install
```

### 5. Configurazione delle Variabili d'Ambiente

Crea un file `.env` che Prisma e NextAuth leggeranno alla partenza:

```bash
# Apri l'editor per creare il file
nano .env
```

Inserisci il seguente contenuto all'interno del tuo file `.env`:

```env
# Connessione al DB Postgres creato allo step 3. 
# Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://gdr_user:la_tua_password_sicura@localhost:5432/gdrhelper"

# URL di base dove gira l'app (es. http://il-tuo-ip:3000 o il tuo dominio)
NEXTAUTH_URL="http://il_tuo_indirizzo_ip_o_dominio:3000"

# Stringa segreta usata per firmare i token jwt
# (Puoi farti generare una chiave sul terminale digitando: openssl rand -base64 32)
NEXTAUTH_SECRET="la_tua_chiave_segreta_generata_casualmente"
```

*(Premi `CTRL+O`, poi `Invio` per salvare e `CTRL+X` per uscire da nano)*

### 6. Migrazione Schema e Generazione Prisma

Configura la struttura delle tabelle (Models di NextAuth, Utenti, Campagne, ecc...) eseguendo i file Prisma:

```bash
# Pusha lo schema nel DB per creare le tabelle
npx prisma db push

# (Opzionale, solitamente eseguito automaticamente) Genera il client Prisma
npx prisma generate
```

### 7. Compilazione e Avvio in Produzione

Per mantenere l'applicazione stabile ed efficiente compila i sorgenti con Next.js e usa un Process Manager (PM) come PM2 per eseguirla in background come demone.

```bash
# Compila il progetto per produrre la build ottimizzata
npm run build
```

Esegui il server:

**Avvio con PM2 (Raccomandato per server in produzione)**
```bash
# Installa pm2 globalmente
npm install -g pm2

# Avvia l'applicazione chiamandola "gdrhelper"
pm2 start npm --name "gdrhelper" -- start

# Crea lo script di autostart per far ripartire pm2 e gdrhelper ad ogni riavvio di Debian
pm2 startup
pm2 save
```

### 8. Creazione Account Amministratore (DM)

Prima di accedere all'interfaccia web, devi creare il tuo account master (con privilegi di admin) tramite riga di comando. Assicurati di trovarti ancora nella directory `/opt/GdrHelper`.

```bash
# Crea l'account Dungeon Master
npm run create-user "Il Tuo Nome" "la_tua_email@dominio.it" "LaTuaPasswordSicura" "ADMIN"
```
*(Sostituisci i campi con i tuoi veri dati, mantenendo le virgolette per sicurezza)*

### 9. Gestione Firewall e Accesso all'Applicazione

Debian potrebbe avere `ufw` o le `iptables` attive. Assicurati che la porta 3000 (o 80/443 se monterai Nginx proxy reverse avanti a NodeJS) sia aperta.

```bash
# Se usi UFW, apri la porta 3000
apt install ufw -y
ufw allow 3000/tcp
ufw allow ssh
ufw enable
```

Apri un browser e naviga su `http://indirizzo_ip_del_server:3000`. Verrai ridiretto alla schermata di Login di GdrHelper!

---

## 🛠 Comandi Utili per la Manutenzione

Trovandosi nella cartella dell'app (`/opt/GdrHelper`):

- **Aggiornare l'applicazione con un nuovo rilascio GitHub:**
  ```bash
  cd /opt/GdrHelper
  git pull origin main
  npm install
  npm run build
  pm2 restart gdrhelper
  ```
- **Visualizzare i log del server web backend:**
  ```bash
  pm2 logs gdrhelper
  ```
- **Accedere al client query del Database Postgres:**
  ```bash
  su - postgres -c "psql"
  # per visualizzare le tabelle: \dt
  # per uscire: \q
  ```

---
*Progetto MVP VTT con Next.js App Router (Reattivo SSR), configurazione Prisma ORM, TailwindCSS v4 Custom Style, sistema modulare di Autenticazione Auth.js e integrazione DB PostgreSQL.*
