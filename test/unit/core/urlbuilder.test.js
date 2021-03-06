/**
 * Copyright 2021 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { UrlBuilder } = require('../../../lib/core/UrlBuilder');

const urlBuilder = UrlBuilder.getInstance();
urlBuilder.setRegion('region');
urlBuilder.setGuid('guid');
urlBuilder.setOverrideServerHost('my.custom.domain');

const expectedIamUrl = 'https://iam.test.cloud.ibm.com';
const expectedSocketUrl = 'wss://my.custom.domain/apprapp/wsfeature?instance_id=guid&collection_id=collection_id&environment_id=environment_id';
const expectedBaseServiceUrl = 'my.custom.domain';

describe('url builder', () => {
  test('iam url', () => {
    expect(urlBuilder.getIamUrl()).toBe(expectedIamUrl);
  });
  test('base service url', () => {
    expect(urlBuilder.getBaseServiceUrl()).toBe(expectedBaseServiceUrl);
  });
  test('socket url', () => {
    expect(urlBuilder.getWebSocketUrl('collection_id', 'environment_id')).toBe(expectedSocketUrl);
  });
});
