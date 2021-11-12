import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View, Text, RefreshControl } from 'react-native';
import { Button, Switch, FAB } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
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
    marginTop: 70,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginHorizontal: 30,
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  currentFoodCategoryValueStyle: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  colorPrimary: {
    color: '#ed1f30',
  },
  fab: {
    backgroundColor: '#ed1f30',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

function RandomFood(props: any): JSX.Element {
  const scrollRef = useRef<ScrollView>();
  const { t } = useTranslation();

  const [useRandomFoodCategory, setUseRandomFoodCategory] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState('');

  const [randomFoodList, setRandomFoodList] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [refreshButtonClicked, setRefreshButtonClicked] = useState(false);

  const [resultList, setResultList] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getRandomFoodList();
    getUserCurrentLatLong();
  }, []);

  useEffect(() => {
    const selectedTerm = _.sample(randomFoodList);
    setSelectedTerm(selectedTerm as any);
    if (latitude !== 0 && longitude !== 0)
      findRestaurantsByLatLong(useRandomFoodCategory, selectedTerm as any, latitude, longitude);
  }, [useRandomFoodCategory, randomFoodList, latitude, longitude]);

  const getRandomFoodList = async () => {
    const response = await axios.get(`${rootUrl}/category/get-categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
      if (!_.isEmpty(response.data.categories)) {
        const randomFoodList: any = [];
        response.data.categories.forEach((item: any, i: number) => {
          if (!_.isEmpty(item.parent_aliases)) {
            const parentAliases = item.parent_aliases[0];
            if (
              _.isEqual(parentAliases, 'food') ||
              _.isEqual(parentAliases, 'restaurants') ||
              _.isEqual(parentAliases, 'bars') ||
              _.isEqual(parentAliases, 'breakfast_brunch')
            ) {
              randomFoodList.push(item);
            }
          }
        });
        const formattedRandomFoodList = randomFoodList.map((item: any, i: number) => {
          return item.title;
        });
        setRandomFoodList(formattedRandomFoodList);
      }
    }
  };

  const getUserCurrentLatLong = () => {
    navigator.geolocation.getCurrentPosition((location) => {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      setLatitude(latitude);
      setLongitude(longitude);
    });
  };

  const findRestaurantsByLatLong = async (
    useRandomFoodCategory: boolean,
    selectedTerm: string,
    latitude: number,
    longitude: number,
  ) => {
    const response = await axios.get(`${rootUrl}/restaurant/find-restaurants-by-lat-long`, {
      params: {
        term: useRandomFoodCategory === true ? selectedTerm : '',
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
      setRefreshButtonClicked(false);
    }
  };

  const handleRefresh = () => {
    setResultList([]);
    setRefreshButtonClicked(true);

    const selectedTerm = _.sample(randomFoodList) as any;
    setSelectedTerm(selectedTerm);
    if (latitude !== 0 && longitude !== 0) {
      findRestaurantsByLatLong(useRandomFoodCategory, selectedTerm, latitude, longitude);
    }
  };

  const renderCurrentFoodCategory = () => {
    let currentFoodCategory = null;

    if (useRandomFoodCategory) {
      currentFoodCategory = (
        <Text style={style.titleStyle}>
          {t('currentFoodCategory')} <Text style={style.currentFoodCategoryValueStyle}>{selectedTerm}</Text>
        </Text>
      );
    }

    return currentFoodCategory;
  };

  const renderRefreshButton = () => {
    let refreshButton = null;

    if (refreshButtonClicked === true) {
      refreshButton = (
        <Button mode="contained" color={style.colorPrimary.color} disabled={true} onPress={handleRefresh}>
          {t('loading')}
        </Button>
      );
    } else {
      refreshButton = (
        <Button mode="contained" color={style.colorPrimary.color} onPress={handleRefresh}>
          {t('refresh')}
        </Button>
      );
    }

    return refreshButton;
  };

  const toggleSwitch = () => {
    if (!useRandomFoodCategory) setUseRandomFoodCategory(true);
    else setUseRandomFoodCategory(false);
  };

  const renderDisplayResult = () => {
    let displayResult = null;

    if (!_.isEmpty(resultList)) {
      displayResult = (
        <View>
          <DisplayResult navigation={props.navigation} resultList={resultList} isFavourites={false} />
          <FAB style={style.fab} icon="chevron-up" onPress={() => handleFABButtonClick()} />
        </View>
      );
    }

    return displayResult;
  };

  const onRefresh = () => {
    setRefreshing(true);
    getRandomFoodList();

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleFABButtonClick = () => {
    scrollRef.current?.scrollTo({
      y: 0,
    });
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={style.scrollViewContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ed1f30', '#ed1f30', '#2b76f0']} />
      }
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="always"
    >
      <View style={style.container}>
        {renderCurrentFoodCategory()}

        <Divider margin={8} />

        <View style={style.rowContainer}>
          <Switch color={style.colorPrimary.color} value={useRandomFoodCategory} onValueChange={toggleSwitch} />
          <Text style={{ marginLeft: 5, fontSize: 18, alignSelf: 'center' }}>{t('useRandomFoodCategory')}</Text>
        </View>

        <Divider margin={8} />

        {renderRefreshButton()}
      </View>

      <Divider margin={5} />

      {renderDisplayResult()}
    </ScrollView>
  );
}

export default RandomFood;
