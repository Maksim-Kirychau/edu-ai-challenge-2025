/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the validation passed
 * @property {string[]} errors - Array of validation error messages
 */

/**
 * Base validator class that all other validators extend
 */
class Validator {
  constructor() {
    this.customMessage = null;
    this._isOptional = false;
  }

  /**
   * Set a custom error message for this validator
   * @param {string} message - Custom error message
   * @returns {this}
   */
  withMessage(message) {
    this.customMessage = message;
    return this;
  }

  /**
   * Get the error message, using custom message if set
   * @param {string} defaultMessage - Default error message
   * @returns {string}
   */
  getErrorMessage(defaultMessage) {
    return this.customMessage || defaultMessage;
  }

  /**
   * Mark this validator as optional
   * @returns {this}
   */
  optional() {
    this._isOptional = true;
    return this;
  }

  /**
   * Validate a value
   * @param {any} value - Value to validate
   * @returns {ValidationResult}
   */
  validate(value) {
    throw new Error('validate() must be implemented by subclass');
  }
}

/**
 * String validator class
 */
class StringValidator extends Validator {
  constructor() {
    super();
    this._minLength = null;
    this._maxLength = null;
    this._pattern = null;
  }
}

// Define prototype methods
StringValidator.prototype.minLength = function(length) {
  this._minLength = length;
  return this;
};

StringValidator.prototype.maxLength = function(length) {
  this._maxLength = length;
  return this;
};

StringValidator.prototype.pattern = function(pattern) {
  this._pattern = pattern;
  return this;
};

StringValidator.prototype.validate = function(value) {
  const errors = [];

  if ((value === undefined || value === null) && this._isOptional) {
    return { isValid: true, errors: [] };
  }
  if (value === undefined || value === null) {
    return { isValid: false, errors: [this.getErrorMessage('Value is required')] };
  }
  if (typeof value !== 'string') {
    return { isValid: false, errors: [this.getErrorMessage('Value must be a string')] };
  }
  if (this._minLength !== null && value.length < this._minLength) {
    errors.push(this.getErrorMessage(`String must be at least ${this._minLength} characters long`));
  }
  if (this._maxLength !== null && value.length > this._maxLength) {
    errors.push(this.getErrorMessage(`String must be at most ${this._maxLength} characters long`));
  }
  if (this._pattern !== null && !this._pattern.test(value)) {
    errors.push(this.getErrorMessage('String does not match required pattern'));
  }
  return { isValid: errors.length === 0, errors };
};

/**
 * Number validator class
 */
class NumberValidator extends Validator {
  constructor() {
    super();
    this._min = null;
    this._max = null;
    this._isInteger = false;
  }
}

// Define prototype methods
NumberValidator.prototype.min = function(value) {
  this._min = value;
  return this;
};

NumberValidator.prototype.max = function(value) {
  this._max = value;
  return this;
};

NumberValidator.prototype.integer = function() {
  this._isInteger = true;
  return this;
};

NumberValidator.prototype.validate = function(value) {
  const errors = [];

  if ((value === undefined || value === null) && this._isOptional) {
    return { isValid: true, errors: [] };
  }
  if (value === undefined || value === null) {
    return { isValid: false, errors: [this.getErrorMessage('Value is required')] };
  }
  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, errors: [this.getErrorMessage('Value must be a number')] };
  }
  if (this._isInteger && !Number.isInteger(value)) {
    errors.push(this.getErrorMessage('Value must be an integer'));
  }
  if (this._min !== null && value < this._min) {
    errors.push(this.getErrorMessage(`Value must be at least ${this._min}`));
  }
  if (this._max !== null && value > this._max) {
    errors.push(this.getErrorMessage(`Value must be at most ${this._max}`));
  }
  return { isValid: errors.length === 0, errors };
};

/**
 * Boolean validator class
 */
class BooleanValidator extends Validator {
  /**
   * Validate a boolean value
   * @param {any} value - Value to validate
   * @returns {ValidationResult}
   */
  validate(value) {
    if ((value === undefined || value === null) && this._isOptional) {
      return { isValid: true, errors: [] };
    }
    if (value === undefined || value === null) {
      return { isValid: false, errors: [this.getErrorMessage('Value is required')] };
    }
    if (typeof value !== 'boolean') {
      return { isValid: false, errors: [this.getErrorMessage('Value must be a boolean')] };
    }
    return { isValid: true, errors: [] };
  }
}

/**
 * Date validator class
 */
class DateValidator extends Validator {
  /**
   * Validate a date value
   * @param {any} value - Value to validate
   * @returns {ValidationResult}
   */
  validate(value) {
    if ((value === undefined || value === null) && this._isOptional) {
      return { isValid: true, errors: [] };
    }
    if (value === undefined || value === null) {
      return { isValid: false, errors: [this.getErrorMessage('Value is required')] };
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { isValid: false, errors: [this.getErrorMessage('Value must be a valid date')] };
    }
    return { isValid: true, errors: [] };
  }
}

/**
 * Array validator class
 */
class ArrayValidator extends Validator {
  constructor(itemValidator) {
    super();
    this.itemValidator = itemValidator;
    this._minLength = null;
    this._maxLength = null;
  }
}

// Define prototype methods
ArrayValidator.prototype.minLength = function(length) {
  this._minLength = length;
  return this;
};

ArrayValidator.prototype.maxLength = function(length) {
  this._maxLength = length;
  return this;
};

ArrayValidator.prototype.validate = function(value) {
  const errors = [];

  if ((value === undefined || value === null) && this._isOptional) {
    return { isValid: true, errors: [] };
  }
  if (value === undefined || value === null) {
    return { isValid: false, errors: [this.getErrorMessage('Value is required')] };
  }
  if (!Array.isArray(value)) {
    return { isValid: false, errors: [this.getErrorMessage('Value must be an array')] };
  }
  if (this._minLength !== null && value.length < this._minLength) {
    errors.push(this.getErrorMessage(`Array must have at least ${this._minLength} items`));
  }
  if (this._maxLength !== null && value.length > this._maxLength) {
    errors.push(this.getErrorMessage(`Array must have at most ${this._maxLength} items`));
  }
  value.forEach((item, index) => {
    const result = this.itemValidator.validate(item);
    if (!result.isValid) {
      result.errors.forEach(error => {
        errors.push(`Item at index ${index}: ${error}`);
      });
    }
  });
  return { isValid: errors.length === 0, errors };
};

/**
 * Object validator class
 */
class ObjectValidator extends Validator {
  /**
   * @param {Record<string, Validator>} schema - Object schema
   */
  constructor(schema) {
    super();
    this.schema = schema;
  }

  /**
   * Validate an object value
   * @param {any} value - Value to validate
   * @returns {ValidationResult}
   */
  validate(value) {
    const errors = [];

    if ((value === undefined || value === null) && this._isOptional) {
      return { isValid: true, errors: [] };
    }
    if (value === undefined || value === null) {
      return { isValid: false, errors: [this.getErrorMessage('Value is required')] };
    }
    if (typeof value !== 'object' || Array.isArray(value)) {
      return { isValid: false, errors: [this.getErrorMessage('Value must be an object')] };
    }
    Object.entries(this.schema).forEach(([key, validator]) => {
      const result = validator.validate(value[key]);
      if (!result.isValid) {
        result.errors.forEach(error => {
          errors.push(`${key}: ${error}`);
        });
      }
    });
    return { isValid: errors.length === 0, errors };
  }
}

/**
 * Schema builder class
 */
class Schema {
  /**
   * Create a string validator
   * @returns {StringValidator}
   */
  static string() {
    return new StringValidator();
  }

  /**
   * Create a number validator
   * @returns {NumberValidator}
   */
  static number() {
    return new NumberValidator();
  }

  /**
   * Create a boolean validator
   * @returns {BooleanValidator}
   */
  static boolean() {
    return new BooleanValidator();
  }

  /**
   * Create a date validator
   * @returns {DateValidator}
   */
  static date() {
    return new DateValidator();
  }

  /**
   * Create an object validator
   * @template T
   * @param {Record<string, Validator>} schema - Object schema
   * @returns {ObjectValidator<T>}
   */
  static object(schema) {
    return new ObjectValidator(schema);
  }

  /**
   * Create an array validator
   * @template T
   * @param {Validator} itemValidator - Validator for array items
   * @returns {ArrayValidator<T>}
   */
  static array(itemValidator) {
    return new ArrayValidator(itemValidator);
  }
}

// Export the Schema class directly
module.exports = Schema; 