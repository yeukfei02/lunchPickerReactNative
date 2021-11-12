import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { Checkbox, Button, Card } from 'react-native-paper';
import { SliderBox } from 'react-native-image-slider-box';
import { Table, Row, Rows } from 'react-native-table-component';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import axios from 'axios';
import { getRootUrl } from '../../helpers/helpers';

import Divider from '../divider/Divider';

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 30,
  },
  backArrowImage: {
    marginTop: 60,
    marginBottom: 30,
    marginHorizontal: 15,
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantDetailsTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  restaurantDetailsValueText: {
    fontSize: 16,
    fontWeight: 'normal',
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
    textDecorationLine: 'underline',
  },
  rowContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  cardViewContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    marginVertical: 15,
    marginHorizontal: 30,
  },
  tableHead: {
    height: 40,
    backgroundColor: '#ed1f30',
  },
  tableHeadText: {
    margin: 6,
    color: 'white',
  },
  tableRowText: {
    margin: 6,
  },
  colorPrimary: {
    color: '#ed1f30',
  },
});

function RestaurantDetails(props: any): JSX.Element {
  const { t } = useTranslation();

  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [photosList, setPhotosList] = useState([]);
  const [name, setName] = useState('');
  const [locationStr, setLocationStr] = useState('');

  useEffect(() => {
    if (!_.isEmpty(props.route.params)) {
      getRestaurantsDetailsById(props.route.params.id);
    }
  }, [props.route.params]);

  const getRestaurantsDetailsById = async (id: string) => {
    const response = await axios.get(`${rootUrl}/restaurant/get-restaurant-details/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
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
  };

  const handleBackToHome = (navigation: any) => {
    navigation.navigate('TabView', {
      screen: t('home'),
    });
  };

  const handleOpenUrl = () => {
    Linking.openURL(`${(restaurantDetails as any).url}`);
  };

  const handleLocationClick = () => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${locationStr}`);
  };

  const renderOpeningTimeTable = () => {
    let table = null;

    const formattedDataList: any[] = [];
    let hoursType = '';
    let isOpenNow = '';

    if (!_.isEmpty(restaurantDetails)) {
      const hours = (restaurantDetails as any).hours;
      if (!_.isEmpty(hours)) {
        hours.forEach((item: any, i: number) => {
          const open = item.open;
          if (!_.isEmpty(open)) {
            open.forEach((item: any, i: number) => {
              const data = [];

              switch (item.day) {
                case 0:
                  item.day = 'Mon';
                  break;
                case 1:
                  item.day = 'Tue';
                  break;
                case 2:
                  item.day = 'Wed';
                  break;
                case 3:
                  item.day = 'Thu';
                  break;
                case 4:
                  item.day = 'Fri';
                  break;
                case 5:
                  item.day = 'Sat';
                  break;
                case 6:
                  item.day = 'Sun';
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

    const tableHead = ['Days', 'Start', 'End', 'Is overnight'];
    const tableData = formattedDataList;
    if (!_.isEmpty(tableHead) && !_.isEmpty(tableData)) {
      table = (
        <Card style={style.cardViewContainer}>
          <Table borderStyle={{ borderWidth: 1.5, borderColor: 'black' }}>
            <Row data={tableHead} style={style.tableHead} textStyle={style.tableHeadText} />
            <Rows data={tableData} textStyle={style.tableRowText} />
          </Table>

          <Divider margin={10} />

          <Text style={style.titleStyle}>
            {t('hoursType')}{' '}
            <Text style={{ fontWeight: 'normal', color: style.colorPrimary.color }}>{hoursType.toLowerCase()}</Text>
          </Text>

          <Divider margin={8} />

          <View style={style.rowContainer}>
            <Checkbox status={isOpenNow ? 'checked' : 'unchecked'} disabled={true} />
            <Text style={{ fontSize: 16, marginTop: 8, marginLeft: 5 }}>{t('isOpenNow')}</Text>
          </View>

          <Divider margin={10} />

          <Button
            style={{ alignSelf: 'stretch' }}
            mode="outlined"
            color={style.colorPrimary.color}
            onPress={() => handleBackToHome(props.navigation)}
          >
            {t('backToHome')}
          </Button>
        </Card>
      );
    }

    return table;
  };

  return (
    <ScrollView style={style.scrollViewContainer} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="always">
      <View>
        <TouchableOpacity onPress={() => handleBackToHome(props.navigation)}>
          <View style={style.backArrowImage}>
            <MaterialIcons name="arrow-back" size={30} color={style.colorPrimary.color} />
          </View>
        </TouchableOpacity>

        <View>
          <SliderBox
            images={photosList}
            sliderBoxHeight={250}
            dotColor={style.colorPrimary.color}
            inactiveDotColor="lightgray"
          />
        </View>

        <Divider margin={8} />

        <Card style={style.cardViewContainer}>
          <Text style={style.titleStyle}>{t('restaurantDetails')}</Text>

          <Divider margin={10} />

          <Text style={style.restaurantDetailsTitleText}>
            {t('name')} <Text style={style.restaurantDetailsValueText}>{name}</Text>
          </Text>

          <Divider margin={10} />

          <Text style={style.restaurantDetailsTitleText}>
            {t('phone')} <Text style={style.restaurantDetailsValueText}>{(restaurantDetails as any).phone}</Text>
          </Text>

          <Divider margin={10} />

          <Text style={style.restaurantDetailsTitleText}>
            {t('url')}{' '}
            <Text style={style.restaurantDetailsUrlValueText} onPress={handleOpenUrl}>
              Open Url
            </Text>
          </Text>

          <Divider margin={10} />

          <Text style={style.restaurantDetailsTitleText}>
            {t('location')}{' '}
            <Text style={style.restaurantDetailsLocationValueText} onPress={handleLocationClick}>
              {locationStr}
            </Text>
          </Text>
        </Card>

        {renderOpeningTimeTable()}
      </View>
    </ScrollView>
  );
}

export default RestaurantDetails;
