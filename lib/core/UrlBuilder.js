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

const { IamAuthenticator } = require('ibm-cloud-sdk-core');
const pkg = require('../../package.json');

/**
 * This module provides methods to construct headers & different url's used by the SDK.
 * @module UrlBuilder
 */
const UrlBuilder = () => {
  let instance = null;

  const _https = 'https://';
  const _webSocket = 'wss://';
  const _baseUrl = '.apprapp.cloud.ibm.com';
  let _region = '';
  const wsUrl = '/wsfeature';
  const _service = '/apprapp';

  let _instanceGuid = null;
  let _apikey = null;
  let _overrideServerHost = null;
  let _iamAuthenticator = null;

  /**
   * Set the region value
   * @method module:UrlBuilder#setRegion
   * @param {string} region - Region name
   */
  const setRegion = (region) => {
    _region = region;
  };

  /**
   * Set the app guid
   * @method module:UrlBuilder#setGuid
   * @param {string} guid - GUID of the service instance
   */
  const setGuid = (guid) => {
    _instanceGuid = guid;
  };

  /**
   * Set the custom server url.
   * Use for testing purpose.
   * @method module:UrlBuilder#setOverrideServerHost
   * @param {string} overrideServerHost - The Base service url
   */
  const setOverrideServerHost = (overrideServerHost) => {
    _overrideServerHost = overrideServerHost;
  };

  /**
   * Set the apikey
   * @method module:UrlBuilder#setApikey
   * @param {string} apikey - APIKEY of the srvice instance
   */
  const setApikey = (apikey) => {
    _apikey = apikey;
  };

  /**
   * Get the Request headers
   * 
   * @method module:UrlBuilder#getHeaders
   * @param {boolean} isPost for POST API requests
   * @returns {object} required headers
   */
  const getHeaders = (isPost = false) => {
    const headers = {
      'Accept': 'application/json',
      'User-Agent': `appconfiguration-node-sdk/${pkg.version}`,
    };
    if (isPost) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  /**
   * Get the base url for the App Configuration service instance
   * @method module:UrlBuilder#getBaseServiceUrl
   * @returns {string} The base service url
   */
  const getBaseServiceUrl = () => {
    if (_overrideServerHost) {
      return _overrideServerHost;
    }
    return _https + _region + _baseUrl;
  }

  /**
   * Get the IAM url
   * @method module:UrlBuilder#getIamUrl
   * @returns {string} The IAM url
   */
  const getIamUrl = () => {
    if (_overrideServerHost) {
      return `${_https}iam.test.cloud.ibm.com`;
    }
    return `${_https}iam.cloud.ibm.com`;
  }

  /**
   * Get the websocket url
   * @method module:UrlBuilder#getWebSocketUrl
   * @param {String} collectionId - The collection Id
   * @param {String} environmentId - The environment Id
   * @returns {String} The websocket url
   */
  const getWebSocketUrl = (collectionId, environmentId) => {
    let ws = _webSocket;
    if (_overrideServerHost) {
      ws += _overrideServerHost.replace('https://', '').replace('http://', '');
    } else {
      ws += _region;
      ws += _baseUrl;
    }
    return `${ws + _service + wsUrl}?instance_id=${_instanceGuid}&collection_id=${collectionId}&environment_id=${environmentId}`;
  };

  /**
   * Sets the Authenticator
   * @method module:UrlBuilder#setAuthenticator
   */
  const setAuthenticator = () => {
    _iamAuthenticator = new IamAuthenticator({
      apikey: _apikey,
      url: getIamUrl(),
    })
  }

  /**
   * Get the IAM bearer token stored in the `ibm-cloud-sdk-core`
   * 
   * @async
   * @method module:UrlBuilder#getToken
   * @returns {string} The Bearer token
   */
  const getToken = async () => {
    const options = {};
    await _iamAuthenticator.authenticate(options);
    return options.headers.Authorization; // will return the string "Bearer <token>"
  };

  /**
   * @method module:UrlBuilder#getIamAuthenticator
   * @returns {object} The IAM Authenticator object
   */
  const getIamAuthenticator = () => _iamAuthenticator;

  /**
   * @method module:UrlBuilder#createInstance
   */
  function createInstance() {
    return {
      setRegion,
      setGuid,
      setOverrideServerHost,
      setApikey,
      getIamUrl,
      getBaseServiceUrl,
      getHeaders,
      getWebSocketUrl,
      setAuthenticator,
      getIamAuthenticator,
      getToken,
    };
  }

  // Return for UrlBuilder
  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
};

const Builder = UrlBuilder();

module.exports = {
  UrlBuilder: Builder,
};
