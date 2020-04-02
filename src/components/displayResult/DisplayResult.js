import React from 'react';
import { View, FlatList } from 'react-native';

import CardView from '../cardView/CardView';

function DisplayResult({ navigation, resultList }) {
  return (
    <View>
      <FlatList
        data={resultList}
        renderItem={({ item }) => {
          return (
            <CardView navigation={navigation} item={item} />
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default DisplayResult;
