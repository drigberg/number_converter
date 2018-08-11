const Converter = require('../Converter')
const { expect } = require('chai')
const { describe, it } = require('mocha')

describe('opts', () => {
  describe('separator: ","', () => {
    before(() => {
      this.converter = new Converter({ separator: ',' })
    })

    describe('toNumber', () => {
      describe('standard', () => {
        it('one hundred', () => {
          expect(this.converter.toNumber('one hundred')).to.equal('100')
        })

        it('three', () => {
          expect(this.converter.toNumber('three')).to.equal('3')
        })

        it('thirty three', () => {
          expect(this.converter.toNumber('thirty three')).to.equal('33')
        })

        it('one thousand, thirty three', () => {
          expect(this.converter.toNumber('one thousand, thirty three')).to.equal('1,033')
        })

        it('ten million, one', () => {
          expect(this.converter.toNumber('ten million, one')).to.equal('10,000,001')
        })

        it('five hundred fifty five thousand, two hundred four', () => {
          expect(this.converter.toNumber('five hundred fifty five thousand, two hundred four')).to.equal('555,204')
        })

        it('five hundred and fifty five thousand, two hundred and four', () => {
          expect(this.converter.toNumber('five hundred and fifty five thousand, two hundred and four')).to.equal('555,204')
        })
      })
    })
  })

  describe('fromNumber', () => {
    it('123', () => {
      expect(this.converter.fromNumber('123')).to.equal('one hundred and twenty three')
    })

    it('999.999', () => {
      expect(this.converter.fromNumber('999,999')).to.equal('nine hundred and ninety nine thousand, nine hundred and ninety nine')
    })

    it('1.007.562.343', () => {
      expect(this.converter.fromNumber('1,007,562,343')).to.equal('one billion, seven million, five hundred and sixty two thousand, three hundred and forty three')
    })

    it('4.651.007.562.343', () => {
      expect(this.converter.fromNumber('4,651,007,562,343')).to.equal('four trillion, six hundred and fifty one billion, seven million, five hundred and sixty two thousand, three hundred and forty three')
    })

    it('1,212', () => {
      expect(this.converter.fromNumber('1,212')).to.equal('one thousand, two hundred and twelve')
    })
  })
})
