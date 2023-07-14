import { type DatabaseConfig } from 'expo-ink';
import { UsersColumns } from './columns';

export const dbConfig: DatabaseConfig = {
  name: 'example-app',
  version: 0,
  autoCreateTables: true,
  tables: [{ name: 'users', columns: UsersColumns }],
};
