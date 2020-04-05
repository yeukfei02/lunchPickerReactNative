import React from 'react';
import { StyleSheet, View, Text, Image, TouchableHighlight, Linking } from 'react-native';
import _ from 'lodash';

import Divder from '../divider/Divider';

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: 'white',
  },
  avatarStrAndtitleContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  circle: {
    width: 40,
    height: 40,
    backgroundColor: '#ed1f30',
    borderRadius: 20
  },
  avatarStr: {
    color: 'white',
    marginTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  subHeader: {
    fontSize: 15,
    color: 'gray'
  },
  logo: {
    width: 320,
    height: 220,
  },
  location: {
    fontSize: 15,
  },
  locationClick: {
    fontSize: 15,
    textDecorationLine: 'underline',
    color: '#ed1f30'
  },
  phone: {
    fontSize: 15,
  },
  rating: {
    fontSize: 15,
  }
});

function CardView({ navigation, item }) {
  let id = '';
  let name = '';
  let avatarStr = '';
  let categories = '';
  let imageUrl = '';
  let url = '';
  let rating = '';
  let location = '';
  let displayPhone = '';
  if (!_.isEmpty(item)) {
    id = item.id;
    name = item.name;
    avatarStr = item.name[0].toUpperCase();
    categories = item.categories;
    imageUrl = item.image_url;
    url = item.url;
    rating = item.rating;
    location = item.location.display_address.join(', ');
    displayPhone = item.display_phone;
  }

  let subHeader = "";
  if (!_.isEmpty(categories)) {
    categories.forEach((item, i) => {
      if (!_.isEmpty(item.title))
        if (i === 0)
          subHeader += item.title;
        else
          subHeader += ", " + item.title;
    });
  }

  const handleImageClick = () => {
    Linking.openURL(url);
  }

  const handleLocationClick = () => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${location}`);
  }

  const handleAvatarClick = () => {
    navigation.navigate('Contact us', {
      id: id
    });
  }

  const handleTitleClick = () => {
    navigation.navigate('Contact us', {
      id: id
    });
  }

  return (
    <View style={style.container}>
      <Divder margin={5} />
      <View style={style.avatarStrAndtitleContainer}>
        <View style={style.circle}>
          <Text style={style.avatarStr} onPress={handleAvatarClick}>{avatarStr}</Text>
        </View>
        <View style={style.titleContainer}>
          <Text style={style.name} onPress={handleTitleClick}>{name}</Text>
          <Divder margin={3} />
          <Text style={style.subHeader}>{subHeader}</Text>
        </View>
      </View>
      <Divder margin={5} />
      <TouchableHighlight onPress={handleImageClick}>
        <Image
          style={style.logo}
          source={{
            uri: imageUrl
          }}
          resizeMode={'cover'}
        />
      </TouchableHighlight>
      <Divder margin={5} />
      <Text style={style.location}>Location: <Text style={style.locationClick} onPress={handleLocationClick}>{location}</Text></Text>
      <Divder margin={5} />
      {
        !_.isEmpty(displayPhone) ?
          <Text style={style.phone}>Phone: {displayPhone}</Text>
          :
          null
      }
      <Divder margin={5} />
      <Text style={style.rating}>Rating: {rating}</Text>
      <Divder margin={5} />
    </View>
  );
}

export default CardView;
