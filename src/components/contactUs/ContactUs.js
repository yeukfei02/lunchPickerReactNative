import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Card, Button } from 'react-native-material-ui';
import _ from 'lodash';
import axios from 'axios';
import { getRootUrl, log } from '../../common/Common';

const ROOT_URL = getRootUrl();

const style = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#FAFAD2',
  },
  container: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAD2',
  },
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
    <ScrollView style={style.scrollViewContainer}>
      <View style={style.container}>
        <Card>
          <Text>Restaurant Details</Text>
          <Button raised primary text="Back to Home" onPress={handleBackToHome} />
        </Card>
      </View>
    </ScrollView>
  );
}

function ContactUs(props) {
  const renderDiv = () => {
    let result = (
      <ScrollView style={style.scrollViewContainer}>
        <View style={style.container}>
          <Card>
            <Text>Contact us</Text>
          </Card>
        </View>
      </ScrollView>
    );

    if (!_.isEmpty(props.route) && !_.isEmpty(props.route.params) && !_.isEmpty(props.route.params.id)) {
      result = (
        <RestaurantDetails navigation={props.navigation} id={props.route.params.id} />
      );
    }

    return result;
  }

  return (
    renderDiv()
  );
}

export default ContactUs;
