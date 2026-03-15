# VTT Development Tasks (Scale Up Phase)

## 1. Database Integration (Server Actions)
- [x] Implement Server Actions for **Campaigns** (CRUD).
- [x] Connect `/dashboard/campaigns` UI to the DB.
- [x] Implement Server Actions for **Characters** (CRUD + Stats update).
- [x] Connect `/dashboard/characters` UI to the DB.
- [x] Implement Server Actions for **Inventory** (CRUD + Equipment slots).
- [x] Connect `/dashboard/inventory` UI to the DB.
- [x] Implement Server Actions for **Compendium** (Search/Pagination).
- [x] Connect `/dashboard/compendium` UI to the DB.

## 2. Real-time Synchronization (WebSockets)
- [x] Setup a WebSocket server integrated with Next.js.
- [x] Implement WebSocket connection on the client side (Dashboard layout).
- [x] Broadcast real-time **Dice Rolls** to all clients in a campaign.
- [x] Update Character HP/Stats in real-time.

## 3. Maps & Loot Modules
- [/] Develop the `/dashboard/maps` interface.
- [ ] Add drag-and-drop Token functionality to Maps.
- [ ] Broadcast Token movements via WebSockets.
- [ ] Develop the `/dashboard/loot` interface for generating/assigning items.

## 4. PDF Parsing & Compendium Population
- [ ] Review `scripts/parse_pdf.py` or `scripts/parse-pdf.ts`.
- [x] Estrarre razze e classi dal PDF (pagine 18-43)
[x] Definire i modelli Race e Subrace nel Prisma schema
[x] Creare lo script di seeding (/api/seed-races)
[/] Risolvere problemi di deploy sul server LAN (192.168.1.37)
    [/] Risolvere conflitto su package-lock.json
    [/] Configurare accesso SSH automatico
[/] Popolare il database con i dati estratti
[ ] Aggiornare la UI di creazione personaggio con dati reali
- [ ] Integrate parser logic to insert extracted Spells/Rules into the `Manual` and `ManualEntry` tables.
- [ ] Provide an admin UI to trigger the parser.
