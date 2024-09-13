[![npm version](https://img.shields.io/npm/v/spectraget)]([https://www.npmjs.com/package/spectraget](https://www.npmjs.com/package/spectraget))
[![Downloads](https://img.shields.io/npm/dt/spectraget)]([https://www.npmjs.com/package/spectraget)
![Static Badge](https://img.shields.io/badge/Github-Spectraget-green?&link=https%3A%2F%2Fgithub.com%2FPupariaa%2Fspectraget)

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
];

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

## Custom Validation Methods

SpectraGet allows you to easily add custom validation methods to suit your specific needs. This flexibility allows you to define your own validation logic and apply it dynamically to your API endpoints.

### Adding a Custom Validation

You can add a custom validation rule by using the `addCustomValidation` method. This method accepts a name for the custom validation and a function that defines the validation logic. The function will receive the parameter name, its value, and the parameter configuration object, allowing you to perform any validation you need.

#### Syntax

```js 
spectraget.addCustomValidation(name, validatorFn);
```

- **name**: A unique name for your custom validation.
- **validatorFn**: A function that contains the logic for validation. This function should throw a `ValidationError` if the validation fails.

#### Example: Adding a Palindrome Validation

Below is an example of how to add a custom validation rule that checks if a string is a palindrome.

```javascript
const spectraget = require('spectraget');

// Add a custom validation rule
spectraget.addCustomValidation('isPalindrome', (paramName, paramValue) => {
    const reversed = paramValue.split('').reverse().join('');
    if (paramValue !== reversed) {
        throw new ValidationError(`${paramName} should be a palindrome`);
    }
});

// Use the custom validation in the parameters
const params = [
    { name: 'username', type: 'string', customValidator: 'isPalindrome', mandatory: true }
];

const requestData = {
    username: 'madam'
};

const result = spectraget.validate(params, requestData);

if (result) {
    console.error(result.error);
} else {
    console.log('Validation passed');
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or additions.
