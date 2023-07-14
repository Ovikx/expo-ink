/** Enum to represent the various SQL data types */
export enum ColumnType {
  TEXT = 'TEXT',
  INTEGER = 'INTEGER',
  REAL = 'REAL',
}

/** Constraints for a column (note: `DEFAULT` is omitted because it is already found as an optional property on ColumnDefinition) */
export enum ColumnConstraint {
  NOT_NULL = 'NOT NULL',
  UNIQUE = 'UNIQUE',
  PRIMARY_KEY = 'PRIMARY KEY',
}

/** Maps column names to column definitions (data type and constraints) */
export type Columns<T extends object> = {
  [k in keyof T]: ColumnDefinition<T, k>;
};

/** Stores the data type and constraints for a column */
export interface ColumnDefinition<T, K extends keyof T> {
  dataType: ColumnType;
  constraints?: ColumnConstraint[];
  default?: T[K];
}

/** Sort order for ORDER BY clause */
export type SortOrder = 'ASC' | 'DESC';

/** Options for querying rows from a table */
export interface SelectOptions<T> {
  /** The names of the columns to select. Do not pass this property for querying all columns (`"*"`) */
  columns?: Array<keyof T>;
  // TODO: add where
  where?: WhereOptions<T>;
  /** Maximum number of returned rows */
  limit?: number;
  /** Sort order */
  orderBy?: { [k in keyof Partial<T>]: SortOrder };
}

/** Maps column names to WHERE clauses */
export type WhereOptions<T> =
  | { [k in keyof Partial<T>]: WhereOperators<T, k> | T[k] }
  | OrOperator<T>;

/** Logical operators for WHERE clauses */
export interface WhereOperators<T, K extends keyof T> {
  $eq?: T[K];
  $neq?: T[K];
  $lt?: T[K];
  $lte?: T[K];
  $gt?: T[K];
  $gte?: T[K];
  $not?: WhereOperators<T, K> | OrOperator<T>;
}

export type OrOperator<T> = { $or: WhereOptions<T>[] };

/** Each key is the version number to migrate from and the associate value is the SQL statement to execute (TODO: support multiple SQL statements) */
export type Migrations = { [k: number]: string[] };

export type Entries<T> = {
  [k in keyof T]: [k, T[k]];
}[keyof T][];
