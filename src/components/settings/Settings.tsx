import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Switch, Card } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import axios from 'axios';
import { getRootUrl } from '../../common/Common';

import Divider from '../divider/Divider';

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
    backgroundColor: 'white',
    marginHorizontal: 30,
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  changeLanguageContainer: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 30,
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
});

function Settings(): JSX.Element {
  const { t, i18n } = useTranslation();

  let defaultLanguage = {};
  if (!_.isEmpty(i18n.language)) {
    switch (i18n.language) {
      case 'eng':
        defaultLanguage = { value: i18n.language, label: t('english') };
        break;
      case 'chi':
        defaultLanguage = { value: i18n.language, label: t('chinese') };
        break;
      default:
        defaultLanguage = { value: 'eng', label: t('english') };
        break;
    }
  }

  const [subscribeStatus, setSubscribeStatus] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const [pushNotificationToken, setPushNotificationToken] = useState('');

  useEffect(() => {
    getAsyncStorageData();
  }, []);

  const getAsyncStorageData = async () => {
    try {
      const pushNotificationToken = await AsyncStorage.getItem('@pushNotificationToken');
      if (pushNotificationToken) {
        setPushNotificationToken(pushNotificationToken);
      }
    } catch (e) {
      console.log('error = ', e.message);
    }
  };

  const handleDropdownChange = (value: string, index: number, data: any) => {
    if (!_.isEmpty(value)) {
      setSelectedLanguage(value);

      switch (value) {
        case 'English' || '英文':
          i18n.changeLanguage('eng');
          break;
        case 'Chinese' || '中文':
          i18n.changeLanguage('chi');
          break;
        default:
      }
    }
  };

  const getDropdownData = () => {
    const languageList = [
      {
        value: 'Please select...',
      },
      {
        value: 'English',
      },
      {
        value: 'Chinese',
      },
    ];

    return languageList;
  };

  const toggleSwitch = () => {
    if (!subscribeStatus) {
      setSubscribeStatus(true);
      subscribeMessage(pushNotificationToken);
    } else {
      setSubscribeStatus(false);
      unsubscribeMessage(pushNotificationToken);
    }
  };

  const subscribeMessage = async (pushNotificationToken: string) => {
    const response = await axios.post(
      `${ROOT_URL}/expo/subscribe-message`,
      {
        pushNotificationTokenList: [pushNotificationToken],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
    }
  };

  const unsubscribeMessage = async (pushNotificationToken: string) => {
    const response = await axios.post(
      `${ROOT_URL}/expo/unsubscribe-message`,
      {
        pushNotificationTokenList: [pushNotificationToken],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
    }
  };

  const renderSelectDropdown = () => {
    let selectDropdown = null;

    const data = getDropdownData();
    if (!_.isEmpty(data)) {
      selectDropdown = (
        <View style={{ flex: 1 }}>
          <Dropdown label={t('selectLanguage')} data={data} onChangeText={handleDropdownChange} />
        </View>
      );
    }

    return selectDropdown;
  };

  return (
    <ScrollView style={style.scrollViewContainer} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="always">
      <Card style={style.container}>
        <Text style={style.titleStyle}>{t('settings')}</Text>

        <Divider margin={10} />

        <View style={style.rowContainer}>
          <Switch color={style.colorPrimary.color} value={subscribeStatus} onValueChange={toggleSwitch} />
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ marginLeft: 10 }}>{t('subscribeMessage')}</Text>
          </View>
        </View>
      </Card>

      <Card style={style.changeLanguageContainer}>
        <Text style={style.titleStyle}>{t('changeLanguage')}</Text>
        {renderSelectDropdown()}
      </Card>
    </ScrollView>
  );
}

export default Settings;
