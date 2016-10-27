# React tiny state validation

Validates state using defined validation functions.

## Instalation

```
npm install react-tiny-state-validation
```

## Usage

The `stateValidation` method can be used as a decorator. State is **not validated** until `this.validate()` function is called.

You can define `stateValidations` as a static variable or dynamically in constructor using `this.stateValidations = ...`.

```javascript
import React, {Component} from 'react'
import {stateValidation} from 'react-tiny-state-validation'
const stateValidations = {
  customState: function(state, stateName, componentName) {
    if (!/matchme/.test(state[stateName])) {
      return new Error('Validation failed!');
    }
  }
}

@stateValidation
class App extends Component {
  constructor () {
    super()
    this.state = {
      customState: ''
    }
  }

  _handleSubmit = (e) => {
    e.preventDefault();
    this.validate();
    const { errors } = this.state;
    if(!Object.keys(errors).every((k) => !errors[k])) {
      return null;
    }
    // Validations passed you can now submit the data
  }

  render () {
    // the stateValidation method will set the errors key will the current state errors
    const {errors} = this.state
    // the key of the state will be the same key in the errors object
    const {customState} = errors
    // if there is errors it will be an array of strings
    // eg. ['Validation failed!']
    //...
  }
}

App.stateValidations = stateValidations
```

or if you're not using decorators, you can just wrap the component with the `stateValidation` method.

```javascript
export stateValidation(App)
```

## Contributing

Plz do it! oh and run `npm test`. I use [standard](http://standardjs.com/) for code style/linting, and [ava](https://github.com/sindresorhus/ava) for testing.
