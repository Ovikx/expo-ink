import * as React from 'react';

import { SafeAreaView, Text } from 'react-native';
import { TodoList } from './components/TodoList';
import { TodoInput } from './components/TodoInput';
import { useEffect, useState } from 'react';
import { todoTable } from './db/db';
import type { Todo } from './types/types';
import { RefreshContext } from './contexts';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [numCompleted, setNumCompleted] = useState(0);
  const refreshTodos = () => {
    todoTable.select({}).then((res) => setTodos(res));
    todoTable
      .sum('completed', { completed: true })
      .then((res) => setNumCompleted(res));
  };
  useEffect(refreshTodos, []);

  return (
    <RefreshContext.Provider value={refreshTodos}>
      <SafeAreaView className="flex-1 items-center bg-gray-900">
        <Text className="text-white text-2xl font-bold">{`${numCompleted} tasks completed`}</Text>
        <TodoInput onInsert={refreshTodos} />
        <TodoList todos={todos} />
      </SafeAreaView>
    </RefreshContext.Provider>
  );
}
