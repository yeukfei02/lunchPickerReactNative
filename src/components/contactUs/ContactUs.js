import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Button, Linking } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import axios from 'axios';
import { getRootUrl, log } from '../../common/Common';

import Divder from '../divider/Divider';

const ROOT_URL = getRootUrl();

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
  iconContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  radioButtonContainer: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginHorizontal: 30
  },
  colorPrimary: {
    color: '#ed1f30'
  }
});

function RestaurantDetails({ navigation, id }) {
  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [photosList, setPhotosList] = useState([]);
  const [name, setName] = useState('');
  const [locationStr, setLocationStr] = useState('');

  useEffect(() => {
    if (!_.isEmpty(id)) {
      getRestaurantsDetailsById(id);
    }
  }, [id]);

  const getRestaurantsDetailsById = (id) => {
    axios.get(
      `${ROOT_URL}/restaurant/get-restaurant-details/${id}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
          setRestaurantDetails(response.data.restaurantDetails);

          const name = response.data.restaurantDetails.name;
          setName(name);

          const photos = response.data.restaurantDetails.photos;
          setPhotosList(photos);

          const location = response.data.restaurantDetails.location;
          let locationStr = '';
          if (!_.isEmpty(location)) {
            if (!_.isEmpty(location.display_address)) {
              locationStr = location.display_address.join(', ');
            }
          }
          setLocationStr(locationStr);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
        }
      });
  }

  const handleBackToHome = () => {
    navigation.navigate('Home');
  }

  return (
    <View>
      <Text>Restaurant Details</Text>
      <Divder margin={10} />
      <Button
        onPress={handleBackToHome}
        title="Back to Home"
        color={style.colorPrimary.color}
      >
        Back to Home
      </Button>
    </View>
  );
}

function ContactUs({ navigation, route }) {
  const [radioButtonValue, setRadioButtonValue] = useState('');

  const handleRadioButton = (radioButtonValue) => {
    setRadioButtonValue(radioButtonValue);
  }

  const handleDonorboxClick = () => {
    Linking.openURL('https://donorbox.org/donate-for-lunch-picker-better-features-and-development');
  }

  const handleBuyMeACoffeeClick = () => {
    Linking.openURL('https://www.buymeacoffee.com/yeukfei02');
  }

  const handleStripeClick = () => {

  }

  const renderButton = () => {
    let result = null;

    if (_.isEqual(radioButtonValue, 'donorbox')) {
      result = (
        <Button
          onPress={handleDonorboxClick}
          title="Donorbox"
          color={style.colorPrimary.color}
        >
          Donorbox
        </Button>
      );
    } else if (_.isEqual(radioButtonValue, 'buyMeACoffee')) {
      result = (
        <Button
          onPress={handleBuyMeACoffeeClick}
          title="Buy Me A Coffee"
          color={style.colorPrimary.color}
        >
          Buy Me A Coffee
        </Button>
      );
    } else if (_.isEqual(radioButtonValue, 'stripe')) {

    }

    return result;
  }

  const handleGithubClick = () => {
    Linking.openURL(`https://github.com/yeukfei02`);
  }

  const handleEmailClick = () => {
    Linking.openURL(`mailto:yeukfei02@gmail.com`);
  }

  const renderDiv = () => {
    let result = (
      <View>
        <View style={style.container}>
          <Text>Contact us via email or visit our github repo</Text>
          <Divder margin={5} />
          <View style={style.iconContainer}>
            <AntDesign style={{ marginRight: 15 }} name="github" size={40} color="black" onPress={handleGithubClick} />
            <MaterialIcons name="email" size={40} color="black" onPress={handleEmailClick} />
          </View>
        </View>

        <View style={style.radioButtonContainer}>
          <Text>Donate for lunch picker better features and development</Text>

          <RadioButton
            value="places"
            status={radioButtonValue === 'donorbox' ? 'checked' : 'unchecked'}
            onPress={() => handleRadioButton('donorbox')}
          />
          <Text>Donorbox</Text>

          <RadioButton
            value="places"
            status={radioButtonValue === 'buyMeACoffee' ? 'checked' : 'unchecked'}
            onPress={() => handleRadioButton('buyMeACoffee')}
          />
          <Text>Buy Me A Coffee</Text>

          <RadioButton
            value="places"
            status={radioButtonValue === 'stripe' ? 'checked' : 'unchecked'}
            onPress={() => handleRadioButton('stripe')}
          />
          <Text>Stripe</Text>

          <Divder margin={5} />
          {renderButton()}
        </View>
      </View>
    );

    if (!_.isEmpty(route) && !_.isEmpty(route.params) && !_.isEmpty(route.params.id)) {
      result = (
        <View style={style.container}>
          <RestaurantDetails navigation={navigation} id={route.params.id} />
        </View>
      );
    }

    return result;
  }

  return (
    <ScrollView style={style.scrollViewContainer}>
      {renderDiv()}
    </ScrollView>
  );
}

export default ContactUs;
