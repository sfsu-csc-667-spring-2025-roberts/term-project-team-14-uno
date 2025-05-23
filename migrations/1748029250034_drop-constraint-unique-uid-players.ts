import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Drop FK that depends on players.user_id
  pgm.dropConstraint("game_cards", "game_cards_owner_id_fkey");

  // Change owner_id column to match players.id type (text)
  pgm.alterColumn("game_cards", "owner_id", {
    type: "text",
    using: "owner_id::text",
  });

  // Add proper uniqueness constraint for per-game user participation
  pgm.addConstraint("players", "players_game_user_unique", {
    unique: ["game_id", "user_id"],
  });

  // Add correct FK: game_cards.owner_id → players.id
  pgm.addConstraint("game_cards", "game_cards_owner_id_fkey", {
    foreignKeys: {
      columns: ["owner_id"],
      references: "players(id)",
      onDelete: "CASCADE",
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Drop FK and new uniqueness constraint
  pgm.dropConstraint("game_cards", "game_cards_owner_id_fkey");
  pgm.dropConstraint("players", "players_game_user_unique");

  // Revert owner_id column to integer (assuming original type)
  pgm.alterColumn("game_cards", "owner_id", {
    type: "integer",
    using: "owner_id::integer",
  });

  // Re-add FK to players.user_id
  pgm.addConstraint("game_cards", "game_cards_owner_id_fkey", {
    foreignKeys: {
      columns: ["owner_id"],
      references: "players(user_id)",
      onDelete: "CASCADE",
    },
  });
}
