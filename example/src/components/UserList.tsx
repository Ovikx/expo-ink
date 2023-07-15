import { Text } from 'react-native';
import * as React from 'react';
import { usersTable } from '../db/db';

export function UserList() {
  console.log(usersTable.name);
  return <Text className="text-white">{usersTable.name}</Text>;
}
