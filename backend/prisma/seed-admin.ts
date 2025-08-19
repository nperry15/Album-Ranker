import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "changeme123";

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log("Admin already exists:", email);
        return;
    }

    const hash = await bcrypt.hash(password, 12);
    const admin = await prisma.user.create({
        data: { email, passwordHash: hash, role: Role.admin },
    });
    console.log("Created admin:", admin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });