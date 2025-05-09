import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("sockets", {
    socket_id: {
      type: "text",
      primaryKey: true,
    },
    player_id: {
      type: "text",
      notNull: true,
      references: "players",
      onDelete: "CASCADE",
    },
    game_id: {
      type: "text",
      notNull: true,
      references: "games",
      onDelete: "CASCADE",
    },
  });

  // Optional: Index for quick lookups by player or game
  pgm.createIndex("sockets", ["player_id"]);
  pgm.createIndex("sockets", ["game_id"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("sockets");
}
