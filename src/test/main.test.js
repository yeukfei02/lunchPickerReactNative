import React from 'react';
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

import Home from '../components/home/Home';
import RandomFood from '../components/randomFood/RandomFood';
import Favourites from '../components/favourites/Favourites';
import Settings from '../components/settings/Settings';
import ContactUs from '../components/contactUs/ContactUs';

import CardView from '../components/cardView/CardView';
import DisplayResult from '../components/displayResult/DisplayResult';
import Divider from '../components/divider/Divider';

describe('main.test', () => {
  describe('render test', () => {
    it('Home', () => {
      shallow(<Home />);
    });

    it('RandomFood', () => {
      shallow(<RandomFood />);
    });

    it('Favourites', () => {
      shallow(<Favourites />);
    });

    it('Settings', () => {
      shallow(<Settings />);
    });

    it('ContactUs', () => {
      shallow(<ContactUs />);
    });

    it('CardView', () => {
      shallow(<CardView />);
    });

    it('DisplayResult', () => {
      shallow(<DisplayResult />);
    });

    it('Divider', () => {
      shallow(<Divider />);
    });
  });
});
