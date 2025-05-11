import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addConstraint("sockets", "unique_user_id", {
    unique: ["user_id"],
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropConstraint("sockets", "unique_user_id");
}
