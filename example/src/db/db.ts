import { createDB, createTable } from 'expo-ink';
import { UsersColumns } from './columns';

export const db = createDB({
  dbName: 'example-app',
  version: 0,
});

export const usersTable = createTable({
  tableName: 'users',
  columns: UsersColumns,
  db: db,
});
