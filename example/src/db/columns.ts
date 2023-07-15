import { ColumnConstraint, ColumnType, type Columns } from 'expo-ink';
import type { Todo } from '../types/types';

export const TodoColumns: Columns<Todo> = {
  title: {
    dataType: ColumnType.TEXT,
    constraints: [ColumnConstraint.UNIQUE],
  },
  description: { dataType: ColumnType.TEXT },
  datePosted: { dataType: ColumnType.INTEGER },
  completed: { dataType: ColumnType.BOOLEAN, default: false },
};
