const Converter = require('../Converter')
const { expect } = require('chai')
const { describe, it } = require('mocha')

describe('converter', () => {
  describe('translateSegment', () => {
    before(() => {
      this.converter = new Converter('en')
    })

    describe('success', () => {
      it('1', () => {
        expect(this.converter.translateSegment('001')).to.equal('one')
      })

      it('001', () => {
        expect(this.converter.translateSegment('001')).to.equal('one')
      })

      it('707', () => {
        expect(this.converter.translateSegment('707')).to.equal('seven hundred seven')
      })

      it('82', () => {
        expect(this.converter.translateSegment('82')).to.equal('eighty two')
      })

      it('099', () => {
        expect(this.converter.translateSegment('099')).to.equal('ninety nine')
      })

      it('123', () => {
        expect(this.converter.translateSegment('123')).to.equal('one hundred twenty three')
      })
    })
  })


  describe('toNumber', () => {
    before(() => {
      this.converter = new Converter()
    })

    describe('success', () => {
      describe('standard', () => {
        it('one hundred', () => {
          expect(this.converter.fromNumber('one hundred')).to.equal('100')
        })

        it('three', () => {
          expect(this.converter.fromNumber('three')).to.equal('3')
        })

        it('five hundred fifty five thousand, two hundred four', () => {
          expect(this.converter.fromNumber('five hundred and fifty five thousand, two hundred four')).to.equal('555.204')
        })
      })

      describe('exceptions', () => {

      })
    })
  })

  describe('fromNumber', () => {
    before(() => {
      this.converter = new Converter()
    })

    describe('success', () => {
      describe('standard', () => {
        it('123', () => {
          expect(this.converter.fromNumber('123')).to.equal('one hundred twenty three')
        })

        it('999.999', () => {
          expect(this.converter.fromNumber('999.999')).to.equal('nine hundred and ninety nine thousand, nine hundred ninety nine')
        })

        it('1.007.562.343', () => {
          expect(this.converter.fromNumber('1.007.562.343')).to.equal('one billion, seven million, five hundred and sixty two thousand, three hundred forty three')
        })

        it('4.651.007.562.343', () => {
          expect(this.converter.fromNumber('4.651.007.562.343')).to.equal('four trillion, six hundred and fifty one billion, seven million, five hundred and sixty two thousand, three hundred forty three')
        })

        it('1.576.432.987.162.354.093.102', () => {
          expect(this.converter.fromNumber('1.576.432.987.162.354.093.102')).to.equal('one sextillion, five hundred and seventy six quintillion, four hundred and thirty two quadrillion, nine hundred and eighty seven trillion, one hundred and sixty two billion, three hundred and fifty four million, ninety three thousand, one hundred two')
        })

        it('5.000', () => {
          expect(this.converter.fromNumber('5.000')).to.equal('five thousand')
        })

        it('10.001.000', () => {
          expect(this.converter.fromNumber('10.001.000')).to.equal('ten million, one thousand')
        })

        it('1.000.000.001', () => {
          expect(this.converter.fromNumber('1.000.000.001')).to.equal('one billion, one')
        })
      })

      describe('exceptions', () => {
        it('11', () => {
          expect(this.converter.fromNumber('11')).to.equal('eleven')
        })

        it('11', () => {
          expect(this.converter.fromNumber('11')).to.equal('eleven')
        })

        it('1.212', () => {
          expect(this.converter.fromNumber('1.212')).to.equal('one thousand, two hundred twelve')
        })

        it('113.112', () => {
          expect(this.converter.fromNumber('113.112')).to.equal('one hundred and thirteen thousand, one hundred twelve')
        })
      })
    })

    describe('errors', () => {
      // TODO
    })
  })
})