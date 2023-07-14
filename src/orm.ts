import * as SQLite from 'expo-web-sqlite';
import { type Columns, type Migrations } from './types/types';
import { Table } from './table';

export class ExpoSQLiteORM {
  /** The WebSQLDatabase object */
  database: SQLite.WebSQLDatabase;
  version: number;
  migrations?: Migrations;

  /**
   *
   * @param dbName Name of the database
   */
  constructor(
    dbName: string,
    version = 0,
    migrations?: Migrations,
    autoMigrate = false
  ) {
    this.database = SQLite.openDatabase(dbName);
    console.log(this.database.version);
    this.version = version;
    this.migrations = migrations;
    if (autoMigrate) this.migrate(this.migrations);
  }

  /**
   * Returns a Table using the specified table name and columns mapping
   * @param tableName Name of the table
   * @param columns An object literal mapping column names to their respective data types
   * @returns An SQL Table object that can perform CRUD operations
   */
  initializeTable<T extends object>(
    tableName: string,
    columns: Columns<T>,
    autoCreate: boolean
  ): Table<T> {
    return new Table(this.database, tableName, columns, autoCreate);
  }

  /**
   * Executes user-defined migration statements
   * @param migrations Object that describes which SQL statement to execute based on the database version; if not provided, this instance's stored migration object is used
   */
  migrate(migrations?: Migrations) {
    const activeMigrations = migrations ?? this.migrations;
    this.database.transaction((tx) => {
      tx.executeSql(
        'PRAGMA user_version;',
        undefined,
        (_tx, resultSet) => {
          if (activeMigrations) {
            const version: number = resultSet.rows._array[0].user_version;
            const versionNums = Object.keys(activeMigrations)
              .map((x) => parseInt(x, 10))
              .sort((a, b) => a - b);
            let currIdx = versionNums.indexOf(version);
            let migrated = false;
            while (
              currIdx <= versionNums.length - 1 &&
              versionNums[currIdx] < this.version
            ) {
              const statements = activeMigrations[versionNums[currIdx]];
              for (const statement of statements) {
                tx.executeSql(
                  statement,
                  undefined,
                  () =>
                    console.log(`[OK] Executed migration SQL: ${statement}`),
                  (__tx, err) => {
                    console.log(err);
                    return false;
                  }
                );
              }

              migrated = true;
              currIdx++;
            }

            if (migrated) {
              tx.executeSql(
                `PRAGMA user_version=${this.version};`,
                undefined,
                () =>
                  console.log(
                    `Successfully migrated from user_version ${version} to user_version ${this.version}`
                  ),
                (__tx, err) => {
                  console.log(err);
                  return false;
                }
              );
            }
          }
        },
        (_tx, err) => {
          console.log(err);
          return false;
        }
      );
    });
  }
}
