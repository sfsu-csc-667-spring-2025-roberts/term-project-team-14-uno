import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("game_cards", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    game_id: {
      type: "text",
      notNull: true,
      references: "games",
      onDelete: "CASCADE",
    },
    value: {
      type: "integer",
      notNull: true,
    },
    img: {
      type: "text",
      notNull: true,
    },
    color: {
      type: "text",
      notNull: true,
      check: "color IN ('BLUE', 'RED', 'YELLOW', 'GREEN')",
    },
    type: {
      type: "text",
      notNull: true,
      check: "type IN ('REGULAR', 'REVERSE', 'SKIP', 'DRAW', 'WILD')",
    },
    location: {
      type: "text",
      notNull: true,
      check: "location IN ('deck', 'hand', 'discard')",
    },
    position: {
      type: "integer",
      notNull: false,
    },
    // owner_id is intentionally left out here (create players first)
  });

  pgm.createIndex("game_cards", ["game_id", "location"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("game_cards");
}
