"""
Seed D&D 5e Races and Subraces into the database.
Data sourced from: Manuale del Giocatore D&D 5e (Italian), pages 18-43.
Run with: python scripts/seed_races.py
"""

import os
import sys
import psycopg2
import uuid
from datetime import datetime

# --- Load DATABASE_URL from .env ---
def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if not os.path.exists(env_path):
        print("File .env non trovato!")
        sys.exit(1)
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ.setdefault(key.strip(), val.strip().strip('"'))

load_env()

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    print("DATABASE_URL non trovato nel file .env")
    sys.exit(1)

# Convert from Prisma URL format to psycopg2 format
# Prisma: postgresql://user:pass@host:port/db
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()
now = datetime.utcnow().isoformat()

# ---------------------------------------------------------------------------
# RACE DATA
# ---------------------------------------------------------------------------
# Each race: (name, description, speed, size, ability_bonuses_json, traits_json)
# Each subrace: (race_name, name, description, additional_bonuses_json, additional_traits_json)

RACES = [
    {
        "name": "Elfo",
        "description": "Gli elfi sono un popolo magico dalla grazia ultraterrena. Vivono in luoghi di bellezza eterea, al centro di foreste millenarie o all'interno di svettanti torri argentate. Gli elfi amano la natura e la magia, l'arte e l'artigianato, la musica e la poesia.",
        "speed": 9,
        "size": "Media",
        "ability_bonuses": '{"destrezza": 2}',
        "traits": '["Scurovisione 18m", "Sensi Acuti (competenza Percezione)", "Retaggio Fatato (vantaggio vs affascinato, immunità al sonno magico)", "Trance (4 ore al posto di 8)"]',
        "subraces": [
            {
                "name": "Elfo Alto",
                "description": "Un elfo alto è dotato di una mente brillante e della padronanza di alcune forme basilari di magia. Si considerano spesso superiori alle altre razze.",
                "additional_bonuses": '{"intelligenza": 1}',
                "additional_traits": '["Addestramento nelle Armi Elfiche (spade corte, spade lunghe, archi corti, archi lunghi)", "Trucchetto aggiuntivo da mago (basato su Intelligenza)", "Linguaggio Extra a scelta"]',
            },
            {
                "name": "Elfo dei Boschi",
                "description": "Un elfo dei boschi è dotato di sensi acuti e di un profondo intuito, nonché di un passo leggero che gli consente di spostarsi velocemente e silenziosamente attraverso le sue foreste natie.",
                "additional_bonuses": '{"saggezza": 1}',
                "additional_traits": '["Addestramento nelle Armi Elfiche (spade corte, spade lunghe, archi corti, archi lunghi)", "Piede Lesto (velocità 10,5m)", "Maschera della Selva (nascondersi in copertura naturale)"]',
            },
            {
                "name": "Elfo Oscuro (Drow)",
                "description": "I drow discendono da un'antica sottorazza di elfi dalla pelle scura che fu esiliata dal mondo di superficie per avere seguito la dea Lolth. Hanno la pelle nera simile all'ossidiana e capelli bianchi.",
                "additional_bonuses": '{"carisma": 1}',
                "additional_traits": '["Scurovisione Superiore 36m", "Sensibilità alla Luce del Sole (svantaggio in piena luce)", "Magia Drow: Luci Danzanti, poi Luminescenza (lv.3), poi Oscurità (lv.5)", "Addestramento nelle Armi Drow (spade corte, stocchi, balestre a mano)"]',
            },
        ],
    },
    {
        "name": "Halfling",
        "description": "I minuscoli halfling riescono a sopravvivere in un mondo popolato da creature più grandi di loro evitando di farsi notare. Sono alti circa 90 cm e hanno un aspetto piuttosto inoffensivo. La maggior parte degli halfling ambisce a godersi le comodità di casa.",
        "speed": 7,
        "size": "Piccola",
        "ability_bonuses": '{"destrezza": 2}',
        "traits": '["Fortunato (ritira i risultati di 1)", "Coraggioso (vantaggio ai TS vs Spaventato)", "Agilità Halfling (può muoversi attraverso creature più grandi)"]',
        "subraces": [
            {
                "name": "Halfling Piedelesto",
                "description": "Un halfling piedelesto è abile nel non farsi notare e può perfino usare le altre persone come copertura. È la varietà più comune, ama viaggiare e spesso dimora presso altre razze.",
                "additional_bonuses": '{"carisma": 1}',
                "additional_traits": '["Furtività Innata (può nascondersi anche se oscurato da una creatura più grande)"]',
            },
            {
                "name": "Halfling Tozzo",
                "description": "Un halfling tozzo è più robusto della media degli halfling e vanta una certa resistenza al veleno. Secondo alcuni avrebbero sangue nanico nelle vene.",
                "additional_bonuses": '{"costituzione": 1}',
                "additional_traits": '["Resilienza del Tozzo (vantaggio TS vs veleno, resistenza ai danni da veleno)"]',
            },
        ],
    },
    {
        "name": "Nano",
        "description": "I nani, creature audaci e tenaci, sono noti per essere abili combattenti, minatori e artigiani della pietra e del metallo. Anche se non superano mai il metro e mezzo di altezza, sono talmente massicci e compatti da pesare quasi quanto gli umani. Sono dediti al clan e alla tradizione.",
        "speed": 7,
        "size": "Media",
        "ability_bonuses": '{"costituzione": 2}',
        "traits": '["Scurovisione 18m", "Resilienza Nanica (vantaggio TS vs veleno, resistenza danni veleno)", "Addestramento Nanico (competenza asce, asce da battaglia, martelli da guerra, martelli leggeri)", "Competenza negli Strumenti (fabbro, mescitore o costruttore)", "Esploratore di Pietra (bonus doppio a Intelligenza/Storia su strutture in pietra)"]',
        "subraces": [
            {
                "name": "Nano delle Colline",
                "description": "Un nano delle colline è dotato di sensi acuti, di una profonda intuizione e di una straordinaria resilienza. I nani dorati sono nani delle colline.",
                "additional_bonuses": '{"saggezza": 1}',
                "additional_traits": '["Robustezza Nanica (+1 HP massimi, e +1 ad ogni livello guadagnato)"]',
            },
            {
                "name": "Nano delle Montagne",
                "description": "Un nano delle montagne è forte e resistente, ed è abituato a condurre una vita difficile in un territorio aspro. In genere è considerato alto per i parametri di un nano.",
                "additional_bonuses": '{"forza": 2}',
                "additional_traits": '["Addestramento nelle Armature Naniche (competenza armature leggere e medie)"]',
            },
        ],
    },
    {
        "name": "Umano",
        "description": "Nella maggior parte dei mondi la razza umana è la più giovane tra le razze comuni, l'ultima arrivata a occupare la scena nel mondo. Gli umani sono la razza più adattabile e ambiziosa, sempre pronta a modificare le loro dinamiche sociali e politiche.",
        "speed": 9,
        "size": "Media",
        "ability_bonuses": '{"forza": 1, "destrezza": 1, "costituzione": 1, "intelligenza": 1, "saggezza": 1, "carisma": 1}',
        "traits": '["Tutti i punteggi di caratteristica aumentano di 1", "Linguaggio Extra a scelta"]',
        "subraces": [],
    },
    {
        "name": "Dragonide",
        "description": "I dragonidi, generati dai draghi, si fanno strada con fierezza in un mondo che li accoglie con titubanza. Sono creature alte e robuste, raggiungendo quasi i 2 metri d'altezza. Per ogni dragonide il clan è più importante della vita stessa.",
        "speed": 9,
        "size": "Media",
        "ability_bonuses": '{"forza": 2, "carisma": 1}',
        "traits": '["Discendenza Draconica (scelta del tipo di drago)", "Arma a Soffio (ogni riposo breve o lungo)", "Resistenza ai Danni (del tipo della discendenza)"]',
        "subraces": [],
    },
    {
        "name": "Gnomo",
        "description": "Un brusio di incessante attività pervade i cunicoli e i quartieri dove gli gnomi formano le loro comunità. Gli gnomi amano la vita e si godono ogni istante dedicato alle invenzioni, all'esplorazione, alle investigazioni, alle creazioni e ai giochi. Vivono dai 350 ai 500 anni.",
        "speed": 7,
        "size": "Piccola",
        "ability_bonuses": '{"intelligenza": 2}',
        "traits": '["Scurovisione 18m", "Astuzia Gnomesca (vantaggio a tutti i TS su Intelligenza, Saggezza e Carisma contro la magia)"]',
        "subraces": [
            {
                "name": "Gnomo delle Foreste",
                "description": "Uno gnomo delle foreste ha una propensione naturale per l'illusione e gode di una rapidità e furtività innata. Formano comunità nascoste nel fitto delle foreste.",
                "additional_bonuses": '{"destrezza": 1}',
                "additional_traits": '["Illusionista Nato (trucchetto illusione minore, basato su Intelligenza)", "Parlare con le Piccole Bestie (comunicazione con bestie Piccole o inferiori)"]',
            },
            {
                "name": "Gnomo delle Rocce",
                "description": "Uno gnomo delle rocce è dotato di una creatività innata e di una resistenza superiore a quella degli altri gnomi. Molti gnomi dei mondi di D&D sono gnomi delle rocce.",
                "additional_bonuses": '{"costituzione": 1}',
                "additional_traits": '["Conoscenze dell\'Artefice (bonus doppio a Intelligenza/Storia su oggetti magici e tecnologici)", "Inventore (costruisce congegni meccanici Minuscoli con strumenti da artigiano)"]',
            },
        ],
    },
    {
        "name": "Mezzelfo",
        "description": "I mezzelfi camminano tra due mondi senza mai appartenere fino in fondo a nessuno di essi. Uniscono la curiosità e l'ambizione degli umani con i sensi raffinati e il senso artistico degli elfi. Vivono spesso più di 180 anni.",
        "speed": 9,
        "size": "Media",
        "ability_bonuses": '{"carisma": 2, "due_a_scelta": 1}',
        "traits": '["Scurovisione 18m", "Retaggio Fatato (vantaggio vs affascinato, immunità al sonno magico)", "Versatilità nelle Abilità (competenza in due abilità a scelta)"]',
        "subraces": [],
    },
    {
        "name": "Mezzorco",
        "description": "I mezzorchi combinano il meglio della forza orchesca con l'astuzia umana. Sono alti dagli 1,8 ai 2,1 metri e pesano tra i 90 e i 125 kg. Hanno la pelle grigiastra, la fronte spiovente e le zanne prominenti del loro retaggio orchesco.",
        "speed": 9,
        "size": "Media",
        "ability_bonuses": '{"forza": 2, "costituzione": 1}',
        "traits": '["Scurovisione 18m", "Minaccioso (competenza in Intimidire)", "Tenacia Implacabile (1 volta per riposo lungo, rimane a 1 PF invece di scendere a 0)", "Attacchi Selvaggi (dado extra ai danni di un colpo critico con arma da mischia)"]',
        "subraces": [],
    },
    {
        "name": "Tiefling",
        "description": "I tiefling portano il segno di un patto infernale stipulato molte generazioni fa. Sfoggiano grandi corna e una robusta coda. I loro occhi sono di un unico colore (nero, rosso, bianco, argento o oro) senza sclera visibile. Non si fidano facilmente, ma sono amici leali.",
        "speed": 9,
        "size": "Media",
        "ability_bonuses": '{"intelligenza": 1, "carisma": 2}',
        "traits": '["Scurovisione 18m", "Resistenza Infernale (resistenza ai danni da fuoco)", "Eredità Infernale: Taumaturgia, poi Intimorire Infernale (lv.3), poi Oscurità (lv.5) - basato su Carisma"]',
        "subraces": [],
    },
]

# ---------------------------------------------------------------------------
# HELPER: upsert a race
# ---------------------------------------------------------------------------
def upsert_race(race):
    cur.execute("SELECT id FROM \"Race\" WHERE name = %s", (race["name"],))
    row = cur.fetchone()
    if row:
        race_id = row[0]
        cur.execute(
            """UPDATE "Race" SET description=%s, speed=%s, size=%s, "abilityBonuses"=%s::jsonb, traits=%s::jsonb, "updatedAt"=%s WHERE id=%s""",
            (race["description"], race["speed"], race["size"], race["ability_bonuses"], race["traits"], now, race_id)
        )
        print(f"  → Aggiornato: {race['name']}")
    else:
        race_id = str(uuid.uuid4())
        cur.execute(
            """INSERT INTO "Race" (id, name, description, speed, size, "abilityBonuses", traits, "createdAt", "updatedAt") VALUES (%s,%s,%s,%s,%s,%s::jsonb,%s::jsonb,%s,%s)""",
            (race_id, race["name"], race["description"], race["speed"], race["size"], race["ability_bonuses"], race["traits"], now, now)
        )
        print(f"  ✓ Inserito: {race['name']}")
    return race_id


def upsert_subrace(race_id, subrace):
    cur.execute("SELECT id FROM \"Subrace\" WHERE \"raceId\" = %s AND name = %s", (race_id, subrace["name"]))
    row = cur.fetchone()
    if row:
        subrace_id = row[0]
        cur.execute(
            """UPDATE "Subrace" SET description=%s, "additionalAbilityBonuses"=%s::jsonb, "additionalTraits"=%s::jsonb, "updatedAt"=%s WHERE id=%s""",
            (subrace["description"], subrace["additional_bonuses"], subrace["additional_traits"], now, subrace_id)
        )
        print(f"     → Aggiornata sottorazza: {subrace['name']}")
    else:
        subrace_id = str(uuid.uuid4())
        cur.execute(
            """INSERT INTO "Subrace" (id, "raceId", name, description, "additionalAbilityBonuses", "additionalTraits", "createdAt", "updatedAt") VALUES (%s,%s,%s,%s,%s::jsonb,%s::jsonb,%s,%s)""",
            (subrace_id, race_id, subrace["name"], subrace["description"], subrace["additional_bonuses"], subrace["additional_traits"], now, now)
        )
        print(f"     ✓ Inserita sottorazza: {subrace['name']}")


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------
print("\n🐉 Seeding Razze D&D 5e nel database...\n")

for race in RACES:
    race_id = upsert_race(race)
    for subrace in race["subraces"]:
        upsert_subrace(race_id, subrace)

conn.commit()
cur.close()
conn.close()

print(f"\n✅ Completato! {len(RACES)} razze inserite/aggiornate.")
total_subraces = sum(len(r["subraces"]) for r in RACES)
print(f"   {total_subraces} sottorazze inserite/aggiornate.\n")
