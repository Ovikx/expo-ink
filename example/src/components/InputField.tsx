import React from 'react';
import { TextInput } from 'react-native';

interface Props {
  placeholder: string;
  value: string;
  tailwindWidth: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
}

export function InputField(props: Props) {
  return (
    <TextInput
      className={`border-gray-300 border-2 ${props.tailwindWidth} mx-5 text-white`}
      placeholder={props.placeholder}
      placeholderTextColor={'#bbbbbb'}
      value={props.value}
      onChangeText={(text) => props.onChangeText(text)}
    />
  );
}
