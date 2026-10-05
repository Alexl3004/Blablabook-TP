import { Sequelize } from "sequelize";
import pg from "pg";

// Neon / Supabase (Vercel) : DB_URL, ou POSTGRES_URL si l'intégration Supabase est utilisée
const url = process.env.DB_URL ?? process.env.POSTGRES_URL;

// SSL activé seulement pour une base distante (pas en local avec Docker)
const useSsl =
  process.env.DB_SSL === "true" || url?.includes("sslmode=require");

export const sequelize = new Sequelize(url, {
  dialect: "postgres",
  dialectModule: pg, // indispensable sur Vercel : embarque bien le module pg
  logging: false,
  dialectOptions: useSsl
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  pool: { max: 5, min: 0, idle: 10000, acquire: 30000 },
  define: {
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
});