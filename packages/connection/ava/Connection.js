import test from 'ava'
import Connection from '../src'
import EventEmitter from 'events'
import xml from '@xmpp/xml'

test('new Connection()', t => {
  const conn = new Connection()
  t.is(conn.online, false)
  t.true(conn instanceof EventEmitter)
})

test('isStanza()', t => {
  const conn = new Connection()
  conn.NS = 'bar'
  conn.online = true
  t.is(conn.isStanza(xml`<presence/>`), false)
  t.is(conn.isStanza(xml`<iq/>`), false)
  t.is(conn.isStanza(xml`<message/>`), false)
  t.is(conn.isStanza(xml`<foo/>`), false)
  t.is(conn.isStanza(xml`<foo xmlns='bar'/>`), false)
  t.is(conn.isStanza(xml`<presence xmlns='bar'/>`), true)
  t.is(conn.isStanza(xml`<iq xmlns='bar'/>`), true)
  t.is(conn.isStanza(xml`<message xmlns='bar'/>`), true)
})
