import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("test_tab", {
    id: "id",
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
    test_string: {
      type: "varchar(1000)",
      notNull: true,
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("test_tab");
}
