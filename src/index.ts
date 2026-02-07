import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Disable prefetch as it is not supported for "Transaction" pool mode
const clientAdmin = postgres(process.env.POSTGRES_URL!, { prepare: false })
export const dbAdmin = drizzle(clientAdmin);

const clientVisitor = postgres(process.env.POSTGRES_URL_NON_POOLING!, { prepare: false })
export const dbPublic = drizzle(clientVisitor);
        