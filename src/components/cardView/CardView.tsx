import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableHighlight, Linking } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import axios from 'axios';
import { getRootUrl, log } from '../../common/Common';

const ROOT_URL = getRootUrl();

import Divder from '../divider/Divider';

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 20,
    backgroundColor: 'white',
  },
  favouritesContainer: {
    flex: 1,
    paddingLeft: 25,
    paddingRight: 15,
    paddingVertical: 25,
    alignItems: 'center',
    marginVertical: 15,
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
    borderRadius: 20,
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
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 15,
    color: 'gray',
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
    color: '#ed1f30',
  },
  phone: {
    fontSize: 15,
  },
  rating: {
    fontSize: 15,
  },
  colorPrimary: {
    color: '#ed1f30',
  },
});

function CardView(props: any) {
  const { t } = useTranslation();

  const [favouritesClicked, setFavouritesClicked] = useState(false);

  let id = '';
  let name = '';
  let avatarStr = '';
  let categories: any[] = [];
  let imageUrl = '';
  let url = '';
  let rating = '';
  let location = '';
  let displayPhone = '';

  const cardViewItem = props.isFavourites === false ? props.item : props.item.item;
  const _id = props.isFavourites === true ? props.item._id : '';

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

  let subHeader = '';
  if (!_.isEmpty(categories)) {
    categories.forEach((item: any, i: number) => {
      if (!_.isEmpty(item.title))
        if (i === 0) subHeader += item.title;
        else subHeader += ', ' + item.title;
    });
  }

  const handleImageClick = () => {
    Linking.openURL(url);
  };

  const handleLocationClick = () => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${location}`);
  };

  const handleAvatarClick = (navigation: any) => {
    navigation.navigate('StackView', {
      screen: 'RestaurantDetails',
      params: {
        id: id,
      },
    });
  };

  const handleTitleClick = (navigation: any) => {
    navigation.navigate('StackView', {
      screen: 'RestaurantDetails',
      params: {
        id: id,
      },
    });
  };

  const handleLinkClick = () => {
    Linking.openURL(url);
  };

  const handleFavouritesIconClick = () => {
    setFavouritesClicked(true);

    axios
      .post(
        `${ROOT_URL}/favourites/add-to-favourites`,
        {
          item: props.item,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log('response = ', response);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log('error = ', error);
        }
      });
  };

  const renderFavouritesIcon = () => {
    let favouritesIcon = (
      <MaterialIcons
        style={{ marginRight: 10 }}
        name={'favorite-border'}
        size={40}
        color={'black'}
        onPress={handleFavouritesIconClick}
      />
    );

    if (favouritesClicked || props.isFavourites) {
      favouritesIcon = (
        <MaterialIcons style={{ marginRight: 10 }} name={'favorite'} size={40} color={style.colorPrimary.color} />
      );
    }

    return favouritesIcon;
  };

  const handleDeleteFavouritesById = () => {
    axios
      .delete(`${ROOT_URL}/favourites/delete-favourites/${_id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (!_.isEmpty(response)) {
          log('response = ', response);
          setTimeout(() => {
            props.getFavourites();
          }, 500);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log('error = ', error);
        }
      });
  };

  const renderView = (props: any) => {
    let renderView = (
      <Card style={style.container}>
        <Divder margin={5} />

        <View style={style.rowContainer}>
          <View style={style.circle}>
            <Text style={style.avatarStr} onPress={() => handleAvatarClick(props.navigation)}>
              {avatarStr}
            </Text>
          </View>
          <View style={style.titleContainer}>
            <Text style={style.name} onPress={() => handleTitleClick(props.navigation)}>
              {name}
            </Text>
            <Divder margin={3} />
            <Text style={style.subHeader}>{subHeader}</Text>
          </View>
        </View>

        <Divder margin={10} />

        {getCommonView(props)}
      </Card>
    );

    if (props.isFavourites) {
      renderView = (
        <Card style={style.favouritesContainer}>
          <View style={style.deleteFavouritesByIdContainer}>
            <Entypo name="cross" size={35} color={'black'} onPress={handleDeleteFavouritesById} />
          </View>

          <Divder margin={5} />

          <View style={style.rowContainer}>
            <View style={style.circle}>
              <Text style={style.avatarStr} onPress={() => handleAvatarClick(props.navigation)}>
                {avatarStr}
              </Text>
            </View>
            <View style={style.titleContainer}>
              <Text style={style.name} onPress={() => handleTitleClick(props.navigation)}>
                {name}
              </Text>
              <Divder margin={3} />
              <Text style={style.subHeader}>{subHeader}</Text>
            </View>
          </View>

          <Divder margin={8} />

          {getCommonView(props)}
        </Card>
      );
    }

    return renderView;
  };

  const getCommonView = (props: any) => {
    return (
      <View>
        <TouchableHighlight onPress={handleImageClick}>
          <Image
            style={style.logo}
            source={{
              uri: imageUrl,
            }}
            resizeMode={'contain'}
          />
        </TouchableHighlight>
        
        <Divder margin={10} />

        <Text style={style.location}>
          {t('location')}{' '}
          <Text style={style.locationClick} onPress={handleLocationClick}>
            {location}
          </Text>
        </Text>

        <Divder margin={5} />

        {!_.isEmpty(displayPhone) ? (
          <Text style={style.phone}>
            {t('phone')} {displayPhone}
          </Text>
        ) : null}

        <Divder margin={5} />

        <Text style={style.rating}>
          {t('rating')} {rating}
        </Text>

        <Divder margin={5} />

        <View style={style.rowContainer}>
          {renderFavouritesIcon()}
          <Entypo name="link" size={40} color={'black'} onPress={handleLinkClick} />
        </View>
      </View>
    );
  };

  return renderView(props);
}

export default CardView;
