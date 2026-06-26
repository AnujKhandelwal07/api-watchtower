import "dotenv/config";
import { defineConfig } from "prisma/config";

const isMigrationCommand = process.argv.some((arg) =>
  arg.includes("migrate")
);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: isMigrationCommand
      ? process.env.DIRECT_URL
      : process.env.DATABASE_URL,
  },
});
