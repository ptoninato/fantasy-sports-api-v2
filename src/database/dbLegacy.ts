import { Client } from 'pg'
 
const client = new Client({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT),
  database: process.env.PGDATABASELegacy,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})

export default client;