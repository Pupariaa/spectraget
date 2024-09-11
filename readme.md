
# SpectraGet

SpectraGet is a powerful Node.js library designed for validating request parameters for APIs. It provides an easy-to-use interface for validating various types of parameters, including strings, numbers, arrays, dates, emails, and more. SpectraGet helps you ensure that your API endpoints are robust and secure by validating request data against pre-defined rules.

## Features

- **Type Validation**: Supports validation for integers, floats, strings, booleans, dates, and more.
- **Length Validation**: Enforces specific lengths for string and array parameters.
- **Range Validation**: Validates numeric ranges and date ranges.
- **Value Validation**: Checks if values are within a set of allowed values.
- **Regex Validation**: Validates if a parameter matches a specific regex pattern.
- **Email Validation**: Ensures that parameters are valid email addresses.
- **Password Strength Validation**: Validates the strength of passwords based on various criteria.
- **IP Range Validation**: Checks if an IP address is within a specified range.
- **JSON Validation**: Validates if a parameter is a valid JSON string.
- **Flexible and Extensible**: Easily add custom validation methods for your specific needs.

## Installation

Install the library using npm:

```bash
npm install spectraget
```

## Usage

To use SpectraGet, simply import the library and define your API endpoints with the necessary validation rules.

### Example

```javascript
const spectraget = require('spectraget');

// Define an endpoint with parameter validation rules
const params = [
    { name: 'key', type: 'string', mandatory: true, length: 32 },
    { name: 'id', type: 'int', mandatory: true, range: [17, 18] },
    { name: 'email', isEmail: true, mandatory: true },
    { name: 'password', isStrongPassword: true, mandatory: true },
    { name: 'date_of_birth', type: 'date', dateRange: ['2000-01-01', '2023-12-31'] }
  ]


// Request data to be validated
const requestData = {
  key: '12345678901234567890123456789012',
  id: 17,
  email: 'example@example.com',
  password: 'StrongP@ssword123',
  date_of_birth: '2001-05-15'
};

// Validate the request data against the params rules
const validationResult = spectraget.validate(params, requestData);

if (validationResult) {
  console.error(`Validation Error: ${validationResult.error}`);
} else {
  console.log('Validation passed. Proceed with the request.');
}
```

## API Reference

### `validate(params, requestData)`

Validates the request data against the defined params rules.

- **Parameters**:
  - `params` (Object): The params definition object with validation rules.
  - `requestData` (Object): The request data object to be validated.
- **Returns**:
  - Returns `null` if validation passes.
  - Returns an object with `error` and `status_code` if validation fails.

## Custom Validation Rules

You can easily add custom validation rules by extending the `SpectraGet` class and adding new methods. The validation rules can be applied dynamically based on your needs.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or additions.
