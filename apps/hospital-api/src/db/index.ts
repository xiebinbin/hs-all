import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as auth from "./schemas/auth";
import * as hospital from "./schemas/hospital";
import * as doctor from "./schemas/doctor";
import * as schedule from "./schemas/schedule";
import * as appointment from "./schemas/appointment";
import * as patient from "./schemas/patient";
import * as statistics from "./schemas/statistics";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({ client: pool }, { 
  schema: { 
    ...auth, 
    ...hospital, 
    ...doctor, 
    ...schedule, 
    ...appointment, 
    ...patient, 
    ...statistics 
  } 
});

// 导出所有表和枚举类型
export * from "./schemas/auth";
export * from "./schemas/enums";
export * from "./schemas/hospital";
export * from "./schemas/doctor";
export * from "./schemas/schedule";
export * from "./schemas/appointment";
export * from "./schemas/patient";
export * from "./schemas/statistics";