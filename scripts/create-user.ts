import prisma from "../src/lib/prisma.js";
import { hash } from "bcryptjs";
import * as crypto from "crypto";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("Uso: npm run create-user <nome> <email> <password> [ruolo: ADMIN|USER]");
    process.exit(1);
  }

  const [name, email, password, roleArg] = args;
  const role = roleArg === "USER" ? "USER" : "ADMIN"; // Default to ADMIN if creating via CLI

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.error(`Errore: l'utente con email ${email} esiste già.`);
      process.exit(1);
    }

    const passwordHash = await hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
    });

    console.log(`✅ Utente creato con successo!`);
    console.log(`Nome:  ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Ruolo: ${user.role}`);
  } catch (error) {
    console.error("Errore durante la creazione dell'utente:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
