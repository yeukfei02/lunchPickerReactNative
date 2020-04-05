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
  },
});

function Favourites() {
  return (
    <ScrollView style={style.scrollViewContainer}>
      <View style={style.container}>
        <Text>Favourites</Text>
      </View>
    </ScrollView>
  );
}

export default Favourites;
