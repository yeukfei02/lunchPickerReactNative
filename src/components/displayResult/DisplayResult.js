import React from 'react';
import { View, FlatList } from 'react-native';

import CardView from '../cardView/CardView';

function DisplayResult({ navigation, resultList, isFavourites, getFavourites }) {
  return (
    <View>
      <FlatList
        data={resultList}
        renderItem={({ item }) => {
          return (
            <CardView
              navigation={navigation}
              item={item}
              isFavourites={isFavourites}
              getFavourites={getFavourites}
            />
          );
        }}
        keyExtractor={(item) => !isFavourites ? item.id : item.item.id}
      />
    </View>
  );
}

export default DisplayResult;
