import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Picker } from 'react-native';
import { Card } from 'react-native-material-ui';
import _ from 'lodash';
import axios from 'axios';
import { getRootUrl, log } from '../../common/Common';

import logo from '../../images/logo2.png';

const ROOT_URL = getRootUrl();

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAD2',
  },
  logo: {
    width: 380,
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

function Home() {
  const [selectedTermList, setSelectedTermList] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');

  useEffect(() => {
    getSelectedTermList();
  }, []);

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
            let formattedSelectedTermList = [];
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

  const handleDropdownChange = (selectedValue) => {
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

  return (
    <View style={style.container}>
      <Card>
        <Image
          style={style.logo}
          source={{
            uri: logo
          }}
        />
        <Picker
          selectedValue={selectedTerm}
          style={style.picker}
          onValueChange={(itemValue, itemIndex) => handleDropdownChange(itemValue)}
        >
          {renderDropdownItem()}
        </Picker>
      </Card>
    </View>
  );
}

export default Home;
