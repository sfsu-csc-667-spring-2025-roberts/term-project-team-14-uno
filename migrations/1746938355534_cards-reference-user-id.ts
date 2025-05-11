import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Ensure user_id is unique
  pgm.addConstraint("players", "players_user_id_unique", {
    unique: ["user_id"],
  });

  // Drop old owner_id column
  pgm.dropColumn("game_cards", "owner_id");

  // Add new owner_id column referencing players.user_id
  pgm.addColumn("game_cards", {
    owner_id: {
      type: "integer",
      references: "players(user_id)",
      onDelete: "CASCADE",
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Drop game_cards.owner_id
  pgm.dropColumn("game_cards", "owner_id");

  // Drop uniqueness constraint
  pgm.dropConstraint("players", "players_user_id_unique");

  // Optionally recreate old owner_id column
  pgm.addColumn("game_cards", {
    owner_id: {
      type: "text",
      notNull: false,
      references: "players(id)",
      onDelete: "CASCADE",
    },
  });
}
