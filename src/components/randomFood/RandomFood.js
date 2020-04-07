import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';

const style = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#FAFAD2',
  },
  container: {
    flex: 1,
    marginTop: 100,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 30
  },
});

function RandomFood() {
  return (
    <ScrollView style={style.scrollViewContainer}>
      <View style={style.container}>
        <Text>Random food</Text>
      </View>
    </ScrollView>
  );
}

export default RandomFood;
