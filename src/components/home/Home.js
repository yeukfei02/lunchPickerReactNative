import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Card } from 'react-native-material-ui';

import logo from '../../images/logo2.png';

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
  return (
    <View style={style.container}>
      <Card>
        <Image
          style={style.logo}
          source={{
            uri: logo
          }}
        />
        <Text>Home</Text>
      </Card>
    </View>
  );
}

export default Home;
