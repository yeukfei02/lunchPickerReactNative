import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Switch, Card } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';
import _ from 'lodash';

import Divder from '../divider/Divider';

const style = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#FAFAD2',
  },
  container: {
    flex: 1,
    marginTop: 100,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginHorizontal: 30
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  rowContainer: {
    flexDirection: 'row'
  },
  changeLanguageContainer: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginHorizontal: 30
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

function Settings() {
  const [subscribeStatus, setSubscribeStatus] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('eng');

  const handleDropdownChange = (value, index, data) => {
    if (value)
      setSelectedLanguage(value);
  }

  const getDropdownData = () => {
    const languageList = [
      {
        value: 'Please select...'
      },
      {
        value: 'English'
      },
      {
        value: 'Chinese'
      },
    ];

    return languageList;
  }

  const toggleSwitch = () => {
    if (!subscribeStatus)
      setSubscribeStatus(true);
    else
      setSubscribeStatus(false);
  }

  const renderSelectDropdown = () => {
    let selectDropdown = null;

    const data = getDropdownData();
    if (!_.isEmpty(data)) {
      selectDropdown = (
        <Dropdown
          label='Select language'
          data={data}
          onChangeText={handleDropdownChange}
        />
      );
    }

    return selectDropdown;
  }

  return (
    <ScrollView style={style.scrollViewContainer}>
      <Card style={style.container}>
        <Text style={style.titleStyle}>Settings</Text>
        <Divder margin={10} />
        <View style={style.rowContainer}>
          <Switch
            color={style.colorPrimary.color}
            value={subscribeStatus}
            onValueChange={toggleSwitch}
          />
          <Text style={{ marginTop: 4, marginLeft: 10 }}>Subscribe message</Text>
        </View>
      </Card>

      <Card style={style.changeLanguageContainer}>
        <Text style={style.titleStyle}>Change Language</Text>
        {renderSelectDropdown()}
      </Card>
    </ScrollView>
  );
}

export default Settings;
