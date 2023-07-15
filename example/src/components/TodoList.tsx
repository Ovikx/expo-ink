import { FlatList } from 'react-native';
import * as React from 'react';
import type { Todo } from '../types/types';

import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
}

export function TodoList({ todos }: Props) {
  const DATA: { id: string; todo: Todo }[] = [];
  for (let i = 0; i < todos.length; i++) {
    DATA.push({ id: i.toString(), todo: todos[i] });
  }

  return (
    <FlatList
      data={DATA}
      renderItem={({ item }) => <TodoItem todo={item.todo} key={item.id} />}
    />
  );
}
