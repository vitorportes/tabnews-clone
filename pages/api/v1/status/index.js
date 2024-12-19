import database from "infra/database.js";
import { userAgent } from "next/server";

async function status(request, response) {
  const updatedAt = new Date();
  const result = await database.query(`
  SELECT 
      version() AS postgres_version,
      (SELECT setting FROM pg_settings WHERE name = 'max_connections') AS max_connections,
      (SELECT COUNT(*) FROM pg_stat_activity) AS used_connections
  `);
  const { postgres_version, max_connections, used_connections } =
    result.rows[0];

  response.status(200).json({
    updated_at: updatedAt,
    postgres_version: postgres_version,
    max_connections: max_connections,
    used_connections: used_connections,
  });
}

export default status;
