import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Drop existing UNIQUE constraint if it exists on user_id
  pgm.dropConstraint("sockets", "sockets_user_id_key", { ifExists: true });

  // Add new UNIQUE constraint on (user_id, game_id)
  pgm.addConstraint("sockets", "unique_user_game_combo", {
    unique: ["user_id", "game_id"],
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Revert back: drop the composite and add single user_id unique again
  pgm.dropConstraint("sockets", "unique_user_game_combo");

  pgm.addConstraint("sockets", "sockets_user_id_key", {
    unique: ["user_id"],
  });
}
