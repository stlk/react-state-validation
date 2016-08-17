'use strict'

import test from 'ava'
import {stateValidation, validateKey, flattenErrors} from '../lib'

import React, { Component } from 'react'
import { shallow, mount } from 'enzyme';

test('the stateValidation method is a function', t => {
  t.is(typeof stateValidation, 'function')
  t.pass()
})

test('the stateValidation method will throw an error if no class is passed to it', t => {
  t.throws(() => { stateValidation() }, /React component/)
  t.pass()
})

test('the stateValidation method should overwrite a classes setState method', t => {
  function Foo () { this.state = {} }
  Foo.prototype.setState = bar
  function bar () { }
  t.same(Foo.prototype.setState, bar) // test before because of mutation
  const Qux = stateValidation(Foo)
  t.not(Qux.prototype.setState, bar)
  t.pass()
})

test('the stateValidation metho should validate any state that is intialized in the class', t => {
  class Foo {
    constructor () {
      this.state = {foo: 'bar'}
    }
    setState (_state) {}
  }
  Foo.stateValidations = {
    foo: () => {
      return new Error('baz')
    }
  }
  const Qux = stateValidation(Foo)
  const qux = new Qux({})
  t.is(typeof qux.state.errors, 'object')
  t.true(Array.isArray(qux.state.errors.foo))
  t.is(qux.state.errors.foo[0], 'baz')
  t.pass()
})

test('the stateValidation method should call the original setState method after it has ran the overwritten setState and pass the new version of state', t => {
  class Foo {
    setState (_state) {
      t.is(typeof _state, 'object')
      t.is(_state.foo, 'bar')
      t.is(typeof _state.errors, 'object')
      t.pass()
    }
  }
  const Qux = stateValidation(Foo)
  const qux = new Qux()
  qux.setState({foo: 'bar'})
})

test('the stateValidation method should pass back an array with strings in it if there is validation errors on a state that is being set', t => {
  class Foo {
    setState (_state) {
      t.is(typeof _state, 'object')
      t.is(typeof _state.errors, 'object')
      t.true(Array.isArray(_state.errors.foo))
      t.is(_state.errors.foo[0], 'baz')
      t.pass()
    }
  }
  Foo.stateValidations = {
    foo: () => {
      return new Error('baz')
    }
  }
  const Qux = stateValidation(Foo)
  const qux = new Qux()
  qux.setState({foo: 'bar'})
})

test('the stateValidation method should reset validation errors to undefined when no errors are returned', t => {
  class Foo extends Component {
    render() {
      return <div></div>
    }
  }
  Foo.stateValidations = {
    foo: (state, stateKey, componentName) => {
      if(!state[stateKey]) {
        return new Error('error')
      }
    }
  }
  const Qux = stateValidation(Foo)
  const qux = shallow(<Qux />)
  qux.setState({foo: ''})
  qux.setState({foo: 'bar'})

  const _state = qux.state();
  t.is(typeof _state, 'object')
  t.is(typeof _state.errors, 'object')
  t.is(_state.errors.foo, undefined)
  t.pass()
})

test('the stateValidation method should pass back an array with many strings if an array of errors is passed back from validation', t => {
  class Foo {
    setState (_state) {
      t.true(Array.isArray(_state.errors.foo))
      t.is(_state.errors.foo[0], 'baz')
      t.is(_state.errors.foo[1], 'qux')
      t.pass()
    }
  }
  Foo.stateValidations = {
    foo: () => {
      return [new Error('baz'), new Error('qux')]
    }
  }
  const Qux = stateValidation(Foo)
  const qux = new Qux()
  qux.setState({foo: 'bar'})
})

test('the stateValidations method pass in (state, stateKey, componentName) to the validation function', t => {
  class Foo {
    setState (_state) {
      t.pass()
    }
  }
  Foo.displayName = 'Foo'
  Foo.stateValidations = {
    foo: (state, stateKey, componentName) => {
      t.is(typeof state, 'object')
      t.is(state.foo, 'bar')
      t.is(stateKey, 'foo')
      t.is(componentName, 'Foo')
      return
    }
  }
  const Qux = stateValidation(Foo)
  const qux = new Qux()
  qux.setState({foo: 'bar'})
})

test('the stateValidation method should skip all validations that are not functions', t => {
  class Foo {
    setState (_state) {
      t.is(typeof _state.errors.foo, 'undefined')
      t.pass()
    }
  }
  Foo.stateValidations = {
    foo: /baz/
  }
  const Qux = stateValidation(Foo)
  const qux = new Qux()
  qux.setState({foo: 'bar'})
})

test('the validateKey method is a function', t => {
  t.is(typeof validateKey, 'function')
  t.pass()
})

test('the flattenErrors method is a function', t => {
  t.is(typeof flattenErrors, 'function')
  t.pass()
})

test('the flattenErrors method should return an array', t => {
  const err = new Error('foo')
  t.is(typeof flattenErrors(err), 'object')
  t.is(typeof flattenErrors(err).length, 'number')
  t.pass()
})

test('the flattenErrors method should turn the error into a string', t => {
  const err = new Error('foo')
  t.is(flattenErrors(err)[0], 'foo')
  t.pass()
})
