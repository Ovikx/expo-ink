import type { DatabaseConfig, TableConfig } from '../types/types';
import { ExpoSQLiteORM } from './orm';
import { Table } from './table';

/**
 * Function to create a database without directly calling the constructor
 * @param config Configuration options for creating the database
 * @returns Database object
 */
export function createDB(config: DatabaseConfig) {
  return new ExpoSQLiteORM(
    config.dbName,
    config.version,
    config.migrations,
    config.autoMigrate
  );
}

/**
 * Function to create a typed table without directly calling the constructor
 * @param config Configuration options for creating the table
 * @returns Table object that can be imported anywhere to perform CRUD operations
 */
export function createTable<T extends object>(config: TableConfig<T>) {
  return new Table<T>(
    config.db.database,
    config.tableName,
    config.columns,
    true
  );
}
