import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, RefreshControl } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RadioButton, Button, Card, TextInput, FAB } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import _ from 'lodash';
import axios from 'axios';
import { getRootUrl } from '../../helpers/helpers';

import Divider from '../divider/Divider';
import DisplayResult from '../displayResult/DisplayResult';

const rootUrl = getRootUrl();

const style = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#FAFAD2',
  },
  container: {
    flex: 1,
    marginTop: 100,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 30,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  logo: {
    width: 300,
    height: 200,
  },
  colorPrimary: {
    color: '#ed1f30',
  },
  colorPrimaryDark: {
    color: '#ffcc0000',
  },
  colorAccent: {
    color: '#2b76f0',
  },
  fab: {
    backgroundColor: '#ed1f30',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

function Home(props: any): JSX.Element {
  const { t } = useTranslation();

  const [selectedTermList, setSelectedTermList] = useState<any[]>([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [radioButtonValue, setRadioButtonValue] = useState('places');

  const [location, setLocation] = useState<string>(t('enterLocation'));
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [resultList, setResultList] = useState([]);

  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getSelectedTermList();
    getUserCurrentLatLong();
  }, []);

  useEffect(() => {
    if (latitude !== 0 && longitude !== 0) findLocationTextByLatLong(latitude, longitude);
  }, [latitude, longitude]);

  const getSelectedTermList = async () => {
    const response = await axios.get(`${rootUrl}/category/get-categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
      if (!_.isEmpty(response.data.categories)) {
        let foodList: any[] = [];
        let restaurantsList: any[] = [];
        let barsList: any[] = [];
        let breakfastBrunchList: any[] = [];
        response.data.categories.forEach((item: any, i: number) => {
          if (!_.isEmpty(item.parent_aliases)) {
            const parentAliases = item.parent_aliases[0];
            if (_.isEqual(parentAliases, 'food')) {
              foodList.push(item);
            }
            if (_.isEqual(parentAliases, 'restaurants')) {
              restaurantsList.push(item);
            }
            if (_.isEqual(parentAliases, 'bars')) {
              barsList.push(item);
            }
            if (_.isEqual(parentAliases, 'breakfast_brunch')) {
              breakfastBrunchList.push(item);
            }
          }
        });

        if (!_.isEmpty(foodList)) {
          foodList = foodList.map((item, i) => {
            const optionsObj = {
              value: item.alias,
              label: item.title,
            };
            return optionsObj;
          });
        }
        if (!_.isEmpty(restaurantsList)) {
          restaurantsList = restaurantsList.map((item, i) => {
            const optionsObj = {
              value: item.alias,
              label: item.title,
            };
            return optionsObj;
          });
        }
        if (!_.isEmpty(barsList)) {
          barsList = barsList.map((item, i) => {
            const optionsObj = {
              value: item.alias,
              label: item.title,
            };
            return optionsObj;
          });
        }
        if (!_.isEmpty(breakfastBrunchList)) {
          breakfastBrunchList = breakfastBrunchList.map((item, i) => {
            const optionsObj = {
              value: item.alias,
              label: item.title,
            };
            return optionsObj;
          });
        }
        let formattedSelectedTermList: any[] = [];
        formattedSelectedTermList = formattedSelectedTermList.concat(foodList);
        formattedSelectedTermList = formattedSelectedTermList.concat(restaurantsList);
        formattedSelectedTermList = formattedSelectedTermList.concat(barsList);
        formattedSelectedTermList = formattedSelectedTermList.concat(breakfastBrunchList);
        setSelectedTermList(formattedSelectedTermList);
      }
    }
  };

  const getUserCurrentLatLong = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('status = ', status);
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    } else {
      const location = await Location.getCurrentPositionAsync({});
      console.log('location = ', location);

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      console.log('latitude = ', latitude);
      console.log('longitude = ', longitude);
      setLatitude(latitude);
      setLongitude(longitude);
    }
  };

  const findLocationTextByLatLong = async (latitude: number, longitude: number) => {
    const response = await axios.get(`${rootUrl}/restaurant/find-location-text-by-lat-long`, {
      params: {
        latitude: latitude,
        longitude: longitude,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
      setLocation(response.data.location.display_name);
    }
  };

  const findRestaurantsByLocation = async (searchText: string, location: any) => {
    const response = await axios.get(`${rootUrl}/restaurant/find-restaurants-by-location`, {
      params: {
        term: searchText,
        location: location,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
      setResultList(response.data.restaurants.businesses);
      setSubmitButtonClicked(false);
    }
  };

  const findRestaurantsByLatLong = async (searchText: string, latitude: number, longitude: number) => {
    const response = await axios.get(`${rootUrl}/restaurant/find-restaurants-by-lat-long`, {
      params: {
        term: searchText,
        latitude: latitude,
        longitude: longitude,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
      setResultList(response.data.restaurants.businesses);
      setSubmitButtonClicked(false);
    }
  };

  const handleDropdownChange = (value: string, index: number, data: any) => {
    if (!_.isEmpty(value)) {
      setSelectedTerm(value);
      setInputValue('');
    }
  };

  const handleInputChange = (text: string) => {
    setSelectedTerm('');
    setInputValue(text);
  };

  const renderSelectDropdown = () => {
    let selectDropdown = null;

    const data: any = getDropdownData();
    if (!_.isEmpty(data)) {
      selectDropdown = (
        <View style={{ flex: 1 }}>
          <Dropdown label={t('selectTheFoodYouWant')} data={data} onChangeText={handleDropdownChange} />
        </View>
      );
    }

    return selectDropdown;
  };

  const renderInput = () => {
    const input = (
      <View style={{ flex: 1 }}>
        <TextInput
          mode="outlined"
          label={t('enterFoodHere')}
          value={inputValue}
          placeholder="Food Name"
          onChangeText={(text) => handleInputChange(text)}
        />
      </View>
    );
    return input;
  };

  const renderRadioButton = () => {
    return (
      <View>
        <View style={style.rowContainer}>
          <View style={style.rowContainer}>
            <RadioButton
              color={style.colorPrimary.color}
              value="places"
              status={radioButtonValue === 'places' ? 'checked' : 'unchecked'}
              onPress={() => handleRadioButton('places')}
            />
            <Text style={{ marginTop: 8, marginLeft: 5 }}>{t('places')}</Text>
          </View>
          <Divider margin={5} />
          {latitude !== 0 && longitude !== 0 ? (
            <View style={style.rowContainer}>
              <RadioButton
                color={style.colorPrimary.color}
                value="currentLocation"
                status={radioButtonValue === 'currentLocation' ? 'checked' : 'unchecked'}
                onPress={() => handleRadioButton('currentLocation')}
              />
              <Text style={{ marginTop: 8, marginLeft: 5 }}>{t('currentLocation')}</Text>
            </View>
          ) : (
            <View style={style.rowContainer}>
              <RadioButton
                color={style.colorPrimary.color}
                value="currentLocation"
                disabled={true}
                status={radioButtonValue === 'currentLocation' ? 'checked' : 'unchecked'}
                onPress={() => handleRadioButton('currentLocation')}
              />
              <Text style={{ marginTop: 8, marginLeft: 5 }}>{t('currentLocation')}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderLocationInput = () => {
    let locationInput = null;

    if (_.isEqual(radioButtonValue, 'places')) {
      locationInput = (
        <View>
          <TextInput
            mode="outlined"
            label="Location"
            value={location}
            placeholder="address, city, place, street name, zip code, country, state, building name, etc..."
            onChangeText={(text) => handleLocationChange(text)}
          />
          <Divider margin={8} />
          {renderSubmitButton()}
          <Divider margin={8} />
          {renderClearButton()}
        </View>
      );
    }

    return locationInput;
  };

  const renderButtons = () => {
    let buttons = null;

    if (_.isEqual(radioButtonValue, 'currentLocation')) {
      buttons = (
        <View>
          <Divider margin={8} />
          {renderSubmitButton()}
          <Divider margin={8} />
          {renderClearButton()}
        </View>
      );
    }

    return buttons;
  };

  const renderSubmitButton = () => {
    let submitButton = null;

    if (_.isEqual(radioButtonValue, 'places')) {
      if (!_.isEmpty(location)) {
        if (submitButtonClicked === true) {
          submitButton = (
            <Button
              style={{ alignSelf: 'stretch' }}
              mode="outlined"
              color={style.colorAccent.color}
              disabled={true}
              onPress={handleSubmit}
            >
              {t('loading')}
            </Button>
          );
        } else {
          submitButton = (
            <Button
              style={{ alignSelf: 'stretch' }}
              mode="outlined"
              color={style.colorAccent.color}
              onPress={handleSubmit}
            >
              {t('submit')}
            </Button>
          );
        }
      }
    }

    if (_.isEqual(radioButtonValue, 'currentLocation')) {
      if (submitButtonClicked === true) {
        submitButton = (
          <Button
            style={{ alignSelf: 'stretch' }}
            mode="outlined"
            color={style.colorAccent.color}
            disabled={true}
            onPress={handleSubmit}
          >
            {t('loading')}
          </Button>
        );
      } else {
        submitButton = (
          <Button
            style={{ alignSelf: 'stretch' }}
            mode="outlined"
            color={style.colorAccent.color}
            onPress={handleSubmit}
          >
            {t('submit')}
          </Button>
        );
      }
    }

    return submitButton;
  };

  const renderClearButton = () => {
    const clearButton = (
      <Button style={{ alignSelf: 'stretch' }} mode="outlined" color={style.colorPrimary.color} onPress={handleClear}>
        {t('clear')}
      </Button>
    );

    return clearButton;
  };

  const renderDisplayResult = () => {
    let displayResult = null;

    if (!_.isEmpty(resultList)) {
      displayResult = (
        <View>
          <DisplayResult navigation={props.navigation} resultList={resultList} isFavourites={false} />
          {/* <FAB style={style.fab} icon="chevron-up" onPress={() => handleFABButtonClick()} /> */}
        </View>
      );
    }

    return displayResult;
  };

  const getDropdownData = () => {
    let dropdownItemList = null;

    if (!_.isEmpty(selectedTermList)) {
      dropdownItemList = selectedTermList.map((item, i) => {
        const obj = {
          value: item.label,
        };
        return obj;
      });
    }

    return dropdownItemList;
  };

  const handleRadioButton = (radioButtonValue: string) => {
    setRadioButtonValue(radioButtonValue);
  };

  const handleLocationChange = (text: string) => {
    setLocation(text);
  };

  const handleSubmit = async () => {
    setResultList([]);
    setSubmitButtonClicked(true);

    if (_.isEqual(radioButtonValue, 'places')) {
      if (!_.isEmpty(location)) {
        let searchText = '';
        if (!_.isEmpty(selectedTerm)) {
          searchText = selectedTerm;
        }
        if (!_.isEmpty(inputValue)) {
          searchText = inputValue;
        }

        await findRestaurantsByLocation(searchText, location);
      }
    }

    if (_.isEqual(radioButtonValue, 'currentLocation')) {
      if (latitude !== 0 && longitude !== 0) {
        let searchText = '';
        if (!_.isEmpty(selectedTerm)) {
          searchText = selectedTerm;
        }
        if (!_.isEmpty(inputValue)) {
          searchText = inputValue;
        }

        await findRestaurantsByLatLong(searchText, latitude, longitude);
      }
    }
  };

  const handleClear = () => {
    setSelectedTerm('');
    setInputValue('');
    setRadioButtonValue('');

    setResultList([]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    handleClear();

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // const handleFABButtonClick = () => {
  //   scrollRef.current?.scrollTo({
  //     y: 0,
  //   });
  // };

  return (
    <KeyboardAwareScrollView
      style={style.scrollViewContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ed1f30', '#ed1f30', '#2b76f0']} />
      }
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="always"
      resetScrollToCoords={{ x: 0, y: 0 }}
    >
      <Card style={style.container}>
        <Image style={style.logo} source={require('../../images/logo2.png')} resizeMode={'contain'} />

        {renderSelectDropdown()}

        <Divider margin={5} />

        {renderInput()}

        <Divider margin={5} />

        {renderRadioButton()}

        <Divider margin={5} />

        {renderLocationInput()}

        {renderButtons()}
      </Card>

      <Divider margin={5} />

      {renderDisplayResult()}
    </KeyboardAwareScrollView>
  );
}

export default Home;
