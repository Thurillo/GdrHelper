import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ONE-TIME SEED endpoint — delete after use
// GET /api/seed-races

const RACES_DATA = [
  {
    name: "Elfo",
    description: "Gli elfi sono un popolo magico dalla grazia ultraterrena. Vivono in luoghi di bellezza eterea, al centro di foreste millenarie o all'interno di svettanti torri argentate. Gli elfi amano la natura e la magia, l'arte e l'artigianato, la musica e la poesia. Vivono fino a 750 anni.",
    speed: 9,
    size: "Media",
    abilityBonuses: { destrezza: 2 },
    traits: ["Scurovisione 18m", "Sensi Acuti (competenza Percezione)", "Retaggio Fatato (vantaggio vs affascinato, immunità al sonno magico)", "Trance (riposo di 4 ore equivale a 8 ore)"],
    subraces: [
      {
        name: "Elfo Alto",
        description: "Un elfo alto è dotato di una mente brillante e della padronanza di alcune forme basilari di magia. Si considerano spesso superiori alle altre razze.",
        additionalAbilityBonuses: { intelligenza: 1 },
        additionalTraits: ["Addestramento nelle Armi Elfiche (spade corte/lunghe, archi corti/lunghi)", "Trucchetto da mago aggiuntivo (Intelligenza)", "Linguaggio Extra a scelta"],
      },
      {
        name: "Elfo dei Boschi",
        description: "Un elfo dei boschi è dotato di sensi acuti e di un profondo intuito, nonché di un passo leggero che gli consente di spostarsi velocemente nelle foreste natie.",
        additionalAbilityBonuses: { saggezza: 1 },
        additionalTraits: ["Addestramento nelle Armi Elfiche (spade corte/lunghe, archi corti/lunghi)", "Piede Lesto (velocità 10,5m)", "Maschera della Selva (nascondersi in copertura naturale)"],
      },
      {
        name: "Elfo Oscuro (Drow)",
        description: "I drow discendono da un'antica sottorazza di elfi dalla pelle scura esiliata per aver seguito la dea Lolth. Hanno la pelle nera simile all'ossidiana e capelli bianchi.",
        additionalAbilityBonuses: { carisma: 1 },
        additionalTraits: ["Scurovisione Superiore 36m", "Sensibilità alla Luce del Sole (svantaggio in piena luce)", "Magia Drow: Luci Danzanti / Luminescenza (lv.3) / Oscurità (lv.5)", "Addestramento nelle Armi Drow (spade corte, stocchi, balestre a mano)"],
      },
    ],
  },
  {
    name: "Halfling",
    description: "I minuscoli halfling riescono a sopravvivere in un mondo popolato da creature più grandi evitando di farsi notare. Sono alti circa 90 cm, di natura gentile e gioiosa. Vivono circa fino al secondo secolo.",
    speed: 7,
    size: "Piccola",
    abilityBonuses: { destrezza: 2 },
    traits: ["Fortunato (ritira i risultati di 1)", "Coraggioso (vantaggio ai TS vs Spaventato)", "Agilità Halfling (può muoversi attraverso creature più grandi)"],
    subraces: [
      {
        name: "Halfling Piedelesto",
        description: "Un halfling piedelesto è abile nel non farsi notare e può usare le altre persone come copertura. È la varietà più comune e ama viaggiare.",
        additionalAbilityBonuses: { carisma: 1 },
        additionalTraits: ["Furtività Innata (può nascondersi se oscurato da una creatura più grande)"],
      },
      {
        name: "Halfling Tozzo",
        description: "Un halfling tozzo è più robusto della media e vanta resistenza al veleno. Secondo alcuni avrebbero sangue nanico nelle vene. Nelle regioni meridionali sono chiamati Cuoreforte.",
        additionalAbilityBonuses: { costituzione: 1 },
        additionalTraits: ["Resilienza del Tozzo (vantaggio TS vs veleno, resistenza ai danni da veleno)"],
      },
    ],
  },
  {
    name: "Nano",
    description: "I nani sono creature audaci e tenaci, note per essere abili combattenti, minatori e artigiani della pietra e del metallo. Anche se non superano il metro e mezzo, sono massicci e compatti. Vivono in media 350 anni.",
    speed: 7,
    size: "Media",
    abilityBonuses: { costituzione: 2 },
    traits: ["Scurovisione 18m", "Resilienza Nanica (vantaggio TS vs veleno e resistenza ai danni da veleno)", "Addestramento Nanico (competenza asce, asce da battaglia, martelli da guerra, martelli leggeri)", "Competenza negli Strumenti (fabbro, mescitore o costruttore)", "Esploratore di Pietra (bonus doppio a Intelligenza/Storia su strutture in pietra)"],
    subraces: [
      {
        name: "Nano delle Colline",
        description: "Un nano delle colline è dotato di sensi acuti, profonda intuizione e straordinaria resilienza. I nani dorati del FaerOn meridionale sono nani delle colline.",
        additionalAbilityBonuses: { saggezza: 1 },
        additionalTraits: ["Robustezza Nanica (+1 HP massimi al livello 1, +1 ad ogni livello successivo)"],
      },
      {
        name: "Nano delle Montagne",
        description: "Un nano delle montagne è forte e resistente, abituato a una vita difficile in territorio aspro. I nani degli scudi del FaerOn settentrionale sono nani delle montagne.",
        additionalAbilityBonuses: { forza: 2 },
        additionalTraits: ["Addestramento nelle Armature Naniche (competenza armature leggere e medie)"],
      },
    ],
  },
  {
    name: "Umano",
    description: "La razza umana è la più giovane e adattabile tra le razze comuni. Gli umani presentano la maggiore varietà di gusti, credenze e usanze. Raggiungono la maturità intorno ai 20 anni e raramente vivono più di un secolo.",
    speed: 9,
    size: "Media",
    abilityBonuses: { forza: 1, destrezza: 1, costituzione: 1, intelligenza: 1, saggezza: 1, carisma: 1 },
    traits: ["Tutti i punteggi di caratteristica aumentano di 1", "Linguaggio Extra a scelta"],
    subraces: [],
  },
  {
    name: "Dragonide",
    description: "I dragonidi, generati dai draghi, si fanno strada con fierezza. Sono creature alte e robuste (quasi 2 metri), con scaglie colorate e artigli simili a rapaci. Per ogni dragonide il clan è più importante della vita stessa. Vivono fino a 80 anni.",
    speed: 9,
    size: "Media",
    abilityBonuses: { forza: 2, carisma: 1 },
    traits: ["Discendenza Draconica (scelta del tipo di drago: arma a soffio e resistenza ai danni corrispondenti)", "Arma a Soffio (1 volta per riposo breve o lungo — 2d6 danni, poi 3d6 al 6°, 4d6 all'11°, 5d6 al 16°)", "Resistenza ai Danni (del tipo della propria discendenza)"],
    subraces: [],
  },
  {
    name: "Gnomo",
    description: "Un brusio di incessante attività pervade i cunicoli dove gli gnomi vivono. Sono in media poco più alti di 90 cm e amano la vita dedicandosi a invenzioni, esplorazione e giochi. Vivono dai 350 ai 500 anni.",
    speed: 7,
    size: "Piccola",
    abilityBonuses: { intelligenza: 2 },
    traits: ["Scurovisione 18m", "Astuzia Gnomesca (vantaggio a tutti i TS su Intelligenza, Saggezza e Carisma contro la magia)"],
    subraces: [
      {
        name: "Gnomo delle Foreste",
        description: "Uno gnomo delle foreste ha una propensione naturale per l'illusione e una furtività innata. Formano comunità nascoste nel fitto delle foreste usando illusioni e inganni.",
        additionalAbilityBonuses: { destrezza: 1 },
        additionalTraits: ["Illusionista Nato (trucchetto Illusione Minore, basato su Intelligenza)", "Parlare con le Piccole Bestie (comunicazione con bestie di taglia Piccola o inferiore)"],
      },
      {
        name: "Gnomo delle Rocce",
        description: "Uno gnomo delle rocce è dotato di creatività innata e resistenza superiore. Molti gnomi dei mondi di D&D sono gnomi delle rocce, inclusi gli gnomi inventori di Dragonlance.",
        additionalAbilityBonuses: { costituzione: 1 },
        additionalTraits: ["Conoscenze dell'Artefice (bonus doppio a Intelligenza/Storia su oggetti magici e tecnologici)", "Inventore (costruisce congegni meccanici Minuscoli con strumenti da artigiano, max 3 attivi)"],
      },
    ],
  },
  {
    name: "Mezzelfo",
    description: "I mezzelfi camminano tra due mondi senza mai appartenere del tutto a nessuno dei due. Uniscono la curiosità e l'ambizione umana ai sensi raffinati e al senso artistico elfico. Vivono spesso più di 180 anni.",
    speed: 9,
    size: "Media",
    abilityBonuses: { carisma: 2, due_caratteristiche_a_scelta: 1 },
    traits: ["Scurovisione 18m", "Retaggio Fatato (vantaggio vs affascinato, immunità al sonno magico)", "Versatilità nelle Abilità (competenza in due abilità a scelta)"],
    subraces: [],
  },
  {
    name: "Mezzorco",
    description: "I mezzorchi hanno dagli 1,8 ai 2,1 metri e pesano tra 90 e 125 kg. Hanno la pelle grigiastra, la fronte spiovente e le zanne prominenti del retaggio orchesco, ma l'astuzia e l'ambizione umane. Raramente vivono più di 75 anni.",
    speed: 9,
    size: "Media",
    abilityBonuses: { forza: 2, costituzione: 1 },
    traits: ["Scurovisione 18m", "Minaccioso (competenza nell'abilità Intimidire)", "Tenacia Implacabile (1 volta per riposo lungo: rimane a 1 PF invece di scendere a 0)", "Attacchi Selvaggi (dado extra ai danni di un colpo critico con arma da mischia)"],
    subraces: [],
  },
  {
    name: "Tiefling",
    description: "I tiefling portano il segno di un antico patto infernale. Sfoggiano grandi corna, una robusta coda e occhi di un unico colore. Non si fidano facilmente, ma sono alleati fidatissimi con chi guadagna la loro lealtà.",
    speed: 9,
    size: "Media",
    abilityBonuses: { intelligenza: 1, carisma: 2 },
    traits: ["Scurovisione 18m", "Resistenza Infernale (resistenza ai danni da fuoco)", "Eredità Infernale: Taumaturgia / Intimorire Infernale 2° lv (lv.3) / Oscurità (lv.5) — basato su Carisma"],
    subraces: [],
  },
];

export async function GET() {
  try {
    let racesCreated = 0;
    let subracesCreated = 0;

    for (const raceData of RACES_DATA) {
      const { subraces, ...raceFields } = raceData;
      
      const race = await prisma.race.upsert({
        where: { name: raceFields.name },
        update: {
          description: raceFields.description,
          speed: raceFields.speed,
          size: raceFields.size,
          abilityBonuses: raceFields.abilityBonuses,
          traits: raceFields.traits,
        },
        create: {
          name: raceFields.name,
          description: raceFields.description,
          speed: raceFields.speed,
          size: raceFields.size,
          abilityBonuses: raceFields.abilityBonuses,
          traits: raceFields.traits,
        },
      });
      racesCreated++;

      for (const subraceData of subraces) {
        // Delete existing subrace with same name + raceId and recreate
        await prisma.subrace.upsert({
          where: {
            // We don't have a unique constraint on name+raceId in the schema,
            // so we use findFirst + update or create
            id: (await prisma.subrace.findFirst({ where: { name: subraceData.name, raceId: race.id } }))?.id || "new",
          },
          update: {
            description: subraceData.description,
            additionalAbilityBonuses: subraceData.additionalAbilityBonuses,
            additionalTraits: subraceData.additionalTraits,
          },
          create: {
            raceId: race.id,
            name: subraceData.name,
            description: subraceData.description,
            additionalAbilityBonuses: subraceData.additionalAbilityBonuses,
            additionalTraits: subraceData.additionalTraits,
          },
        });
        subracesCreated++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${racesCreated} razze e ${subracesCreated} sottorazze nel database.`,
      races: RACES_DATA.map(r => r.name),
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
