const Converter = require('../Converter')
const { expect } = require('chai')
const { describe, it } = require('mocha')

describe('converter', () => {
  describe('translateSegmentToNumber', () => {
    before(() => {
      this.converter = new Converter('en')
    })

    it('uno', () => {
      expect(this.converter.translateSegmentToNumber('uno')).to.equal('1')
    })

    it('uno (padded)', () => {
      expect(this.converter.translateSegmentToNumber('uno', true)).to.equal('001')
    })

    it('noventa y nueve', () => {
      expect(this.converter.translateSegmentToNumber('noventa y nueve', false)).to.equal('99')
    })

    it('noventa y nueve (padded)', () => {
      expect(this.converter.translateSegmentToNumber('noventa y nueve', true)).to.equal('099')
    })

    it('cien', () => {
      expect(this.converter.translateSegmentToNumber('cien', false)).to.equal('100')
    })

    it('cien (padded)', () => {
      expect(this.converter.translateSegmentToNumber('cien', true)).to.equal('100')
    })

    it('quinientos y cinco', () => {
      expect(this.converter.translateSegmentToNumber('quinientos y cinco', false)).to.equal('505')
    })

    it('quinientos cinco', () => {
      expect(this.converter.translateSegmentToNumber('quinientos cinco', false)).to.equal('505')
    })
  })

  describe('translateSegmentFromNumber', () => {
    before(() => {
      this.converter = new Converter('en')
    })

    describe('success', () => {
      it('1', () => {
        expect(this.converter.translateSegmentFromNumber('001')).to.equal('one')
      })

      it('001', () => {
        expect(this.converter.translateSegmentFromNumber('001')).to.equal('one')
      })

      it('707', () => {
        expect(this.converter.translateSegmentFromNumber('707')).to.equal('seven hundred and seven')
      })

      it('82', () => {
        expect(this.converter.translateSegmentFromNumber('82')).to.equal('eighty two')
      })

      it('099', () => {
        expect(this.converter.translateSegmentFromNumber('099')).to.equal('ninety nine')
      })

      it('123', () => {
        expect(this.converter.translateSegmentFromNumber('123')).to.equal('one hundred and twenty three')
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
          expect(this.converter.toNumber('one hundred')).to.equal('100')
        })

        it('three', () => {
          expect(this.converter.toNumber('three')).to.equal('3')
        })

        it('thirty three', () => {
          expect(this.converter.toNumber('thirty three')).to.equal('33')
        })

        it('one thousand, thirty three', () => {
          expect(this.converter.toNumber('one thousand, thirty three')).to.equal('1.033')
        })

        it('ten million, one', () => {
          expect(this.converter.toNumber('ten million, one')).to.equal('10.000.001')
        })

        it('five hundred fifty five thousand, two hundred four', () => {
          expect(this.converter.toNumber('five hundred fifty five thousand, two hundred four')).to.equal('555.204')
        })

        it('five hundred and fifty five thousand, two hundred and four', () => {
          expect(this.converter.toNumber('five hundred and fifty five thousand, two hundred and four')).to.equal('555.204')
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
          expect(this.converter.fromNumber('123')).to.equal('one hundred and twenty three')
        })

        it('999.999', () => {
          expect(this.converter.fromNumber('999.999')).to.equal('nine hundred and ninety nine thousand, nine hundred and ninety nine')
        })

        it('1.007.562.343', () => {
          expect(this.converter.fromNumber('1.007.562.343')).to.equal('one billion, seven million, five hundred and sixty two thousand, three hundred and forty three')
        })

        it('4.651.007.562.343', () => {
          expect(this.converter.fromNumber('4.651.007.562.343')).to.equal('four trillion, six hundred and fifty one billion, seven million, five hundred and sixty two thousand, three hundred and forty three')
        })

        it('1.576.432.987.162.354.093.102', () => {
          expect(this.converter.fromNumber('1.576.432.987.162.354.093.102')).to.equal('one sextillion, five hundred and seventy six quintillion, four hundred and thirty two quadrillion, nine hundred and eighty seven trillion, one hundred and sixty two billion, three hundred and fifty four million, ninety three thousand, one hundred and two')
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
          expect(this.converter.fromNumber('1.212')).to.equal('one thousand, two hundred and twelve')
        })

        it('113.112', () => {
          expect(this.converter.fromNumber('113.112')).to.equal('one hundred and thirteen thousand, one hundred and twelve')
        })
      })
    })

    describe('errors', () => {
      // TODO
    })
  })
})