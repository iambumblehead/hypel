import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'crypto'
import {hypel} from '../hypel.js'
import h from 'hyperscript'
import {htmlTagNames} from 'html-tag-names'

const fnnull = elem => {
  [ 'add', 'remove', 'contains', 'toggle', 'toString', 'item' ]
    .map(property => {
      elem.classList[property] = null
    })

  elem._setProperty = null
  elem._getProperty = null

  return null
}

test('div', () => {
  const { div, Div } = hypel(h)
  const attrs = { draggable: 'true', 'data-id': 'dataid' }
  const children = [ 'betty', 'bob', 'june', 'jenny' ]
  
  assert.strictEqual(h('div').nodeName, div().nodeName)
  assert.strictEqual(h('div').nodeName, Div().nodeName)

  assert.deepEqual(fnnull(h('div', attrs)), fnnull(div(attrs)))
  assert.deepEqual(fnnull(h('div', children)), fnnull(div(children)))
  assert.deepEqual(
    fnnull(h('div', attrs, children)), fnnull(div(attrs, children)))
})

test('arbitrary tag', () => {
  const helpers = hypel(h)
  const attrs = { draggable: 'true', 'data-id': 'dataid' }
  const children = [ 'betty', 'bob', 'june', 'jenny' ]

  htmlTagNames.forEach(tag => {
    const Tag = tag.charAt(0).toUpperCase() + tag.slice(1)
    const hypeltag = helpers[tag]
    const hypelTag = helpers[Tag]
    
    assert.strictEqual(h(tag).nodeName, hypeltag().nodeName)
    assert.strictEqual(h(tag).nodeName, hypelTag().nodeName)
    assert.deepEqual(fnnull(h(tag, attrs)), fnnull(hypeltag(attrs)))
    assert.deepEqual(fnnull(h(tag, children)), fnnull(hypeltag(children)))
    assert.deepEqual(
      fnnull(h(tag, attrs, children)), fnnull(hypeltag(attrs, children)))
  })
})

test('custom tag', () => {
  const helpers = hypel(h)
  const tag = crypto.randomBytes(32).toString('hex').replace(/\d/g, '')
  const Tag = tag.charAt(0).toUpperCase() + tag.slice(1)
  const attrs = { draggable: 'true', 'data-id': 'dataid' }
  const children = [ 'betty', 'bob', 'june', 'jenny' ]
  const hypeltag = helpers.createTag(tag)
  const hypelTag = helpers.createTag(Tag)

  assert.strictEqual(h(tag).nodeName, hypeltag().nodeName)
  assert.strictEqual(h(Tag).nodeName, hypelTag().nodeName)
  assert.deepEqual(fnnull(h(tag, attrs)), fnnull(hypeltag(attrs)))
  assert.deepEqual(fnnull(h(tag, children)), fnnull(hypeltag(children)))
  assert.deepEqual(
    fnnull(h(tag, attrs, children)), fnnull(hypeltag(attrs, children)))
})

test('isSelector', () => {
  const helpers = hypel(h)

  assert.ok(helpers.isSelector('.anystring'))
  assert.ok(helpers.isSelector('#anystring'))
  assert.ok(!helpers.isSelector('anystring'))
})

test('arbitrary selector', () => {
  const { div } = hypel(h)
  const name = crypto.randomBytes(32).toString('hex').replace(/\d/g, '')
  const attrs = { draggable: 'true', 'data-id': 'dataid' }
  const children = [ 'betty', 'bob', 'june', 'jenny' ]
  const className = '.' + name
  const id = '.' + name

  assert.deepEqual(fnnull(h('div' + className)), fnnull(div(className)))
  assert.deepEqual(
    fnnull(h('div' + className, attrs)), fnnull(div(className, attrs)))
  assert.deepEqual(
    fnnull(h('div' + className, children)), fnnull(div(className, children)))
  assert.deepEqual(
    fnnull(h('div' + className, attrs, children)),
    fnnull(div(className, attrs, children)))

  assert.deepEqual(fnnull(h('div' + id)), fnnull(div(id)))
  assert.deepEqual(fnnull(h('div' + id, attrs)), fnnull(div(id, attrs)))
  assert.deepEqual(fnnull(h('div' + id, children)), fnnull(div(id, children)))
  assert.deepEqual(
    fnnull(h('div' + id, attrs, children)),
    fnnull(div(id, attrs, children)))
})
