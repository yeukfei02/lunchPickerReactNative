import React from 'react';
import { View, FlatList } from 'react-native';

import CardView from '../cardView/CardView';

function DisplayResult(props: any): JSX.Element {
  return (
    <View>
      <FlatList
        data={props.resultList}
        renderItem={({ item }) => {
          return (
            <CardView
              navigation={props.navigation}
              item={item}
              isFavourites={props.isFavourites}
              getFavourites={props.getFavourites}
            />
          );
        }}
        keyExtractor={(item: any) => (!props.isFavourites ? item.id : item.item.id)}
      />
    </View>
  );
}

export default DisplayResult;
