import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { users } from './db/schema'

const connectionString: string = process.env.POSTGRES_URL!

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client);
        