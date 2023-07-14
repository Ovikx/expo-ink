import { ColumnConstraint, ColumnType, type Columns } from 'expo-ink';
import type { Post, User } from 'src/types/types';
export const UsersColumns: Columns<User> = {
  id: {
    dataType: ColumnType.TEXT,
    constraints: [ColumnConstraint.PRIMARY_KEY, ColumnConstraint.UNIQUE],
  },
  name: { dataType: ColumnType.TEXT },
  age: { dataType: ColumnType.INTEGER },
  verified: { dataType: ColumnType.TEXT, default: false },
};

export const PostsColumns: Columns<Post> = {
  id: {
    dataType: ColumnType.TEXT,
    constraints: [ColumnConstraint.PRIMARY_KEY, ColumnConstraint.UNIQUE],
  },
  title: { dataType: ColumnType.TEXT },
  timePosted: { dataType: ColumnType.INTEGER },
};
