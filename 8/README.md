# JavaScript Validation Library

A robust, type-safe validation library for JavaScript that supports complex data structures and nested validations.

## Features

- Type-safe validation for primitive types (string, number, boolean, date)
- Support for complex types (arrays and objects)
- Nested validation support
- Custom error messages
- Chainable validation rules
- Comprehensive test coverage

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```javascript
const Schema = require('./validator');

// Create a simple string validator
const nameValidator = Schema.string()
  .minLength(2)
  .maxLength(50)
  .withMessage('Name must be between 2 and 50 characters');

// Validate a value
const result = nameValidator.validate('John');
console.log(result.isValid); // true
console.log(result.errors); // []

// Validate an invalid value
const invalidResult = nameValidator.validate('J');
console.log(invalidResult.isValid); // false
console.log(invalidResult.errors); // ['Name must be between 2 and 50 characters']
```

### Complex Object Validation

```javascript
const userSchema = Schema.object({
  name: Schema.string().minLength(2),
  age: Schema.number().min(0).max(120),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string())
});

const user = {
  name: 'John',
  age: 25,
  email: 'john@example.com',
  isActive: true,
  tags: ['user', 'admin']
};

const result = userSchema.validate(user);
```

### Nested Object Validation

```javascript
const addressSchema = Schema.object({
  street: Schema.string(),
  city: Schema.string(),
  postalCode: Schema.string().pattern(/^\d{5}$/),
  country: Schema.string()
});

const userSchema = Schema.object({
  name: Schema.string(),
  address: addressSchema
});
```

### Array Validation

```javascript
const tagsSchema = Schema.array(Schema.string())
  .minLength(1)
  .maxLength(5);

const result = tagsSchema.validate(['tag1', 'tag2']);
```

## Available Validators

### String Validator
- `minLength(length)`: Set minimum length
- `maxLength(length)`: Set maximum length
- `pattern(regex)`: Set pattern validation
- `withMessage(message)`: Set custom error message
- `optional()`: Mark the field as optional

### Number Validator
- `min(value)`: Set minimum value
- `max(value)`: Set maximum value
- `integer()`: Require integer values
- `withMessage(message)`: Set custom error message
- `optional()`: Mark the field as optional

### Boolean Validator
- `withMessage(message)`: Set custom error message
- `optional()`: Mark the field as optional

### Date Validator
- `withMessage(message)`: Set custom error message
- `optional()`: Mark the field as optional

### Array Validator
- `minLength(length)`: Set minimum length
- `maxLength(length)`: Set maximum length
- `withMessage(message)`: Set custom error message
- `optional()`: Mark the field as optional

### Object Validator
- `withMessage(message)`: Set custom error message
- `optional()`: Mark the field as optional

## Running Tests

```bash
npm test
```

## Test Coverage

To generate a test coverage report and save it to `test_report.txt`:

```bash
npm run test:coverage
```

A summary of the coverage report will be saved in `test_report.txt`. Example output:

```
--------------|---------|----------|---------|---------|-----------------------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                 
--------------|---------|----------|---------|---------|-----------------------------------
All files     |   93.02 |    91.66 |   96.96 |   93.02 |                                   
 validator.js |   93.02 |    91.66 |   96.96 |   93.02 | 50,86,138,169,192,232,235,281,284 
--------------|---------|----------|---------|---------|-----------------------------------
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 