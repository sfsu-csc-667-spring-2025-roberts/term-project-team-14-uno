import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("players", {
    id: {
      type: "text",
      primaryKey: true,
    },
    game_id: {
      type: "text",
      notNull: true,
      references: "games",
      onDelete: "CASCADE",
    },
    player_index: {
      type: "integer",
      notNull: true,
    },
  });

  // Optional performance index if you frequently query by game
  pgm.createIndex("players", ["game_id"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("players");
}
