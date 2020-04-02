import React from 'react';
import { View, FlatList } from 'react-native';

import CardView from '../cardView/CardView';

function DisplayResult(props) {
  return (
    <View>
      <FlatList
        data={props.resultList}
        renderItem={({ item }) => {
          return (
            <CardView item={item} />
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default DisplayResult;
