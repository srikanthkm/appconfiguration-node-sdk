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

const { Logger } = require('../../core/Logger');
const { Constants } = require('../internal/Constants');

const logger = Logger.getInstance();

/**
 * Defines the model of a Feature defined in App Configuration service.
 */
class Feature {
  /**
   * @constructor
   * @param {object} featureList - features JSON object that contains all the features
   * @param {boolean} enabled - enabled status of the feature
   */
  constructor(featureList, enabled) {
    this.enabled = enabled;
    this.name = featureList.name;
    this.feature_id = featureList.feature_id;
    this.type = featureList.type;
    this.disabled_value = featureList.disabled_value;
    this.enabled_value = featureList.enabled_value;
    this.segment_rules = featureList.segment_rules ? featureList.segment_rules : [];
  }

  /**
   * Get the Feature name
   * @returns {string} The Feature name
   */
  getFeatureName() {
    return this.name ? this.name : '';
  }

  /**
   * Get the Feature Id
   * @returns {string} The Feature Id
   */
  getFeatureId() {
    return this.feature_id ? this.feature_id : '';
  }

  /**
   * Get the Feature data type
   * @returns {string} string named BOOLEAN/STRING/NUMERIC
   */
  getFeatureDataType() {
    return this.type ? this.type : '';
  }

  /**
   * Get the evaluated value of the feature
   * 
   * @param {string} entityId - Id of the Entity
   * @param {object} entityAttributes - Entity attributes object
   * @returns {boolean|string|number|null} Evaluated value
   */
  getCurrentValue(entityId, entityAttributes) {
    if (!entityId) {
      logger.error(Constants.ENTITY_ID_NOT_PASSED_ERROR);
      return null;
    }

    const { configurationHandler } = require('../ConfigurationHandler');
    const configurationHandlerInstance = configurationHandler.currentInstance();
    return configurationHandlerInstance.featureEvaluation(this, entityId, entityAttributes);
  }

  /**
   * Return the enabled status of the feature
   * @returns {boolean} true or false
   */
  isEnabled() {
    return this.enabled;
  }
}

module.exports = {
  Feature,
};
