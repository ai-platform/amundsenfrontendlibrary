import axios from 'axios';
import * as qs from 'simple-query-string';

import * as Helpers from '../helpers';

import * as Utils from 'ducks/utilMethods';

import globalState from 'fixtures/globalState';

import { NotificationType, UpdateMethod, UpdateOwnerPayload } from 'interfaces';

import * as API from '../v0';

const filterFromObjSpy = jest.spyOn(Utils, 'filterFromObj').mockImplementation((initialObject, rejectedKeys) => { return initialObject; });

jest.mock('axios');

describe('helpers', () => {
  let mockResponseData: API.TableDataAPI;
  let tableResponseData: API.TableData;
  beforeAll(() => {
    tableResponseData = {
      ...globalState.tableMetadata.tableData,
      owners: [{display_name: 'test', profile_url: 'test.io', email: 'test@test.com', user_id: 'test'}],
      tags: [{tag_count: 2, tag_name: 'zname'}, {tag_count: 1, tag_name: 'aname'}],
    };
    mockResponseData = {
     tableData: tableResponseData,
     msg: 'Success',
   };
  });

  describe('getTableQueryParams', () => {
    it('generates table query params with a key', () => {
      const tableKey = 'database://cluster.schema/table';
      const queryString = Helpers.getTableQueryParams(tableKey);
      const params = qs.parse(queryString);

      expect(params.key).toEqual(tableKey);
      expect(params.index).toEqual(undefined);
      expect(params.source).toEqual(undefined);
    });

    it('generates query params with logging params', () => {
      const tableKey = 'database://cluster.schema/table';
      const index = '4';
      const source = 'test-source';
      const queryString = Helpers.getTableQueryParams(tableKey, index, source);
      const params = qs.parse(queryString);

      expect(params.key).toEqual(tableKey);
      expect(params.index).toEqual(index);
      expect(params.source).toEqual(source);
    });
  });

  it('getTableDataFromResponseData', () => {
    Helpers.getTableDataFromResponseData(mockResponseData);
    expect(filterFromObjSpy).toHaveBeenCalledWith(tableResponseData, ['owners', 'tags']);
  });

  it('getTableOwnersFromResponseData', () => {
    expect(Helpers.getTableOwnersFromResponseData(mockResponseData)).toEqual({
      'test': {display_name: 'test', profile_url: 'test.io', email: 'test@test.com', user_id: 'test'}
    });
  });

  it('getTableTagsFromResponseData', () => {
    expect(Helpers.getTableTagsFromResponseData(mockResponseData)).toEqual([
      {tag_count: 1, tag_name: 'aname'},
      {tag_count: 2, tag_name: 'zname'},
    ]);
  });

  describe('createOwnerNotificationData', () => {
    let testData;
    let testId;
    let expectedName;
    let expectedPath;
    beforeAll(() => {
      testData = globalState.tableMetadata.tableData;
      testId =  'testId@test.com';
      expectedName = `${testData.schema}.${testData.name}`;
      expectedPath = `/explore/table_detail/${testData.cluster}/${testData.database}/${testData.schema}/${testData.name}`;
    });

    it('creates correct request data for PUT', () => {
      expect(Helpers.createOwnerNotificationData({ method: UpdateMethod.PUT, id: testId }, testData)).toMatchObject({
        notificationType: NotificationType.OWNER_ADDED,
        options: {
          resource_name: expectedName,
          resource_path: expectedPath,
        },
        recipients: [testId],
      });
    });

    it('creates correct request data for DELETE', () => {
      expect(Helpers.createOwnerNotificationData({ method: UpdateMethod.DELETE, id: testId }, testData)).toMatchObject({
        notificationType: NotificationType.OWNER_REMOVED,
        options: {
          resource_name: expectedName,
          resource_path: expectedPath,
        },
        recipients: [testId],
      });
    });
  });

  it('createOwnerUpdatePayload', () => {
    const testId =  'testId@test.com';
    const testKey = 'testKey';
    const testMethod = UpdateMethod.PUT;
    expect(Helpers.createOwnerUpdatePayload({ method: testMethod, id: testId }, testKey)).toMatchObject({
      method: testMethod,
      url: `${API.API_PATH}/update_table_owner`,
      data: {
        key: testKey,
        owner: testId,
      },
    });
  });

  describe('shouldSendNotification', () => {
    it('returns false if alumni', () => {
      const testUser = {
        ... globalState.user.loggedInUser,
        is_active: false,
      }
      expect(Helpers.shouldSendNotification(testUser)).toBe(false);
    });

    it('returns false if not a user with display_name', () => {
      const testUser = {
        ... globalState.user.loggedInUser,
        display_name: null,
      }
      expect(Helpers.shouldSendNotification(testUser)).toBe(false);
    });

    it('returns true if user is_active and has a display_name', () => {
      const testUser = { ... globalState.user.loggedInUser }
      expect(Helpers.shouldSendNotification(testUser)).toBe(true);
    });
  });
});
