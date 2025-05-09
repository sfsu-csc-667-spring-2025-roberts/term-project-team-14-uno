import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("games", {
    game_id: {
      type: "text",
      primaryKey: true,
    },
    state: {
      type: "text",
      notNull: true,
    },
    turn: {
      type: "integer",
      notNull: true,
    },
    turn_increment: {
      type: "integer",
      notNull: true,
    },
    num_players: {
      type: "integer",
      notNull: true,
    },
    // top_card_id is intentionally left out here (create game_cards first)
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("games");
}
