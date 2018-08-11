const Converter = require('../Converter')
const { expect } = require('chai')
const { describe, it } = require('mocha')

describe('spanish', () => {
  describe('translateSegmentToNumber', () => {
    before(() => {
      this.converter = new Converter({ locale: 'es' })
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
      this.converter = new Converter({ locale: 'es' })
    })

    it('1', () => {
      expect(this.converter.translateSegmentFromNumber('001')).to.equal('uno')
    })

    it('001', () => {
      expect(this.converter.translateSegmentFromNumber('001')).to.equal('uno')
    })

    it('707', () => {
      expect(this.converter.translateSegmentFromNumber('707')).to.equal('setecientos y siete')
    })

    it('82', () => {
      expect(this.converter.translateSegmentFromNumber('82')).to.equal('ochenta y dos')
    })

    it('099', () => {
      expect(this.converter.translateSegmentFromNumber('099')).to.equal('noventa y nueve')
    })

    it('123', () => {
      expect(this.converter.translateSegmentFromNumber('155')).to.equal('ciento cincuenta y cinco')
    })
  })


  describe('toNumber', () => {
    before(() => {
      this.converter = new Converter({ locale: 'es' })
    })

    it('cien', () => {
      expect(this.converter.toNumber('cien')).to.equal('100')
    })

    it('tres', () => {
      expect(this.converter.toNumber('tres')).to.equal('3')
    })

    it('treinta y tres', () => {
      expect(this.converter.toNumber('treinta y tres')).to.equal('33')
    })

    it('uno mil, treinta y tres', () => {
      expect(this.converter.toNumber('uno mil, treinta y tres')).to.equal('1.033')
    })

    it('diez millones, uno', () => {
      expect(this.converter.toNumber('diez millones, uno')).to.equal('10.000.001')
    })

    it('quinientos cincuenta y cinco mil, doscientos cuatro', () => {
      expect(this.converter.toNumber('quinientos cincuenta y cinco mil, doscientos cuatro')).to.equal('555.204')
    })
  })

  describe('fromNumber', () => {
    before(() => {
      this.converter = new Converter({ locale: 'es' })
    })

    describe('success', () => {
      describe('standard', () => {
        it('123', () => {
          expect(this.converter.fromNumber('123')).to.equal('ciento vientitres')
        })

        it('5.000', () => {
          expect(this.converter.fromNumber('5.000')).to.equal('cinco mil')
        })

        it('10.001.000', () => {
          expect(this.converter.fromNumber('10.001.000')).to.equal('diez millones, mil')
        })

        it('999.999', () => {
          expect(this.converter.fromNumber('999.999')).to.equal('novecientos noventa y nueve mil, novecientos noventa y nueve')
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