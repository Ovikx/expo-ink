# expo-ink
A lightweight, type-safe, and asynchronous ORM for [`expo-sqlite`](https://www.npmjs.com/package/expo-sqlite). Leverages TypeScript to ensure rigid type safety throughout table definitions and queries. Supports automatic migrations.

## Installation

```sh
npm install expo-ink
```

## Basic usage

### Initializing the database and tables
The library provides the functions `createDB` and `createTable` for creating databases and tables, respectively. 

#### To create the database:

<blockquote>

#### **`db.ts`**
```ts
import { createDB } from 'expo-ink';

export const db = createDB({
  dbName: 'example-app',
  version: 0,
});
```
</blockquote>



#### To create a table:

<blockquote>

#### **`tables.ts`**
```ts
import { createTable, ColumnType, ColumnConstraint } from 'expo-ink';
import { db } from './db';

/** Interface to use throughout the application */
interface Todo {
  title: string;
  description: string;
  datePosted: number;
  completed: boolean;
}

/** Column definitions for the table */
const TodoColumns: Columns<Todo> = {
  title: {
    dataType: ColumnType.TEXT,
    constraints: [ColumnConstraint.UNIQUE],
  },
  description: { dataType: ColumnType.TEXT },
  datePosted: { dataType: ColumnType.INTEGER },
  completed: { dataType: ColumnType.BOOLEAN, default: false },
};


// Table to use throughout the application
export const todoTable = createTable({
  tableName: 'todos',
  columns: TodoColumns,
  db: db,
});
```
</blockquote>

#### To use a table within a component:
<blockquote>

#### **`App.tsx`**

```tsx
// Pretend there are the necessary imports here
import { todoTable } from './tables';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Fetch the rows on first render
  useEffect(() => {
    todoTable.select({}).then((res: Todo[]) => setTodos(res));
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center bg-gray-900">
      <TodoList todos={todos} />
    </SafeAreaView>
  );
}
```

</blockquote>

## Further examples
See the [example app folder](https://github.com/Ovikx/expo-ink/tree/main/example) for more advanced usage.

## Unsupported features
For any SQLite features not supported by this library, use the `database` property of `ExpoSQLiteORM` to access the [modified `expo-sqlite` API](https://github.com/Ovikx/expo-web-sqlite) directly (it's just a stable version of `expo-sqlite`).

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

[MIT](https://en.wikipedia.org/wiki/MIT_License)
