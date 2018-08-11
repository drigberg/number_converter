const Converter = require('../Converter')
const { expect } = require('chai')
const { describe, it } = require('mocha')

describe('converter', () => {
  describe('toThrees', () => {
    before(() => {
      this.converter = new Converter('en')
    })

    describe('returns sets of three digits', () => {
      it('[success] three digits', () => {
        expect(this.converter.toThrees('123')).to.deep.equal(['123'])
      })

      it('[success] six digits', () => {
        expect(this.converter.toThrees('123456')).to.deep.equal(['123', '456'])
      })

      it('[success] nine digits', () => {
        expect(this.converter.toThrees('123456789')).to.deep.equal(['123', '456', '789'])
      })

      it('[success] seven digits: one left over', () => {
        expect(this.converter.toThrees('1234567')).to.deep.equal(['1', '234', '567'])
      })

      it('[success] eight digits: two left over', () => {
        expect(this.converter.toThrees('12345678')).to.deep.equal(['12', '345', '678'])
      })
    })
  })

  describe('partFromNumber', () => {
    before(() => {
      this.converter = new Converter('en')
    })

    describe('success', () => {
      it('1', () => {
        expect(this.converter.partFromNumber('001')).to.equal('one')
      })

      it('001', () => {
        expect(this.converter.partFromNumber('001')).to.equal('one')
      })

      it('707', () => {
        expect(this.converter.partFromNumber('707')).to.equal('seven hundred seven')
      })

      it('82', () => {
        expect(this.converter.partFromNumber('82')).to.equal('eighty two')
      })

      it('099', () => {
        expect(this.converter.partFromNumber('099')).to.equal('ninety nine')
      })

      it('123', () => {
        expect(this.converter.partFromNumber('123')).to.equal('one hundred twenty three')
      })
    })
  })

  describe('fromNumber', () => {
    before(() => {
      this.converter = new Converter('en')
    })

    describe('success', () => {
      describe('standard', () => {
        it('123', () => {
          expect(this.converter.fromNumber('123')).to.equal('one hundred twenty three')
        })

        it('999999', () => {
          expect(this.converter.fromNumber('999999')).to.equal('nine hundred ninety nine thousand, nine hundred ninety nine')
        })

        it('1007562343', () => {
          expect(this.converter.fromNumber('1007562343')).to.equal('one billion, seven million, five hundred sixty two thousand, three hundred forty three')
        })

        it('4651007562343', () => {
          expect(this.converter.fromNumber('4651007562343')).to.equal('four hundred sixty five trillion, one billion, seven million, five hundred sixty two thousand, three hundred forty three')
        })

        it.only('576432987162354093102', () => {
          expect(this.converter.fromNumber('576432987162354093102')).to.equal('five hundred seventy six quintillion, four hundred thirty two quadrillion, nine hundred eighty seven trillion, one hundred sixty two billion, three hundred fifty four million, ninety three thousand, one hundred two')
        })

        it('5000', () => {
          expect(this.converter.fromNumber('5000')).to.equal('five thousand')
        })

        it('10001000', () => {
          expect(this.converter.fromNumber('10001000')).to.equal('ten million, one thousand')
        })

        it('1000000001', () => {
          expect(this.converter.fromNumber('1000000001')).to.equal('one billion, one')
        })
      })

      describe('exceptions', () => {
        it('11', () => {
          expect(this.converter.fromNumber('11')).to.equal('eleven')
        })

        it('11', () => {
          expect(this.converter.fromNumber('11')).to.equal('eleven')
        })

        it('1212', () => {
          expect(this.converter.fromNumber('1212')).to.equal('one thousand, two hundred twelve')
        })

        it('113112', () => {
          expect(this.converter.fromNumber('113112')).to.equal('one hundred thirteen thousand, one hundred twelve')
        })
      })
    })

    describe('errors', () => {
      it('empty string', () => {
        let error
        try {
          this.converter.fromNumber('')
        } catch (err) {
          error = err
        }

        expect(error.message).to.equal('Input must be a number')
      })

      it('string', () => {
        let error
        try {
          this.converter.fromNumber('aaa')
        } catch (err) {
          error = err
        }

        expect(error.message).to.equal('Input must be a number')
      })
    })
  })
})