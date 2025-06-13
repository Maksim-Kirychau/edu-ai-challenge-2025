const Schema = require('../validator');

describe('Schema Validators', () => {
  describe('String Validator', () => {
    const stringValidator = Schema.string();

    test('validates string values', () => {
      expect(stringValidator.validate('test').isValid).toBe(true);
      expect(stringValidator.validate(123).isValid).toBe(false);
      expect(stringValidator.validate(null).isValid).toBe(false);
    });

    test('validates minLength', () => {
      const validator = Schema.string().minLength(3);
      expect(validator.validate('test').isValid).toBe(true);
      expect(validator.validate('te').isValid).toBe(false);
    });

    test('validates maxLength', () => {
      const validator = Schema.string().maxLength(3);
      expect(validator.validate('tes').isValid).toBe(true);
      expect(validator.validate('test').isValid).toBe(false);
    });

    test('validates pattern', () => {
      const validator = Schema.string().pattern(/^[A-Z]+$/);
      expect(validator.validate('ABC').isValid).toBe(true);
      expect(validator.validate('abc').isValid).toBe(false);
    });

    test('supports custom error messages', () => {
      const validator = Schema.string().withMessage('Custom error');
      expect(validator.validate(null).errors[0]).toBe('Custom error');
    });
  });

  describe('Number Validator', () => {
    const numberValidator = Schema.number();

    test('validates number values', () => {
      expect(numberValidator.validate(123).isValid).toBe(true);
      expect(numberValidator.validate('123').isValid).toBe(false);
      expect(numberValidator.validate(null).isValid).toBe(false);
    });

    test('validates min value', () => {
      const validator = Schema.number().min(5);
      expect(validator.validate(6).isValid).toBe(true);
      expect(validator.validate(4).isValid).toBe(false);
    });

    test('validates max value', () => {
      const validator = Schema.number().max(5);
      expect(validator.validate(4).isValid).toBe(true);
      expect(validator.validate(6).isValid).toBe(false);
    });

    test('validates integer values', () => {
      const validator = Schema.number().integer();
      expect(validator.validate(5).isValid).toBe(true);
      expect(validator.validate(5.5).isValid).toBe(false);
    });
  });

  describe('Boolean Validator', () => {
    const booleanValidator = Schema.boolean();

    test('validates boolean values', () => {
      expect(booleanValidator.validate(true).isValid).toBe(true);
      expect(booleanValidator.validate(false).isValid).toBe(true);
      expect(booleanValidator.validate('true').isValid).toBe(false);
      expect(booleanValidator.validate(null).isValid).toBe(false);
    });
  });

  describe('Date Validator', () => {
    const dateValidator = Schema.date();

    test('validates date values', () => {
      expect(dateValidator.validate(new Date()).isValid).toBe(true);
      expect(dateValidator.validate('2023-01-01').isValid).toBe(true);
      expect(dateValidator.validate('invalid').isValid).toBe(false);
      expect(dateValidator.validate(null).isValid).toBe(false);
    });
  });

  describe('Array Validator', () => {
    test('validates array values', () => {
      const validator = Schema.array(Schema.string());
      expect(validator.validate(['test']).isValid).toBe(true);
      expect(validator.validate([123]).isValid).toBe(false);
      expect(validator.validate('not an array').isValid).toBe(false);
    });

    test('validates minLength', () => {
      const validator = Schema.array(Schema.string()).minLength(2);
      expect(validator.validate(['a', 'b']).isValid).toBe(true);
      expect(validator.validate(['a']).isValid).toBe(false);
    });

    test('validates maxLength', () => {
      const validator = Schema.array(Schema.string()).maxLength(2);
      expect(validator.validate(['a', 'b']).isValid).toBe(true);
      expect(validator.validate(['a', 'b', 'c']).isValid).toBe(false);
    });

    test('validates nested arrays', () => {
      const validator = Schema.array(Schema.array(Schema.number()));
      expect(validator.validate([[1, 2], [3, 4]]).isValid).toBe(true);
      expect(validator.validate([[1, '2'], [3, 4]]).isValid).toBe(false);
    });
  });

  describe('Object Validator', () => {
    const userSchema = Schema.object({
      name: Schema.string().minLength(2),
      age: Schema.number().min(0),
      email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      tags: Schema.array(Schema.string())
    });

    test('validates object values', () => {
      const validUser = {
        name: 'John',
        age: 25,
        email: 'john@example.com',
        tags: ['user', 'admin']
      };
      expect(userSchema.validate(validUser).isValid).toBe(true);
    });

    test('validates nested objects', () => {
      const addressSchema = Schema.object({
        street: Schema.string(),
        city: Schema.string()
      });

      const userWithAddressSchema = Schema.object({
        name: Schema.string(),
        address: addressSchema
      });

      const validUser = {
        name: 'John',
        address: {
          street: '123 Main St',
          city: 'Anytown'
        }
      };
      expect(userWithAddressSchema.validate(validUser).isValid).toBe(true);
    });

    test('reports all validation errors', () => {
      const invalidUser = {
        name: 'J', // too short
        age: -1, // negative
        email: 'invalid-email',
        tags: [123] // not strings
      };
      const result = userSchema.validate(invalidUser);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Complex Schema Example', () => {
    const addressSchema = Schema.object({
      street: Schema.string(),
      city: Schema.string(),
      postalCode: Schema.string().pattern(/^\d{5}$/),
      country: Schema.string()
    });

    const userSchema = Schema.object({
      id: Schema.string(),
      name: Schema.string().minLength(2).maxLength(50),
      email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      age: Schema.number().min(0).max(120),
      isActive: Schema.boolean(),
      tags: Schema.array(Schema.string()),
      address: addressSchema,
      metadata: Schema.object({}).optional()
    });

    test('validates complex nested schema', () => {
      const validUser = {
        id: '12345',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true,
        tags: ['developer', 'designer'],
        address: {
          street: '123 Main St',
          city: 'Anytown',
          postalCode: '12345',
          country: 'USA'
        },
        metadata: {
          lastLogin: '2023-01-01'
        }
      };
      expect(userSchema.validate(validUser).isValid).toBe(true);
    });

    test('handles missing optional fields', () => {
      const userWithoutMetadata = {
        id: '12345',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true,
        tags: ['developer'],
        address: {
          street: '123 Main St',
          city: 'Anytown',
          postalCode: '12345',
          country: 'USA'
        }
      };
      expect(userSchema.validate(userWithoutMetadata).isValid).toBe(true);
    });
  });
}); 