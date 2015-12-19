'use strict'

import test from 'ava'
import {stateValidation, validateKey, flattenErrors} from '../lib'

test('the stateValidation method is a function', t => {
  t.is(typeof stateValidation, 'function')
  t.pass()
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
