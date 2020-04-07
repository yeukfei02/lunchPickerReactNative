import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Picker, Switch } from 'react-native';
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

function Settings() {
  const [subscribeStatus, setSubscribeStatus] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('eng');

  const handleDropdownChange = (selectedLanguage) => {
    setSelectedLanguage(selectedLanguage);
  }

  const renderDropdownItem = () => {
    let dropdownItemList = null;

    const languageList = [
      {
        label: 'English',
        value: 'eng'
      },
      {
        label: 'Chinese',
        value: 'chi'
      },
    ];

    if (!_.isEmpty(languageList)) {
      dropdownItemList = languageList.map((item, i) => {
        return (
          <Picker.Item key={i} label={item.label} value={item.value} />
        );
      })
    }

    return dropdownItemList;
  }

  const toggleSwitch = () => {
    if (!subscribeStatus)
      setSubscribeStatus(true);
    else
      setSubscribeStatus(false);
  }

  return (
    <ScrollView style={style.scrollViewContainer}>
      <View style={style.container}>
        <Text style={style.titleStyle}>Settings</Text>
        <Divder margin={10} />
        <View style={style.rowContainer}>
          <Switch
            trackColor={{ false: 'lightgray', true: style.colorPrimary.color }}
            thumbColor={subscribeStatus ? style.colorPrimary.color : 'lightgray'}
            ios_backgroundColor="lightgray"
            onValueChange={toggleSwitch}
            value={subscribeStatus}
          />
          <Text style={{ marginTop: 4, marginLeft: 10 }}>Subscribe message</Text>
        </View>
      </View>

      <View style={style.changeLanguageContainer}>
        <Text style={style.titleStyle}>Change Language</Text>
        <Divder margin={12} />
        <Picker
          selectedValue={selectedLanguage}
          style={style.picker}
          onValueChange={(itemValue, itemIndex) => handleDropdownChange(itemValue)}
        >
          {renderDropdownItem()}
        </Picker>
      </View>
    </ScrollView>
  );
}

export default Settings;
