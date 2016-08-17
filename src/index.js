'use strict'

import invariant from 'invariant'

function stateValidation (DecoratedComponent) {
  invariant(DecoratedComponent, 'A React component needs to be passed to the decorator')
  const {stateValidations, prototype, propTypes, defaultProps, displayName} = DecoratedComponent
  const {setState: _setState, constructor: _super} = prototype
  const validations = stateValidations || {}

  function StateValidation (...args) {
    const ret = _super.call(this, ...args)
    if (this.state) {
      this.state = Object.assign({errors: {}}, this.state)
    }
    return ret
  }
  StateValidation.prototype = prototype
  StateValidation.prototype.setState = function setState (state = {}) {
    const _state = Object.assign({errors: {}}, this.state || {}, state)
    _setState.call(this, validateState(_state, displayName, validations))
  }
  StateValidation.displayName = `StateValidation(${displayName})`
  StateValidation.propTypes = propTypes
  StateValidation.defaultProps = defaultProps
  StateValidation.stateValidations = stateValidations
  return StateValidation
}

function validateState (state, displayName, validations) {
  for (let key in state) {
    const validation = validateKey({
      state,
      key,
      displayName,
      validations
    })
    state.errors[key] = flattenErrors(validation)
  }
  return state
}

function validateKey ({state, key, validations, displayName}) {
  if (!validations[key]) return
  if (typeof validations[key] !== 'function') {
    return console.warn(`state validations for ${key} needs to be a function`)
  }
  return validations[key](state, key, displayName)
}

function flattenErrors (err) {
  if (typeof err === 'object' && err.length) {
    return err.map((_err) => _err.message)
  }
  if (err) {
    return [err.message]
  }
}

export {stateValidation, validateKey, flattenErrors}
