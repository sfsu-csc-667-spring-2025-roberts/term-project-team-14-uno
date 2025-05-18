import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Drop old constraint if present
  pgm.dropConstraint("sockets", "unique_user_id", { ifExists: true });

  // Drop composite constraint first if already exists (avoids crash)
  pgm.dropConstraint("sockets", "unique_user_game_combo", { ifExists: true });

  // Re-add composite constraint safely
  pgm.addConstraint("sockets", "unique_user_game_combo", {
    unique: ["user_id", "game_id"],
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Revert: drop composite and restore old unique constraint
  pgm.dropConstraint("sockets", "unique_user_game_combo");

  pgm.addConstraint("sockets", "unique_user_id", {
    unique: ["user_id"],
  });
}
