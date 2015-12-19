'use strict'

import invariant from 'invariant'

function stateValidation (DecoratedComponent) {
  invariant(DecoratedComponent, 'A React component needs to be passed to the decorator')
  const {stateValidations, prototype} = DecoratedComponent
  const {setState: _setState, displayName} = prototype
  const validations = stateValidations || {}
  DecoratedComponent.prototype.setState = function setState (state = {}) {
    state.errors = {}
    for (let key in state) {
      const validation = validateKey({
        state,
        key,
        displayName,
        validations
      })
      if (validation) {
        state.errors[key] = flattenErrors(validation)
      }
    }
    _setState.call(this, state)
  }
  return DecoratedComponent
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
  return [err.message]
}

export {stateValidation, validateKey, flattenErrors}
