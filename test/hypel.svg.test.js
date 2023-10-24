import test from 'node:test'
import assert from 'node:assert/strict'
import { hypel, hypelsvg } from '../hypel.js'
import h from 'hyperscript'

const { svg } = hypel(h)
const { rect } = hypelsvg(h)

test('svg', () => {
  assert.strictEqual(h('svg').nodeName, svg().nodeName)
  assert.strictEqual(h('rect').nodeName, rect().nodeName)
})
