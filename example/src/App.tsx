import * as React from 'react';

import { View, Text } from 'react-native';
import { UserList } from './components/UserList';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <Text className="mt-7 text-white">TODO: make an actual example app</Text>
      <UserList />
    </View>
  );
}
