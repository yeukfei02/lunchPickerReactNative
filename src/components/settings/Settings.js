import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAD2',
  },
  colorPrimary: {
    color: '#ed1f30'
  },
  colorPrimaryDark: {
    color: '#ffcc0000'
  },
  colorAccent: {
    color: '#2b76f0'
  }
});

function Settings() {
  return (
    <View style={style.container}>
      <Text>Settings</Text>
    </View>
  );
}

export default Settings;
