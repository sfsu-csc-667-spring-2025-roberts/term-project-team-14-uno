import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn("sockets", {
    user_id: {
      type: "integer",
      references: "users",
      onDelete: "CASCADE",
    },
  });

  // Optional index for faster user lookup in sockets
  pgm.createIndex("sockets", ["user_id"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex("sockets", ["user_id"]);
  pgm.dropColumn("sockets", "user_id");
}
