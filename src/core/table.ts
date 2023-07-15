import {
  type BaseQueryOptions,
  type ColumnDefinition,
  type SelectOptions,
  type UpdateSetOptions,
  type WhereOptions,
} from '../types/types';
import { type Columns } from '../types/types';
import * as SQLite from 'expo-web-sqlite';
import { _parseOptions, _parseWhere, sql } from '../utils';

export class Table<T extends object> {
  database: SQLite.WebSQLDatabase;
  name: string;
  columns: Columns<T>;

  constructor(
    db: SQLite.WebSQLDatabase,
    name: string,
    columns: Columns<T>,
    autoCreate: boolean
  ) {
    this.database = db;
    this.name = name;
    this.columns = columns;
    if (autoCreate) this.createTable();
  }

  /**
   * Adds this table to the database if it doesn't exist already.
   */
  async createTable<K extends keyof T>() {
    const cols: string[] = [];
    for (const [colName, colDef] of Object.entries(this.columns) as [
      string,
      ColumnDefinition<T, K>
    ][]) {
      let colStr = `${colName} ${colDef.dataType}`;
      if (colDef.constraints) {
        colStr += ` ${colDef.constraints.join(' ')}`;
      }

      if (colDef.default != undefined) {
        colStr += ` DEFAULT ${colDef.default}`;
      }

      cols.push(colStr);
    }

    const statement = `CREATE TABLE IF NOT EXISTS ${this.name} (${cols.join(
      ', '
    )});`;
    this.database.transaction(
      (tx) => tx.executeSql(statement),
      (e) => console.log(`[ERR] ${e} | Executed SQL: ${statement}`),
      () => console.log(`[OK] Executed SQL: ${statement}`)
    ); // TODO: replace success callback with a user-provided callback
  }

  /**
   * Deletes the table from the database
   */
  async deleteTable() {
    return new Promise<void>((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql(
          `DROP TABLE IF EXISTS ${this.name}`,
          undefined,
          () => resolve(),
          (_tx, err) => {
            console.log(err);
            reject(err);
            return false;
          }
        );
      });
    });
  }

  /**
   * Updates the provided state by performing a `SELECT FROM` operation on this table using the provided query options
   * @param options Query options
   * @returns Array of results
   */
  async select(options: SelectOptions<T>) {
    // Parse the columns
    const cols = options.columns?.join(', ') ?? '*';
    let statement = `SELECT ${cols} FROM ${this.name}`;
    statement = _parseOptions(statement, options);

    return new Promise<T[]>((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql(
          sql`${statement}`,
          undefined,
          (_tx, resultSet) => {
            resolve(resultSet.rows._array);
          },
          (_tx, err) => {
            console.log(err);
            reject(err);
            return false;
          }
        );
      });
    });
  }

  async update(set: UpdateSetOptions<T>, options: BaseQueryOptions<T>) {
    let statement = `UPDATE ${this.name}`;
    // Parse set options
    const vals: any[] = [];
    const colEqs: string[] = [];
    for (const [col, val] of Object.entries(set)) {
      vals.push(val);
      colEqs.push(`${col} = ?`);
    }

    statement += ` SET ${colEqs.join(', ')}`;

    // Parse query options
    statement = _parseOptions(statement, options);

    return new Promise<void>((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql(
          statement,
          vals,
          () => resolve(),
          (_tx, err) => {
            reject(err);
            return false;
          }
        );
      });
    });
  }

  /**
   * Inserts a row into the table
   * @param row Row to insert into the table
   */
  async insert(row: T) {
    const columns: string[] = [];
    const values: (string | number)[] = []; // don't input these directly into the SQL
    for (const [key, val] of Object.entries(row)) {
      columns.push(key);
      values.push(val);
    }

    const statement = `INSERT INTO ${this.name} (${columns.join(
      ', '
    )}) VALUES (${Array(values.length).fill('?').join(', ')});`;
    return new Promise<void>((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql(
          statement,
          values,
          () => {
            resolve();
          },
          (_tx, err) => {
            console.log(err);
            reject(err);
            return false;
          }
        );
      });
    });
  }

  async sum(column: keyof T, where?: WhereOptions<T>) {
    let statement = `SELECT SUM(${String(column)}) FROM ${this.name}`;

    // Handle WHERE
    if (where != undefined && JSON.stringify(where) != '{}') {
      statement += ` WHERE ${_parseWhere(where)}`;
    }

    return new Promise<number>((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql(
          sql`${statement}`,
          undefined,
          (_tx, resultSet) => {
            resolve(resultSet.rows._array[0][`SUM(${String(column)})`] ?? 0);
          },
          (_tx, err) => {
            console.log(err);
            reject(err);
            return false;
          }
        );
      });
    });
  }
}
