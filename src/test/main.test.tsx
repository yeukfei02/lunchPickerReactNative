import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount } from 'enzyme';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

import MainView from '../components/mainView/MainView';

import Home from '../components/home/Home';
import RandomFood from '../components/randomFood/RandomFood';
import Favourites from '../components/favourites/Favourites';
import Settings from '../components/settings/Settings';
import ContactUs from '../components/contactUs/ContactUs';

import CardView from '../components/cardView/CardView';
import DisplayResult from '../components/displayResult/DisplayResult';
import Divider from '../components/divider/Divider';

import RestaurantDetails from '../components/restaurantDetails/RestaurantDetails';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: any) => key,
    i18n: (key: any) => key,
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

describe('main.test', () => {
  describe('render test', () => {
    it('MainView', () => {
      const wrapper = shallow(<MainView />);
      expect(wrapper).toMatchSnapshot();
    });

    it('Home', () => {
      const wrapper = shallow(<Home />);
      expect(wrapper).toMatchSnapshot();
    });

    it('RandomFood', () => {
      const wrapper = shallow(<RandomFood />);
      expect(wrapper).toMatchSnapshot();
    });

    it('Favourites', () => {
      const wrapper = shallow(<Favourites />);
      expect(wrapper).toMatchSnapshot();
    });

    it('Settings', () => {
      const wrapper = shallow(<Settings />);
      expect(wrapper).toMatchSnapshot();
    });

    it('ContactUs', () => {
      const wrapper = shallow(<ContactUs />);
      expect(wrapper).toMatchSnapshot();
    });

    // it('CardView', () => {
    //   const wrapper = shallow(<CardView />);
    //   expect(wrapper).toMatchSnapshot();
    // });

    it('DisplayResult', () => {
      const wrapper = shallow(<DisplayResult />);
      expect(wrapper).toMatchSnapshot();
    });

    it('Divider', () => {
      const wrapper = shallow(<Divider />);
      expect(wrapper).toMatchSnapshot();
    });

    // it('RestaurantDetails', () => {
    //   const wrapper = shallow(<RestaurantDetails />);
    //   expect(wrapper).toMatchSnapshot();
    // });
  });
});
