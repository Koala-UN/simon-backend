// src/models/BaseModel.js
class BaseModel {
    constructor() {
      if (this.constructor === BaseModel) {
        throw new Error('Abstract class cannot be instantiated');
      }
    }
  
    toJSON() {
      return Object.getOwnPropertyNames(this)
        .reduce((obj, prop) => {
          if (prop.startsWith('_')) {
            obj[prop.slice(1)] = this[prop];
          }
          return obj;
        }, {});
    }
  }
  
  module.exports = BaseModel;