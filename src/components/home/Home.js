import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TextInput } from 'react-native';
import { RadioButton, Button, Card } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import _ from 'lodash';
import axios from 'axios';
import { getRootUrl, log } from '../../common/Common';

import Divder from '../divider/Divider';
import DisplayResult from '../displayResult/DisplayResult';

const logo = require('../../images/logo2.png');

const ROOT_URL = getRootUrl();

const style = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#FAFAD2',
  },
  container: {
    flex: 1,
    marginTop: 100,
    padding: 16,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginHorizontal: 30
  },
  rowContainer: {
    flexDirection: 'row'
  },
  logo: {
    width: 300,
    height: 200,
  },
  picker: {
    width: 300,
    height: 30
  },
  colorPrimary: {
    color: '#ed1f30'
  },
  colorPrimaryDark: {
    color: '#ffcc0000'
  },
  colorAccent: {
    color: '#2b76f0'
  }
});

function Home({ navigation }) {
  const [selectedTermList, setSelectedTermList] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [radioButtonValue, setRadioButtonValue] = useState('');

  const [location, setLocation] = useState('Enter location...');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [resultList, setResultList] = useState([]);

  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);

  useEffect(() => {
    getSelectedTermList();
    getUserCurrentLatLong();
  }, []);

  useEffect(() => {
    if (latitude !== 0 && longitude !== 0)
      findLocationTextByLatLong(latitude, longitude);
  }, [latitude, longitude]);

  const getSelectedTermList = () => {
    axios.get(
      `${ROOT_URL}/category/get-categories`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
          if (!_.isEmpty(response.data.categories)) {
            let foodList = [];
            let restaurantsList = [];
            let barsList = [];
            let breakfastBrunchList = [];
            response.data.categories.forEach((item, i) => {
              if (!_.isEmpty(item.parent_aliases)) {
                const parentAliases = item.parent_aliases[0];
                if (_.isEqual(parentAliases, "food")) {
                  foodList.push(item);
                }
                if (_.isEqual(parentAliases, "restaurants")) {
                  restaurantsList.push(item);
                }
                if (_.isEqual(parentAliases, "bars")) {
                  barsList.push(item);
                }
                if (_.isEqual(parentAliases, "breakfast_brunch")) {
                  breakfastBrunchList.push(item);
                }
              }
            });

            if (!_.isEmpty(foodList)) {
              foodList = foodList.map((item, i) => {
                const optionsObj = {
                  value: item.alias,
                  label: item.title
                }
                return optionsObj;
              });
            }
            if (!_.isEmpty(restaurantsList)) {
              restaurantsList = restaurantsList.map((item, i) => {
                const optionsObj = {
                  value: item.alias,
                  label: item.title
                }
                return optionsObj;
              });
            }
            if (!_.isEmpty(barsList)) {
              barsList = barsList.map((item, i) => {
                const optionsObj = {
                  value: item.alias,
                  label: item.title
                }
                return optionsObj;
              });
            }
            if (!_.isEmpty(breakfastBrunchList)) {
              breakfastBrunchList = breakfastBrunchList.map((item, i) => {
                const optionsObj = {
                  value: item.alias,
                  label: item.title
                }
                return optionsObj;
              });
            }
            let formattedSelectedTermList = [
              {
                value: 'Select the food you want...',
                label: 'Select the food you want...'
              }
            ];
            formattedSelectedTermList = formattedSelectedTermList.concat(foodList);
            formattedSelectedTermList = formattedSelectedTermList.concat(restaurantsList);
            formattedSelectedTermList = formattedSelectedTermList.concat(barsList);
            formattedSelectedTermList = formattedSelectedTermList.concat(breakfastBrunchList);
            setSelectedTermList(formattedSelectedTermList);
          }
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
        }
      });
  }

  const getUserCurrentLatLong = () => {
    navigator.geolocation.getCurrentPosition((location) => {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      log("latitude = ", latitude);
      log("longitude = ", longitude);
      setLatitude(latitude);
      setLongitude(longitude);
    });
  }

  const findLocationTextByLatLong = (latitude, longitude) => {
    axios.get(
      `${ROOT_URL}/restaurant/find-location-text-by-lat-long`,
      {
        params: {
          latitude: latitude,
          longitude: longitude
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
          setLocation(response.data.location.display_name);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
          setSubmitButtonClicked(false);
        }
      });
  }

  const findRestaurantsByLocation = (selectedTerm, location) => {
    axios.get(
      `${ROOT_URL}/restaurant/find-restaurants-by-location`,
      {
        params: {
          term: selectedTerm,
          location: location
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
          setResultList(response.data.restaurants.businesses);
          setSubmitButtonClicked(false);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
          setSubmitButtonClicked(false);
        }
      });
  }

  const findRestaurantsByLatLong = (selectedTerm, latitude, longitude) => {
    axios.get(
      `${ROOT_URL}/restaurant/find-restaurants-by-lat-long`,
      {
        params: {
          term: selectedTerm,
          latitude: latitude,
          longitude: longitude
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
          setResultList(response.data.restaurants.businesses);
          setSubmitButtonClicked(false);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
          setSubmitButtonClicked(false);
        }
      });
  }

  const renderSelectDropdown = () => {
    return (
      <Picker
        selectedValue={selectedTerm}
        style={style.picker}
        onValueChange={(itemValue, itemIndex) => handleDropdownChange(itemValue)}
      >
        {renderDropdownItem()}
      </Picker>
    )
  }

  const renderRadioButton = () => {
    return (
      <View>
        <View style={style.rowContainer}>
          <RadioButton
            color={style.colorPrimary.color}
            value="places"
            status={radioButtonValue === 'places' ? 'checked' : 'unchecked'}
            onPress={() => handleRadioButton('places')}
          />
          <Text style={{ marginTop: 8, marginLeft: 5 }}>Places</Text>
        </View>
        <Divder margin={5} />
        {
          latitude !== 0 && longitude !== 0 ?
            <View style={style.rowContainer}>
              <RadioButton
                color={style.colorPrimary.color}
                value="currentLocation"
                status={radioButtonValue === 'currentLocation' ? 'checked' : 'unchecked'}
                onPress={() => handleRadioButton('currentLocation')}
              />
              <Text style={{ marginTop: 8, marginLeft: 5 }}>Current Location</Text>
            </View>
            :
            <View style={style.rowContainer}>
              <RadioButton
                color={style.colorPrimary.color}
                value="currentLocation"
                disabled={true}
                status={radioButtonValue === 'currentLocation' ? 'checked' : 'unchecked'}
                onPress={() => handleRadioButton('currentLocation')}
              />
              <Text style={{ marginTop: 8, marginLeft: 5 }}>Current Location</Text>
            </View>
        }
      </View>
    );
  }

  const renderLocationInput = () => {
    let locationInput = null;

    if (_.isEqual(radioButtonValue, 'places')) {
      locationInput = (
        <View>
          <TextInput
            style={{ alignSelf: 'stretch', height: 40, borderColor: 'black', borderWidth: 1 }}
            onChangeText={(text) => handleLocationChange(text)}
            value={location}
          />
        </View>
      );
    }

    return locationInput;
  }

  const renderSubmitButton = () => {
    let submitButton = null;

    if (_.isEqual(radioButtonValue, 'places')) {
      if (!_.isEmpty(location)) {
        if (submitButtonClicked === true) {
          submitButton = (
            <Button style={{ alignSelf: 'stretch' }} mode="outlined" color={style.colorAccent.color} disabled={true} onPress={handleSubmit}>
              Loading...
            </Button>
          );
        } else {
          submitButton = (
            <Button style={{ alignSelf: 'stretch' }} mode="outlined" color={style.colorAccent.color} onPress={handleSubmit}>
              Submit
            </Button>
          );
        }
      }
    }

    if (_.isEqual(radioButtonValue, 'currentLocation')) {
      if (submitButtonClicked === true) {
        submitButton = (
          <Button style={{ alignSelf: 'stretch' }} mode="outlined" color={style.colorAccent.color} disabled={true} onPress={handleSubmit}>
            Loading...
          </Button>
        );
      } else {
        submitButton = (
          <Button style={{ alignSelf: 'stretch' }} mode="outlined" color={style.colorAccent.color} onPress={handleSubmit}>
            Submit
          </Button>
        );
      }
    }

    return submitButton;
  }

  const renderClearButton = () => {
    const clearButton = (
      <Button style={{ alignSelf: 'stretch' }} mode="outlined" color={style.colorPrimary.color} onPress={handleClear}>
        Clear
      </Button>
    );

    return clearButton;
  }

  const renderDisplayResult = () => {
    let displayResult = null;

    if (!_.isEmpty(resultList)) {
      displayResult = (
        <View>
          <DisplayResult navigation={navigation} resultList={resultList} isFavourites={false} />
        </View>
      );
    }

    return displayResult;
  }

  const handleDropdownChange = (selectedValue) => {
    if (!_.isEqual(selectedValue, 'Select the food you want...'))
      setSelectedTerm(selectedValue);
  }

  const renderDropdownItem = () => {
    let dropdownItemList = null;

    if (!_.isEmpty(selectedTermList)) {
      dropdownItemList = selectedTermList.map((item, i) => {
        return (
          <Picker.Item key={i} label={item.label} value={item.label} />
        );
      })
    }

    return dropdownItemList;
  }

  const handleRadioButton = (radioButtonValue) => {
    setRadioButtonValue(radioButtonValue);
  }

  const handleLocationChange = (text) => {
    setLocation(text);
  }

  const handleSubmit = () => {
    setResultList([]);
    setSubmitButtonClicked(true);

    if (_.isEqual(radioButtonValue, 'places')) {
      if (!_.isEmpty(location)) {
        const term = !_.isEmpty(selectedTerm) ? selectedTerm : '';
        findRestaurantsByLocation(term, location);
      }
    }

    if (_.isEqual(radioButtonValue, 'currentLocation')) {
      if (latitude !== 0 && longitude !== 0) {
        const term = !_.isEmpty(selectedTerm) ? selectedTerm : '';
        findRestaurantsByLatLong(term, latitude, longitude);
      }
    }
  }

  const handleClear = () => {
    setSelectedTerm('');
    setRadioButtonValue('');

    setResultList([]);
  }

  return (
    <ScrollView style={style.scrollViewContainer}>
      <Card style={style.container}>
        <Image
          style={style.logo}
          source={logo}
          resizeMode={'contain'}
        />
        {renderSelectDropdown()}
        <Divder margin={5} />
        {renderRadioButton()}
        <Divder margin={5} />
        {renderLocationInput()}
        <Divder margin={8} />
        {renderSubmitButton()}
        <Divder margin={8} />
        {renderClearButton()}
      </Card>
      <Divder margin={5} />
      {renderDisplayResult()}
    </ScrollView>
  );
}

export default Home;
