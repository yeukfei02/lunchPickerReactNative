import React from 'react';
import { View, FlatList } from 'react-native';

import CardView from '../cardView/CardView';

function DisplayResult({ navigation, resultList, isFavourites, getFavourites }) {
  return (
    <View>
      <FlatList
        data={resultList}
        renderItem={({ item }) => {
          const index = resultList.indexOf(item);

          return (
            <CardView
              key={index}
              navigation={navigation}
              item={item}
              isFavourites={isFavourites}
              getFavourites={getFavourites}
            />
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default DisplayResult;
