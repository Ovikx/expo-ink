import React, { useState, useContext } from 'react';
import type { Todo } from '../types/types';
import { View, Text, Pressable } from 'react-native';
import { todoTable } from '../db/db';
import { RefreshContext } from '../contexts';

interface Props {
  todo: Todo;
}

export function TodoItem({ todo }: Props) {
  const [completed, setCompleted] = useState(todo.completed);
  const refresh = useContext(RefreshContext);
  const onCheckboxPress = () => {
    todoTable
      .update({ completed: !completed }, { where: { title: todo.title } })
      .then(() => {
        setCompleted(!completed);
        if (refresh) refresh();
      });
  };

  const onDeletePress = () => {
    todoTable
      .delete({ where: { title: todo.title } })
      .then(() => {
        if (refresh) refresh();
      })
      .catch((err) => console.log(err));
  };

  return (
    <View className="flex flex-row">
      <Pressable hitSlop={5} onPress={onCheckboxPress}>
        <Text className="mx-2 text-green-500">{completed ? '[X]' : '[ ]'}</Text>
      </Pressable>
      <Text className="mx-2 text-white">{todo.title}</Text>
      <Text className="mx-2 text-white">{todo.description}</Text>
      <Pressable hitSlop={5} onPress={onDeletePress}>
        <Text className="mx-2 text-red-500">DELETE</Text>
      </Pressable>
    </View>
  );
}
