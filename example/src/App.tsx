import * as React from 'react';

import { SafeAreaView } from 'react-native';
import { TodoList } from './components/TodoList';
import { TodoInput } from './components/TodoInput';
import { useEffect, useState } from 'react';
import { todoTable } from './db/db';
import type { Todo } from './types/types';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const refreshTodos = () => {
    todoTable.select({}).then((res) => setTodos(res));
  };
  useEffect(refreshTodos, []);

  return (
    <SafeAreaView className="flex-1 items-center bg-gray-900">
      <TodoInput onInsert={refreshTodos} />
      <TodoList todos={todos} />
    </SafeAreaView>
  );
}
