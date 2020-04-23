import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import _ from 'lodash';
import axios from 'axios';
import { getRootUrl, log } from '../../common/Common';

const ROOT_URL = getRootUrl();

import Divder from '../divider/Divider';
import DisplayResult from '../displayResult/DisplayResult';

const style = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#FAFAD2',
  },
  container: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  yourTotalFavouritesText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  favouritesLengthText: {
    fontWeight: 'normal'
  },
  colorPrimary: {
    color: '#ed1f30'
  },
});

function Favourites({ navigation }) {
  const [favourites, setFavourites] = useState([]);

  const [deleteAllFavouritesButtonClicked, setDeleteAllFavouritesButtonClicked] = useState(false);

  useEffect(() => {
    getFavourites();
    detectChangeTab();
  }, []);

  const detectChangeTab = () => {
    navigation.addListener('focus', () => {
      getFavourites();
    });
  }

  const getFavourites = () => {
    axios.get(
      `${ROOT_URL}/favourites/get-favourites`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
          const favourites = response.data.favourites;
          setFavourites(favourites);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
        }
      });
  }

  const handleDeleteAllFavourites = () => {
    setDeleteAllFavouritesButtonClicked(true);

    axios.delete(
      `${ROOT_URL}/favourites/delete-all-favourites`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
          setDeleteAllFavouritesButtonClicked(false);
          getFavourites();
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
          setDeleteAllFavouritesButtonClicked(false);
        }
      });
  }

  const renderDeleteAllFavouritesButton = () => {
    let deleteAllFavouritesButton = (
      <Button mode="contained" color={style.colorPrimary.color} onPress={handleDeleteAllFavourites}>
        Delete All Favourites
      </Button>
    );

    if (deleteAllFavouritesButtonClicked === true) {
      deleteAllFavouritesButton = (
        <Button mode="contained" color={style.colorPrimary.color} disabled={true} onPress={handleDeleteAllFavourites}>
          Loading...
        </Button>
      );
    }

    return deleteAllFavouritesButton;
  }

  const renderDisplayResult = () => {
    let displayResult = null;

    if (!_.isEmpty(favourites)) {
      displayResult = (
        <View>
          <DisplayResult navigation={navigation} resultList={favourites} isFavourites={true} getFavourites={() => getFavourites()} />
        </View>
      );
    }

    return displayResult;
  }

  return (
    <ScrollView style={style.scrollViewContainer}>
      <View style={style.container}>
        <Text style={style.yourTotalFavouritesText}>Your total favourites: <Text style={style.favouritesLengthText}>{favourites ? favourites.length : 0}</Text></Text>
        <Divder margin={5} />
        {renderDeleteAllFavouritesButton()}
      </View>
      {renderDisplayResult()}
    </ScrollView>
  );
}

export default Favourites;
