function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function createSearchParamsBuilder(allowedParameters, allowedOperators) {
  const allowedParameterSet = new Set(allowedParameters);
  const allowedOperatorSet = new Set(allowedOperators);

  function validateSearchParameters(params) {
    const illegalParams = Object.keys(params).filter(
      paramName => allowedParameterSet.has(paramName) === false
    );
    if (illegalParams.length > 0) {
      throw new Error(`Illegal search parameter(s): ${
        illegalParams.toString()
      }. Valid parameters: ${
        [...allowedParameterSet].toString()
      }`);
    }
  }

  function validateFilterExpression(expression) {
    const illegalOperators = Object.keys(expression).filter(
      operatorName => allowedOperatorSet.has(operatorName) === false
    );
  
    if (illegalOperators.length > 0) {
      throw new Error(`Illegal filter expression operator(s): ${
        illegalOperators.toString()
      }. Valid operators: ${
        [...allowedOperatorSet].toString()
      }`);
    }
  }

  return function buildUrlSearchParams(options) {
    const {
      skip, 
      limit, 
      attributes,
      searchParams: { or, ...params } = {}
    } = options;
  
    validateSearchParameters(params);
    const normalizedParams = {};
    for (const [attributeName, valueOrExpression] of Object.entries(params)) {
      if (isPlainObject(valueOrExpression)) {
        const expression = valueOrExpression;
        validateFilterExpression(expression);
        for (const [operatorName, value] of Object.entries(expression)) {
          normalizedParams[`${attributeName}${operatorName}`] = value.toString();
        }
      } else {
        const value = valueOrExpression;
        normalizedParams[attributeName] = value.toString();
      }
    }

    if (or) {
      normalizedParams.or = true;
    }

    const result = new URLSearchParams();
    for (const [name, value] of Object.entries({ skip, limit, attributes, ...normalizedParams })) {
      if (typeof value !== 'undefined') {
        result.append(name, value);
      }
    }
  
    return result;
  }
}

module.exports = createSearchParamsBuilder;