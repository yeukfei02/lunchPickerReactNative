import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Image, Picker, Text, TextInput, Button } from 'react-native';
import { RadioButton } from 'react-native-paper';
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
    padding: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  logo: {
    width: '100%',
    height: 180,
  },
  picker: {
    width: 380,
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
        <RadioButton
          value="places"
          status={radioButtonValue === 'places' ? 'checked' : 'unchecked'}
          onPress={() => handleRadioButton('places')}
        />
        <Text>Places</Text>
        {
          latitude !== 0 && longitude !== 0 ?
            <View>
              <RadioButton
                value="currentLocation"
                status={radioButtonValue === 'currentLocation' ? 'checked' : 'unchecked'}
                onPress={() => handleRadioButton('currentLocation')}
              />
              <Text>Current Location</Text>
            </View>
            :
            <View>
              <RadioButton
                value="currentLocation"
                disabled={true}
                status={radioButtonValue === 'currentLocation' ? 'checked' : 'unchecked'}
                onPress={() => handleRadioButton('currentLocation')}
              />
              <Text>Current Location</Text>
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
            style={{ height: 40, borderColor: 'black', borderWidth: 1 }}
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
            <Button
              onPress={handleSubmit}
              title="Loading..."
              disabled={true}
              color={style.colorAccent.color}
            >
              Loading...
            </Button>
          );
        } else {
          submitButton = (
            <Button
              onPress={handleSubmit}
              title="Submit"
              color={style.colorAccent.color}
            >
              Submit
            </Button>
          );
        }
      }
    }

    if (_.isEqual(radioButtonValue, 'currentLocation')) {
      if (submitButtonClicked === true) {
        submitButton = (
          <Button
            onPress={handleSubmit}
            title="Loading..."
            disabled={true}
            color={style.colorAccent.color}
          >
            Loading...
          </Button>
        );
      } else {
        submitButton = (
          <Button
            onPress={handleSubmit}
            title="Submit"
            color={style.colorAccent.color}
          >
            Submit
          </Button>
        );
      }
    }

    return submitButton;
  }

  const renderClearButton = () => {
    const clearButton = (
      <Button
        onPress={handleClear}
        title="Clear"
        color={style.colorPrimary.color}
      >
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
      <View style={style.container}>
        <Divder margin={5} />
        <Image
          style={style.logo}
          source={logo}
          resizeMode={'cover'}
        />
        <Divder margin={5} />
        {renderSelectDropdown()}
        {renderRadioButton()}
        <Divder margin={5} />
        {renderLocationInput()}
        <Divder margin={5} />
        {renderSubmitButton()}
        <Divder margin={5} />
        {renderClearButton()}
      </View>
      <Divder margin={5} />
      {renderDisplayResult()}
    </ScrollView>
  );
}

export default Home;
