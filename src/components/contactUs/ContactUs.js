import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, Linking } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { RadioButton, Checkbox, Button } from 'react-native-paper';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { SliderBox } from "react-native-image-slider-box";
import { Table, Row, Rows } from 'react-native-table-component';
import { LiteCreditCardInput } from "react-native-credit-card-input";
import Stripe from 'react-native-stripe-api';
import _ from 'lodash';
import axios from 'axios';
import { getRootUrl, log, getStripeApiKey } from '../../common/Common';

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
  titleStyle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  donateCardViewContainer: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 30
  },
  rowContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start'
  },
  cardViewContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginHorizontal: 30
  },
  restaurantDetailsTitleText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  restaurantDetailsValueText: {
    fontSize: 16,
    fontWeight: 'normal'
  },
  restaurantDetailsUrlValueText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#ed1f30',
  },
  restaurantDetailsLocationValueText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#ed1f30',
    textDecorationLine: 'underline'
  },
  picker: {
    width: 320,
    height: 30
  },
  tableHead: {
    height: 40,
    backgroundColor: '#ed1f30',
  },
  tableHeadText: {
    margin: 6,
    color: 'white'
  },
  tableRowText: {
    margin: 6,
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

  const handleOpenUrl = () => {
    Linking.openURL(`${restaurantDetails.url}`);
  }

  const handleLocationClick = () => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${locationStr}`);
  }

  const renderOpeningTimeTable = () => {
    let table = null;

    let formattedDataList = [];
    let hoursType = '';
    let isOpenNow = '';

    if (!_.isEmpty(restaurantDetails)) {
      const hours = restaurantDetails.hours;
      if (!_.isEmpty(hours)) {
        hours.forEach((item, i) => {
          const open = item.open;
          if (!_.isEmpty(open)) {
            open.forEach((item, i) => {
              let data = [];

              switch (item.day) {
                case 0:
                  item.day = "Mon";
                  break;
                case 1:
                  item.day = "Tue";
                  break;
                case 2:
                  item.day = "Wed";
                  break;
                case 3:
                  item.day = "Thu";
                  break;
                case 4:
                  item.day = "Fri";
                  break;
                case 5:
                  item.day = "Sat";
                  break;
                case 6:
                  item.day = "Sun";
                  break;
                default:

              }
              if (!item.start.includes(':')) {
                item.start = `${item.start.substring(0, 2)}:${item.start.substring(2)}`;
              }
              if (!item.end.includes(':')) {
                item.end = `${item.end.substring(0, 2)}:${item.end.substring(2)}`;
              }
              item.is_overnight = item.is_overnight ? 'yes' : 'no';

              data.push(item.day);
              data.push(item.start);
              data.push(item.end);
              data.push(item.is_overnight);
              formattedDataList.push(data);
            });
          }

          hoursType = item.hours_type;
          isOpenNow = item.is_open_now;
        });
      }
    }

    const tableHead = [
      'Days',
      'Start',
      'End',
      'Is overnight'
    ];
    const tableData = formattedDataList;
    if (!_.isEmpty(tableHead) && !_.isEmpty(tableData)) {
      table = (
        <View>
          <Table borderStyle={{ borderWidth: 1.5, borderColor: 'black' }}>
            <Row data={tableHead} style={style.tableHead} textStyle={style.tableHeadText} />
            <Rows data={tableData} textStyle={style.tableRowText} />
          </Table>
          <Divder margin={5} />
          <View style={style.cardViewContainer}>
            <Text style={style.titleStyle}>Hours type: <Text style={{ fontWeight: 'normal', color: style.colorPrimary.color }}>{hoursType.toLowerCase()}</Text></Text>
            <Divder margin={10} />
            <View style={style.rowContainer}>
              <Checkbox
                status={isOpenNow ? 'checked' : 'unchecked'}
                disabled={true}
              />
              <Text style={{ fontSize: 16, marginTop: 8, marginLeft: 5 }}>is open now</Text>
            </View>
            <Divder margin={10} />
            <Button style={{ alignSelf: 'stretch' }} mode="outlined" color={style.colorPrimary.color} onPress={handleBackToHome}>
              Back to Home
            </Button>
          </View>
        </View>
      );
    }

    return table;
  }

  return (
    <View>
      <View style={{ marginTop: 100 }}>
        <SliderBox
          images={photosList}
          sliderBoxHeight={250}
          dotColor={style.colorPrimary.color}
          inactiveDotColor="lightgray" />
      </View>
      <Divder margin={8} />
      <View style={style.cardViewContainer}>
        <Text style={style.titleStyle}>Restaurant details</Text>
        <Divder margin={10} />
        <Text style={style.restaurantDetailsTitleText}>Name: <Text style={style.restaurantDetailsValueText}>{name}</Text></Text>
        <Divder margin={10} />
        <Text style={style.restaurantDetailsTitleText}>Phone: <Text style={style.restaurantDetailsValueText}>{restaurantDetails.phone}</Text></Text>
        <Divder margin={10} />
        <Text style={style.restaurantDetailsTitleText}>Url: <Text style={style.restaurantDetailsUrlValueText} onPress={handleOpenUrl}>Open Url</Text></Text>
        <Divder margin={10} />
        <Text style={style.restaurantDetailsTitleText}>Location: <Text style={style.restaurantDetailsLocationValueText} onPress={handleLocationClick}>{locationStr}</Text></Text>
      </View>
      {renderOpeningTimeTable()}
    </View >
  );
}

function ContactUs({ navigation, route }) {
  const [radioButtonValue, setRadioButtonValue] = useState('');

  const [currencyList, setCurrencyList] = useState([]);
  const [amount, setAmount] = useState('0');
  const [currency, setCurrency] = useState('');
  const [token, setToken] = useState('');
  const [card, setCard] = useState({});

  const [cardValid, setCardValid] = useState(false);
  const [cardInfoData, setCardInfoData] = useState(null);

  useEffect(() => {
    getCurrencyList();
  }, []);

  useEffect(() => {
    if (!_.isEmpty(amount) && !_.isEmpty(currency) && !_.isEmpty(token) && !_.isEmpty(card)) {
      creditCardPayment(amount, currency, token, card);
      setToken('');
      setCard({});
    }
  }, [amount, currency, token, card]);

  const getCurrencyList = () => {
    const currencyList = [
      { value: 'hkd', label: 'Hong Kong Dollar (HKD)' },
      { value: 'sgd', label: 'Singapore Dollar (SGD)' },
      { value: 'gbp', label: 'British Dollar Pound (GBP)' },
      { value: 'cny', label: 'Chinese Renminbi Yuan (CNY)' },
      { value: 'usd', label: 'US Dollar (USD)' },
    ];
    setCurrencyList(currencyList);
  }

  const handleRadioButton = (radioButtonValue) => {
    setRadioButtonValue(radioButtonValue);
  }

  const handleGithubClick = () => {
    Linking.openURL(`https://github.com/yeukfei02`);
  }

  const handleEmailClick = () => {
    Linking.openURL(`mailto:yeukfei02@gmail.com`);
  }

  const handleDonorboxClick = () => {
    Linking.openURL('https://donorbox.org/donate-for-lunch-picker-better-features-and-development');
  }

  const handleBuyMeACoffeeClick = () => {
    Linking.openURL('https://www.buymeacoffee.com/yeukfei02');
  }

  const handlePayNow = async () => {
    if (!_.isEmpty(amount) && !_.isEmpty(currency) && cardValid) {
      const stripeApiKey = getStripeApiKey();
      const apiKey = stripeApiKey;
      const client = new Stripe(apiKey);

      const token = await client.createToken({
        number: cardInfoData.values.number,
        exp_month: cardInfoData.values.expiry.substring(0, 2),
        exp_year: cardInfoData.values.expiry.substring(3),
        cvc: cardInfoData.values.cvc,
      });
      if (!_.isEmpty(token)) {
        setToken(token.id);
        setCard(token.card);
      }
    }
  }

  const renderResultDiv = () => {
    let resultDiv = null;

    if (_.isEqual(radioButtonValue, 'donorbox')) {
      resultDiv = (
        <Button
          style={{ alignSelf: 'stretch' }}
          mode="contained"
          onPress={handleDonorboxClick}
          title="Donorbox"
          color={style.colorPrimary.color}
        >
          Donorbox
        </Button>
      );
    } else if (_.isEqual(radioButtonValue, 'buyMeACoffee')) {
      resultDiv = (
        <Button
          style={{ alignSelf: 'stretch' }}
          mode="contained"
          onPress={handleBuyMeACoffeeClick}
          title="Buy Me A Coffee"
          color={style.colorPrimary.color}
        >
          Buy Me A Coffee
        </Button>
      );
    } else if (_.isEqual(radioButtonValue, 'stripe')) {
      resultDiv = (
        <View>
          <TextInput
            style={{ alignSelf: 'stretch', height: 40, borderColor: 'black', borderWidth: 1 }}
            onChangeText={(number) => handleAmountChange(number)}
            value={amount}
            keyboardType="numeric"
          />
          <Divder margin={5} />
          <Picker
            selectedValue={currency}
            style={style.picker}
            onValueChange={(itemValue, itemIndex) => handleCurrencyChange(itemValue)}
          >
            {renderDropdownItem()}
          </Picker>
          <Divder margin={5} />
          <LiteCreditCardInput onChange={handleCreditCardInputChange} />
          <Divder margin={5} />
          {renderPaynowButton()}
        </View>
      );
    }

    return resultDiv;
  }

  const renderDropdownItem = () => {
    let dropdownItemList = null;

    if (!_.isEmpty(currencyList)) {
      dropdownItemList = currencyList.map((item, i) => {
        return (
          <Picker.Item key={i} label={item.label} value={item.value} />
        );
      })
    }

    return dropdownItemList;
  }

  const renderPaynowButton = () => {
    let paynowButton = (
      <Button
        onPress={handlePayNow}
        title="Pay now"
        color={style.colorPrimary.color}
        disabled={true}
      >
        Pay now
      </Button>
    );

    if (!_.isEmpty(amount) && !_.isEmpty(currency) && cardValid) {
      paynowButton = (
        <Button
          onPress={handlePayNow}
          title="Pay now"
          color={style.colorPrimary.color}
        >
          Pay now
        </Button>
      );
    }

    return paynowButton;
  }

  const handleAmountChange = (number) => {
    setAmount(number);
  }

  const handleCurrencyChange = (selectedCurrency) => {
    setCurrency(selectedCurrency);

    if (!_.isEmpty(selectedCurrency)) {
      switch (selectedCurrency) {
        case 'hkd':
          setAmount('3');
          break;
        case 'sgd':
          setAmount('1');
          break;
        case 'gbp':
          setAmount('1');
          break;
        case 'cny':
          setAmount('3');
          break;
        case 'usd':
          setAmount('1');
          break;
        default:

      }
    }
  }

  const handleCreditCardInputChange = (inputData) => {
    if (!_.isEmpty(inputData)) {
      if (inputData.valid) {
        setCardInfoData(inputData);
        setCardValid(true);
      } else {
        setCardInfoData(null);
        setCardValid(false);
      }
    }
  }

  const creditCardPayment = (amount, currency, token, card) => {
    axios.post(
      `${ROOT_URL}/stripe/credit-card-payment`,
      {
        amount: Math.round(amount * 100),
        currency: currency,
        token: token,
        card: card
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

  const renderDiv = () => {
    let result = (
      <View>
        <View style={style.container}>
          <Text style={style.titleStyle}>Contact us via email or visit our github repo</Text>
          <Divder margin={5} />
          <View style={style.iconContainer}>
            <AntDesign style={{ marginRight: 15 }} name="github" size={40} color="black" onPress={handleGithubClick} />
            <MaterialIcons name="email" size={40} color="black" onPress={handleEmailClick} />
          </View>
        </View>

        <View style={style.donateCardViewContainer}>
          <Text style={style.titleStyle}>Donate for lunch picker better features and development</Text>

          <Divder margin={5} />

          <View style={style.rowContainer}>
            <RadioButton
              color={style.colorPrimary.color}
              value="places"
              status={radioButtonValue === 'donorbox' ? 'checked' : 'unchecked'}
              onPress={() => handleRadioButton('donorbox')}
            />
            <Text style={{ marginTop: 8, marginLeft: 8 }}>Donorbox</Text>
          </View>

          <Divder margin={5} />

          <View style={style.rowContainer}>
            <RadioButton
              color={style.colorPrimary.color}
              value="places"
              status={radioButtonValue === 'buyMeACoffee' ? 'checked' : 'unchecked'}
              onPress={() => handleRadioButton('buyMeACoffee')}
            />
            <Text style={{ marginTop: 8, marginLeft: 8 }}>Buy Me A Coffee</Text>
          </View>

          <Divder margin={5} />

          <View style={style.rowContainer}>
            <RadioButton
              color={style.colorPrimary.color}
              value="places"
              status={radioButtonValue === 'stripe' ? 'checked' : 'unchecked'}
              onPress={() => handleRadioButton('stripe')}
            />
            <Text style={{ marginTop: 8, marginLeft: 8 }}>Stripe</Text>
          </View>

          <Divder margin={8} />
          {renderResultDiv()}
        </View>
      </View>
    );

    if (!_.isEmpty(route) && !_.isEmpty(route.params) && !_.isEmpty(route.params.id)) {
      result = (
        <View>
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
