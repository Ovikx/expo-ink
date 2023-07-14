import { type DatabaseConfig } from 'expo-ink';
import { PostsColumns, UsersColumns } from './columns';

export const dbConfig: DatabaseConfig = {
  name: 'example-app',
  version: 1,
  autoCreateTables: true,
  tables: [
    { name: 'users', columns: UsersColumns },
    { name: 'posts', columns: PostsColumns },
  ],
};
