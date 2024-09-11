class ValidationError extends Error {
    /**
     * ValidationError constructor
     *
     * @param {string} message - The message of the error
     */
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class SpectraGet {
    #validateType(paramName, paramValue, expectedType) {
        if (expectedType === 'int') {
            const parsedValue = parseInt(paramValue, 10);
            if (isNaN(parsedValue)) {
                throw new ValidationError(`${paramName} should be an integer`);
            }
        } else if (expectedType === 'float') {
            const parsedValue = parseFloat(paramValue);
            if (isNaN(parsedValue)) {
                throw new ValidationError(`${paramName} should be a floating point number`);
            }
        } else if (expectedType === 'string' && typeof paramValue !== 'string') {
            throw new ValidationError(`${paramName} should be a string`);
        } else if (expectedType === 'boolean' && typeof paramValue !== 'boolean') {
            throw new ValidationError(`${paramName} should be a boolean`);
        } else if (expectedType === 'date') {
            const date = new Date(paramValue);
            if (isNaN(date.getTime())) {
                throw new ValidationError(`${paramName} should be a valid date`);
            }
        }
    }


    #validateLength(paramName, paramValue, expectedLength) {
        if (typeof paramValue === 'string' && paramValue.length !== expectedLength) {
            throw new ValidationError(`${paramName} should have a length of ${expectedLength}`);
        }
    }

    #validateRange(paramName, paramValue, range) {
        if (typeof paramValue === 'number' && (paramValue < range[0] || paramValue > range[1])) {
            throw new ValidationError(`${paramName} should be in the range [${range[0]}, ${range[1]}]`);
        }
    }

    #validateValues(paramName, paramValue, allowedValues) {
        const valuesToCheck = paramValue.split(' ');
        for (const value of valuesToCheck) {
            if (allowedValues && allowedValues.indexOf(value) === -1) {
                throw new ValidationError(`${paramName} should have a value among ${allowedValues.join(', ')}`);
            }
        }
    }
    #validateRegex(paramName, paramValue, regex) {
        if (!regex.test(paramValue)) {
            throw new ValidationError(`${paramName} should match the format ${regex}`);
        }
    }
    #validateEmail(paramName, paramValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(paramValue)) {
            throw new ValidationError(`${paramName} should be a valid email address`);
        }
    }
    #validatePatternContains(paramName, paramValue, pattern) {
        if (!paramValue.includes(pattern)) {
            throw new ValidationError(`${paramName} should contain the pattern "${pattern}"`);
        }
    }
    #validateArrayOfNumbers(paramName, paramValue) {
        if (!Array.isArray(paramValue) || !paramValue.every(val => typeof val === 'number')) {
            throw new ValidationError(`${paramName} should be an array of numbers`);
        }
    }
    #validateArrayLength(paramName, paramValue, expectedLength) {
        if (!Array.isArray(paramValue) || paramValue.length !== expectedLength) {
            throw new ValidationError(`${paramName} should be an array with length of ${expectedLength}`);
        }
    }
    #validateDateRange(paramName, paramValue, startDate, endDate) {
        const date = new Date(paramValue);
        if (isNaN(date.getTime()) || date < new Date(startDate) || date > new Date(endDate)) {
            throw new ValidationError(`${paramName} should be a date between ${startDate} and ${endDate}`);
        }
    }
    #validateJSON(paramName, paramValue) {
        try {
            JSON.parse(paramValue);
        } catch (e) {
            throw new ValidationError(`${paramName} should be a valid JSON string`);
        }
    }
    #validatePasswordStrength(paramName, paramValue) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(paramValue)) {
            throw new ValidationError(`${paramName} should be a strong password (at least 8 characters, including uppercase, lowercase, number, and special character)`);
        }
    }
    #validateIPRange(paramName, paramValue, rangeStart, rangeEnd) {
        const ipToNumber = ip => ip.split('.').reduce((acc, part) => (acc << 8) + parseInt(part, 10), 0);
        const ipValue = ipToNumber(paramValue);
        if (ipValue < ipToNumber(rangeStart) || ipValue > ipToNumber(rangeEnd)) {
            throw new ValidationError(`${paramName} should be in the IP range ${rangeStart} - ${rangeEnd}`);
        }
    }
    /**
     * Validates a request against an params
     *
     * @param {params|object} params - The params to validate against
     * @param {Object} requestData - The request data to validate
     * @throws {ValidationError} If the request does not match the params
     * @returns {null|Object} An object with the properties 'error' and 'status_code' if the request is invalid, null otherwise
     */
    validate(params, requestData) {
        try {
            const missingParameters = params.filter(param => param.mandatory && !requestData[param.name]);
            if (missingParameters.length > 0) {
                throw new ValidationError(`Parameter(s) required missing: ${missingParameters.map(param => param.name).join(', ')}`);
            }

            Object.keys(requestData).forEach(paramName => {

                const foundParam = params.find(param => param.name === paramName);

                if (foundParam) {
                    if (foundParam.type) {
                        this.#validateType(paramName, requestData[paramName], foundParam.type);
                    }
                    if (foundParam.length !== undefined) {
                        this.#validateLength(paramName, requestData[paramName], foundParam.length);
                    }
                    if (foundParam.range) {
                        this.#validateRange(paramName, requestData[paramName], foundParam.range);
                    }
                    if (foundParam.values) {
                        this.#validateValues(paramName, requestData[paramName], foundParam.values);
                    }
                    if (foundParam.regex) {
                        this.#validateRegex(paramName, requestData[paramName], new RegExp(foundParam.regex));
                    }
                    if (foundParam.isEmail) {
                        this.#validateEmail(paramName, requestData[paramName]);
                    }
                    if (foundParam.type === 'date') {
                        this.#validateType(paramName, requestData[paramName], 'date');
                    }
                    if (foundParam.isStrongPassword) {
                        this.#validatePasswordStrength(paramName, requestData[paramName]);
                    }
                    if (foundParam.patternContains) {
                        this.#validatePatternContains(paramName, requestData[paramName], foundParam.patternContains);
                    }
                    if (foundParam.arrayLength !== undefined) {
                        this.#validateArrayLength(paramName, requestData[paramName], foundParam.arrayLength);
                    }
                    if (foundParam.isArrayOfNumbers) {
                        this.#validateArrayOfNumbers(paramName, requestData[paramName]);
                    }
                    if (foundParam.ipRange) {
                        this.#validateIPRange(paramName, requestData[paramName], foundParam.ipRange[0], foundParam.ipRange[1]);
                    }
                    if (foundParam.dateRange) {
                        this.#validateDateRange(paramName, requestData[paramName], foundParam.dateRange[0], foundParam.dateRange[1]);
                    }
                    if (foundParam.isJSON) {
                        this.#validateJSON(paramName, requestData[paramName]);
                    }

                } else {
                    throw new ValidationError(`Unknown parameter: ${paramName}`);
                }
            });

            return null;
        } catch (error) {
            if (error instanceof ValidationError) {
                return {
                    error: error.message,
                    status_code: 400
                };
            }
            throw error;
        }
    }
}

const spectraget = new SpectraGet();
module.exports = spectraget;
