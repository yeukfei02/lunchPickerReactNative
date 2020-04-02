import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Card } from 'react-native-material-ui';

const style = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#FAFAD2',
  },
  container: {
    flex: 1,
    marginTop: 50,
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
    <ScrollView style={style.scrollViewContainer}>
      <View style={style.container}>
        <Card>
          <Text>Settings</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

export default Settings;
