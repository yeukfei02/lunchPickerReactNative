import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableHighlight, Linking } from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import _ from 'lodash';
import axios from 'axios';
import { getRootUrl, log } from '../../common/Common';

const ROOT_URL = getRootUrl();

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
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  deleteFavouritesByIdContainer: {
    flex: 1,
    alignSelf: 'flex-end',
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
  },
  colorPrimary: {
    color: '#ed1f30'
  },
});

function CardView({ navigation, item, isFavourites, getFavourites }) {
  const [favouritesClicked, setFavouritesClicked] = useState(false);

  let id = '';
  let name = '';
  let avatarStr = '';
  let categories = '';
  let imageUrl = '';
  let url = '';
  let rating = '';
  let location = '';
  let displayPhone = '';

  const cardViewItem = isFavourites === false ? item : item.item;
  const _id = isFavourites === true ? item._id : '';

  if (!_.isEmpty(cardViewItem)) {
    id = cardViewItem.id;
    name = cardViewItem.name;
    avatarStr = cardViewItem.name[0].toUpperCase();
    categories = cardViewItem.categories;
    imageUrl = cardViewItem.image_url;
    url = cardViewItem.url;
    rating = cardViewItem.rating;
    location = cardViewItem.location.display_address.join(', ');
    displayPhone = cardViewItem.display_phone;
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

  const handleLinkClick = () => {
    Linking.openURL(url);
  }

  const handleFavouritesIconClick = () => {
    setFavouritesClicked(true);

    axios.post(
      `${ROOT_URL}/favourites/add-to-favourites`,
      {
        item: item
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
        }
      });
  }

  const renderFavouritesIcon = () => {
    let favouritesIcon = (
      <MaterialIcons style={{ marginRight: 10 }} name={'favorite-border'} size={40} color={'black'} onPress={handleFavouritesIconClick} />
    );

    if (favouritesClicked || isFavourites) {
      favouritesIcon = (
        <MaterialIcons style={{ marginRight: 10 }} name={'favorite'} size={40} color={style.colorPrimary.color} />
      );
    }

    return favouritesIcon;
  }

  const handleDeleteFavouritesById = () => {
    axios.delete(
      `${ROOT_URL}/favourites/delete-favourites/${_id}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
          setTimeout(() => {
            getFavourites();
          }, 500);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
        }
      });
  }

  const renderDeleteFavouritesByIdButton = () => {
    let deleteFavouritesByIdButton = null;

    if (isFavourites) {
      deleteFavouritesByIdButton = (
        <View style={style.deleteFavouritesByIdContainer}>
          <Entypo name="cross" size={35} color={'black'} onPress={handleDeleteFavouritesById} />
        </View>
      );
    }

    return deleteFavouritesByIdButton;
  }

  return (
    <View style={style.container}>
      {renderDeleteFavouritesByIdButton()}
      <Divder margin={5} />
      <View style={style.rowContainer}>
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
      <View style={style.rowContainer}>
        {renderFavouritesIcon()}
        <Entypo name="link" size={40} color={'black'} onPress={handleLinkClick} />
      </View>
    </View>
  );
}

export default CardView;
