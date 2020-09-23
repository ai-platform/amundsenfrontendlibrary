import * as React from 'react';
import * as Avatar from 'react-avatar';
import * as History from 'history';

import { shallow } from 'enzyme';
import { Dropdown, MenuItem } from 'react-bootstrap';

import { Link, NavLink } from 'react-router-dom';
import { NavBar, NavBarProps, mapStateToProps } from '../';
import { getMockRouterProps } from 'fixtures/mockRouter';

import Feedback from 'components/Feedback';
import SearchBar from 'components/common/SearchBar';

import { logClick } from "ducks/utilMethods";
jest.mock('ducks/utilMethods', () => {
  return jest.fn().mockImplementation(() => {
    return {logClick: jest.fn()};
  });
});

import AppConfig from 'config/config';
AppConfig.logoPath = '/test';
AppConfig.navLinks = [
  {
    label: 'Announcements',
    href: '/explore/announcements',
    id: 'link1',
    target: '_blank',
    use_router: true,
  },
  {
    label: 'Browse',
    href: '/explore/browse',
    id: 'link2',
    target: '_blank',
    use_router: false,
  }
];
AppConfig.indexUsers.enabled = true;
AppConfig.mailClientFeatures.feedbackEnabled = true;

import globalState from 'fixtures/globalState';

describe('NavBar', () => {
  const setup = (propOverrides?: Partial<NavBarProps>, location?: Partial<History.Location>) => {
    const routerProps = getMockRouterProps<any>(null, location);
    const props: NavBarProps = {
      loggedInUser: globalState.user.loggedInUser,
      ...routerProps,
      ...propOverrides
    };
    const wrapper = shallow<NavBar>(<NavBar {...props} />);
    return { props, wrapper };
  };

  describe('generateNavLinks', () => {
    let content;
    beforeAll(() => {
      const { props, wrapper } = setup();
      content = wrapper.instance().generateNavLinks(AppConfig.navLinks);
    });

    it('returns a NavLink w/ correct props if user_router is true', () => {
      const expectedContent = JSON.stringify(
        <NavLink className="title-3 border-bottom-white" key={0} to='/explore/announcements' target='_blank'
                 onClick={logClick}>Announcements</NavLink>
      );
      expect(JSON.stringify(content[0])).toEqual(expectedContent);
    });

    it('returns an anchor w/ correct props if user_router is false', () => {
      expect(shallow(content[1]).find('a').props()).toMatchObject({
        href: '/explore/browse',
        target: '_blank',
      });
    });

    it('returns an anchor w/ correct test if user_router is false', () => {
      expect(shallow(content[1]).find('a').text()).toEqual('Browse');
    });
  });

  describe('renderSearchBar', () => {
    it('returns small SearchBar when not on home page', () => {
      const { props, wrapper } = setup(null, { pathname: "/explore/search" });
      const searchBar = shallow(wrapper.instance().renderSearchBar()).find(SearchBar);
      expect(searchBar.exists()).toBe(true);
      expect(searchBar.props()).toMatchObject({
        size: "small",
      });
    });

    it('returns null if conditions to render search bar are not met', () => {
      const { props, wrapper } = setup(null, { pathname: "/explore/" });
      expect(wrapper.instance().renderSearchBar()).toBe(null);
    });
  });

  describe('render', () => {
    let element;
    let props;
    let wrapper;
    let renderSearchBarSpy;
    const spy = jest.spyOn(NavBar.prototype, 'generateNavLinks');
    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
      renderSearchBarSpy = jest.spyOn(wrapper.instance(), 'renderSearchBar');
      wrapper.instance().forceUpdate();
    });

    it('renders img with AppConfig.logoPath', () => {
      element = wrapper.find('img#logo-icon');
      expect(element.props()).toMatchObject({
        id: 'logo-icon',
        className: 'logo-icon',
        src: AppConfig.logoPath,
      });
    });

    it('renders homepage Link with correct path ', () => {
      element = wrapper.find('#nav-bar-left').find(Link);
      expect(element.props().to).toEqual('/explore/');
    });

    it('renders homepage Link with correct text', () => {
      element = wrapper.find('#nav-bar-left').find(Link).find('.title-3');
      expect(element.children().text()).toEqual('EXPLORE');
    });

    it('calls generateNavLinks with correct props', () => {
      expect(spy).toHaveBeenCalledWith(AppConfig.navLinks);
    });

    it('calls renderSearchBar', () => {
      expect(renderSearchBarSpy).toHaveBeenCalled();
    });
  });
});


describe('mapStateToProps', () => {
  let result;
  beforeEach(() => {
    result = mapStateToProps(globalState);
  });

  it('sets loggedInUser on the props', () => {
    expect(result.loggedInUser).toEqual(globalState.user.loggedInUser);
  });
});
