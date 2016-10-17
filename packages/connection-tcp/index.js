const Socket = require('net').Socket
const Connection = require('@xmpp/connection')
const StreamParser = require('./lib/StreamParser')
const {tagString, Element} = require('@xmpp/xml')

const NS_STREAM = 'http://etherx.jabber.org/streams'

/* References
 * Extensible Messaging and Presence Protocol (XMPP): Core http://xmpp.org/rfcs/rfc6120.html
*/

class TCP extends Connection {
  // FIXME is lang useful?
  // https://xmpp.org/rfcs/rfc6120.html#streams-open
  waitHeader (domain, lang, fn) {
    const handler = (name, attrs) => {
      if (name !== 'stream:stream') return // FIXME error
      // disabled because component doesn't use this
      // if (attrs.version !== '1.0') return // FIXME error
      if (attrs.xmlns !== this.NS) return // FIXME error
      if (attrs['xmlns:stream'] !== NS_STREAM) return // FIXME error
      if (attrs.from !== domain) return // FIXME error
      if (!attrs.id) return // FIXME error
      fn(null, new Element(name, attrs))
    }
    this.parser.once('startElement', handler)
  }

  // https://xmpp.org/rfcs/rfc6120.html#streams-open
  header (domain, lang) {
    return tagString`
      <?xml version='1.0'?>
      <stream:stream to='${domain}' version='1.0' xml:lang='${lang}' xmlns='${this.NS}' xmlns:stream='${NS_STREAM}'>
    `
  }

  // // https://xmpp.org/rfcs/rfc6120.html#streams-close
  // waitFooter (fn) {
  //   this.parser.once('endElement', (name) => {
  //     if (name !== 'stream:stream') return // FIXME error
  //     fn()
  //   })
  // }

  // https://xmpp.org/rfcs/rfc6120.html#streams-close
  footer () {
    return '<stream:stream/>'
  }

  static match (uri) {
    return uri.startsWith('xmpp:') ? uri : false
  }
}

TCP.NS = NS_STREAM
TCP.prototype.NS = NS_STREAM
TCP.prototype.Socket = Socket
TCP.prototype.Parser = StreamParser

module.exports = TCP
