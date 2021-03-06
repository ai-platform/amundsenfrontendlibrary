import * as React from 'react';
import { shallow } from 'enzyme';

import { mapDispatchToProps, TagInfo, TagInfoProps } from '../';

import * as UtilMethods from 'ducks/utilMethods';


const logClickSpy = jest.spyOn(UtilMethods, 'logClick');
logClickSpy.mockImplementation(() => null);

describe('TagInfo', () => {
  const setup = (propOverrides?: Partial<TagInfoProps>) => {
    const props = {
      data: {
        tag_name: 'testTag',
        tag_count: 45,
      },
      compact: false,
      searchTag: jest.fn(),
      ...propOverrides,
    };
    const wrapper = shallow<TagInfo>(<TagInfo {...props} />);
    return { props, wrapper };
  };


  describe('onClick', () => {
    let props;
    let wrapper;
    const mockEvent = {};

    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
    });

    it('Calls the logClick utility function', () => {
      logClickSpy.mockClear();
      const expectedData = {
        target_type: 'tag',
        label: props.data.tag_name,
      };
      wrapper.instance().onClick(mockEvent);
      expect(logClickSpy).toHaveBeenCalledWith(mockEvent, expectedData)
    });

    it('it calls searchTag', () => {
      wrapper.instance().onClick(mockEvent);
      expect(props.searchTag).toHaveBeenCalledWith(props.data.tag_name);
    });
  });


  describe('render', () => {
    describe('renders a normal sized tag', () => {
      let props;
      let wrapper;

      beforeAll(() => {
        const setupResult = setup();
        wrapper = setupResult.wrapper;
        props = setupResult.props;
      });

      it('renders a button with correct props', () => {
        expect(wrapper.find('button').props()).toMatchObject({
          id: `tag::${props.data.tag_name}`,
          role: 'button',
          onClick: wrapper.instance().onClick,
          className: 'btn tag-button'
        });
      });

      it('renders with correct text', () => {
        expect(wrapper.text()).toEqual(props.data.tag_name + props.data.tag_count)
      });
    });


    describe('renders a compact sized tag', () => {
      let props;
      let wrapper;

      beforeAll(() => {
        const setupResult = setup({ compact: true });
        wrapper = setupResult.wrapper;
        props = setupResult.props;
      });

      it('renders with correct text', () => {
        expect(wrapper.text()).toEqual(props.data.tag_name)
      });

      it('renders with the correct classes', () => {
        expect(wrapper.find('button').props().className).toEqual('btn tag-button compact')
      });
    });
  });
});

describe('mapDispatchToProps', () => {
  let dispatch;
  let result;
  beforeAll(() => {
    dispatch = jest.fn(() => Promise.resolve());
    result = mapDispatchToProps(dispatch);
  });

  it('sets searchTag on the props', () => {
    expect(result.searchTag).toBeInstanceOf(Function);
  });
});
