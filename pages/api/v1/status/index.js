import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date();

  const postgresVersionResult = await database.query("SHOW server_version");
  const postgresVersionValue = postgresVersionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections");
  const maxConnectionsValue = parseInt(
    maxConnectionsResult.rows[0].max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;
  const usedConnectionsResult = await database.query({
    text: "SELECT count(*) FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });
  const usedConnectionsValue = parseInt(usedConnectionsResult.rows[0].count);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        postgres_version: postgresVersionValue,
        max_connections: maxConnectionsValue,
        used_connections: usedConnectionsValue,
      },
    },
  });
}

export default status;
