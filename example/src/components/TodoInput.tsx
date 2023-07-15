import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { InputField } from './InputField';
import { todoTable } from '../db/db';

interface Props {
  onInsert: () => void;
}

export function TodoInput(props: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const onSubmit = () => {
    if (title.length > 0 && description.length > 0) {
      todoTable
        .insert({
          title,
          description,
          completed: false,
          datePosted: Date.now(),
        })
        .then(() => {
          setTitle('');
          setDescription('');
          props.onInsert();
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <View className="mt-10 flex flex-row w-4/5 justify-evenly place-content-evenly">
      <InputField
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        tailwindWidth="w-12"
      />
      <InputField
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        tailwindWidth="w-32"
      />
      <Pressable onPress={onSubmit}>
        <View className="bg-green-800">
          <Text className="px-5 py-2">SUBMIT</Text>
        </View>
      </Pressable>
    </View>
  );
}
