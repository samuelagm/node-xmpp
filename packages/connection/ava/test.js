const test = require('ava')
const Connection = require('..')
const EventEmitter = require('events')
const xml = require('@xmpp/xml')

test('new Connection()', t => {
  const conn = new Connection()
  t.is(conn.online, false)
  t.is(conn._domain, null)
  t.is(conn.lang, null)
  t.is(conn.jid, null)
  t.is(conn.timeout, 2000)
  t.true(conn instanceof EventEmitter)
})

test('isStanza()', t => {
  const conn = new Connection()
  conn.NS = 'bar'
  conn.online = true

  t.is(conn.isStanza(xml`<foo/>`), false)
  t.is(conn.isStanza(xml`<foo xmlns='bar'/>`), false)

  t.is(conn.isStanza(xml`<presence/>`), false)
  t.is(conn.isStanza(xml`<iq/>`), false)
  t.is(conn.isStanza(xml`<message/>`), false)

  t.is(conn.isStanza(xml`<presence xmlns='bar'/>`), true)
  t.is(conn.isStanza(xml`<iq xmlns='bar'/>`), true)
  t.is(conn.isStanza(xml`<message xmlns='bar'/>`), true)

  conn.online = false

  t.is(conn.isStanza(xml`<presence xmlns='bar'/>`), false)
  t.is(conn.isStanza(xml`<iq xmlns='bar'/>`), false)
  t.is(conn.isStanza(xml`<message xmlns='bar'/>`), false)
  t.is(conn.isStanza(xml`<foo xmlns='bar'/>`), false)
})

test('isNonza()', t => {
  const conn = new Connection()
  conn.NS = 'bar'
  conn.online = true

  t.is(conn.isNonza(xml`<foo/>`), true)
  t.is(conn.isNonza(xml`<foo xmlns='bar'/>`), true)

  t.is(conn.isNonza(xml`<presence/>`), true)
  t.is(conn.isNonza(xml`<iq/>`), true)
  t.is(conn.isNonza(xml`<message/>`), true)

  t.is(conn.isNonza(xml`<presence xmlns='bar'/>`), false)
  t.is(conn.isNonza(xml`<iq xmlns='bar'/>`), false)
  t.is(conn.isNonza(xml`<message xmlns='bar'/>`), false)

  conn.online = false

  t.is(conn.isNonza(xml`<presence xmlns='bar'/>`), true)
  t.is(conn.isNonza(xml`<iq xmlns='bar'/>`), true)
  t.is(conn.isNonza(xml`<message xmlns='bar'/>`), true)
  t.is(conn.isNonza(xml`<foo xmlns='bar'/>`), true)
})
