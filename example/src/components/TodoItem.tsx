import React, { useState } from 'react';
import type { Todo } from '../types/types';
import { View, Text, Pressable } from 'react-native';
import { todoTable } from '../db/db';

interface Props {
  todo: Todo;
}

export function TodoItem({ todo }: Props) {
  const [completed, setCompleted] = useState(todo.completed);
  const onCheckboxPress = () => {
    todoTable
      .update({ completed: !completed }, { where: { title: todo.title } })
      .then(() => setCompleted(!completed));
  };

  return (
    <View className="flex flex-row">
      <Pressable hitSlop={5} onPress={onCheckboxPress}>
        <Text className="mx-2 text-white">{completed ? '[X]' : '[ ]'}</Text>
      </Pressable>
      <Text className="mx-2 text-white">{todo.title}</Text>
      <Text className="mx-2 text-white">{todo.description}</Text>
    </View>
  );
}
