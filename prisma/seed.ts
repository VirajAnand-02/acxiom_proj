import bcrypt from "bcrypt";
import { MembershipDuration, MembershipStatus, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

async function main() {
  const users = [
    { name: "Admin User", email: "admin@example.com", password: "AdminPass1!", role: Role.ADMIN },
    { name: "Standard User", email: "user@example.com", password: "UserPass1!", role: Role.USER },
    { name: "Vendor User", email: "vendor@example.com", password: "VendorPass1!", role: Role.VENDOR }
  ];

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, passwordHash, role: user.role },
      create: { name: user.name, email: user.email, passwordHash, role: user.role }
    });
  }

  const vendor = await prisma.user.findUnique({ where: { email: "vendor@example.com" } });
  if (!vendor) {
    throw new Error("Vendor seed user missing");
  }

  const startDate = new Date();
  const endDate = addMonths(startDate, 6);

  await prisma.membership.upsert({
    where: { membershipNumber: "MEM-0001" },
    update: {
      vendorId: vendor.id,
      startDate,
      endDate,
      duration: MembershipDuration.SIX_MONTHS,
      status: MembershipStatus.ACTIVE
    },
    create: {
      membershipNumber: "MEM-0001",
      vendorId: vendor.id,
      startDate,
      endDate,
      duration: MembershipDuration.SIX_MONTHS,
      status: MembershipStatus.ACTIVE
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
