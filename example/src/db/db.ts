import { createDB, createTable } from 'expo-ink';
import { TodoColumns } from './columns';

export const db = createDB({
  dbName: 'example-app',
  version: 0,
});

export const todoTable = createTable({
  tableName: 'todos',
  columns: TodoColumns,
  db: db,
});
