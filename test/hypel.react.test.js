import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'crypto'
import React from 'react'
import {htmlTagNames} from 'html-tag-names'
import { hypel } from '../hypel.js'

test('div', () => {
  const { div } = hypel(React.createElement)
  const attrs = { draggable: 'true', 'data-id': 'dataid' }
  const children = [ 'betty', 'bob', 'june', 'jenny' ]
  
  assert.strictEqual(
    React.createElement('div').nodeName, div().nodeName)

  assert.deepEqual(React.createElement('div', attrs), div(attrs))
  assert.deepEqual(React.createElement('div', children), div(children))
  assert.deepEqual(
    React.createElement('div', attrs, children), div(attrs, children))
})

test('arbitrary tag', () => {
  const helpers = hypel(React.createElement)
  const attrs = { draggable: 'true', 'data-id': 'dataid' }
  const children = [ 'betty', 'bob', 'june', 'jenny' ]

  htmlTagNames.forEach(tag => {
    const Tag = tag.charAt(0).toUpperCase() + tag.slice(1)
    const hypeltag = helpers[tag]
    const hypelTag = helpers[Tag]
    
    assert.strictEqual(React.createElement(tag).nodeName, hypeltag().nodeName)
    assert.strictEqual(React.createElement(tag).nodeName, hypelTag().nodeName)
    assert.deepEqual(React.createElement(tag, attrs), hypeltag(attrs))
    assert.deepEqual(React.createElement(tag, children), hypeltag(children))
    assert.deepEqual(
      React.createElement(tag, attrs, children), hypeltag(attrs, children))
  })
})

test('isSelector', () => {
  const helpers = hypel(React.createElement)

  assert.ok(helpers.isSelector('.anystring'))
  assert.ok(helpers.isSelector('#anystring'))
  assert.ok(!helpers.isSelector('anystring'))
})

test('arbitrary selector', () => {
  const { div } = hypel(React.createElement)
  const name = crypto.randomBytes(32).toString('hex').replace(/\d/g, '')
  const attrs = { draggable: 'true', 'data-id': 'dataid' }
  const children = [ 'betty', 'bob', 'june', 'jenny' ]
  const className = '.' + name
  const id = '.' + name

  assert.deepEqual(React.createElement('div' + className), div(className))
  assert.deepEqual(
    React.createElement('div' + className, attrs), div(className, attrs))
  assert.deepEqual(
    React.createElement('div' + className, children), div(className, children))
  assert.deepEqual(
    React.createElement('div' + className, attrs, children),
    div(className, attrs, children))

  assert.deepEqual(React.createElement('div' + id), div(id))
  assert.deepEqual(React.createElement('div' + id, attrs), div(id, attrs))
  assert.deepEqual(React.createElement('div' + id, children), div(id, children))
  assert.deepEqual(
    React.createElement('div' + id, attrs, children), div(id, attrs, children))
})
