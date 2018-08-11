const {
  isObject,
  invert,
  reduce,
} = require('lodash')

const locales = {
  en: {
    ones: {
      '1': 'one',
      '2': 'two',
      '3': 'three',
      '4': 'four',
      '5': 'five',
      '6': 'six',
      '7': 'seven',
      '8': 'eight',
      '9': 'nine',
    },
    tens: {
      '1': 'ten',
      '2': 'twenty',
      '3': 'thirty',
      '4': 'forty',
      '5': 'fifty',
      '6': 'sixty',
      '7': 'seventy',
      '8': 'eighty',
      '9': 'ninety'
    },
    hundreds: {
      '1': 'one hundred',
      '2': 'two hundred',
      '3': 'three hundred',
      '4': 'four hundred',
      '5': 'five hundred',
      '6': 'six hundred',
      '7': 'seven hundred',
      '8': 'eight hundred',
      '9': 'nine hundred',
    },
    exceptions: {
      '11': 'eleven',
      '12': 'twelve',
      '13': 'thirteen',
      '14': 'fourteen',
      '15': 'fifteen',
      '16': 'sixteen',
      '17': 'seventeen',
      '18': 'eighteen',
      '19': 'nineteen'
    },
    powers: [
      'thousand',
      'million',
      'billion',
      'trillion',
      'quadrillion',
      'quintillion',
      'sextillion'
    ],
    and: 'and',
  }
}

class Converter {
  /**
   *
   * @param {Object} [opts] - options for conversion
   * @param {String} [opts.locale] - desired locale
   * @param {String} [opts.separator] - separator between sets of three digits
   */
  constructor({
    locale = 'en',
    separator = '.',
  } = {}) {
    if (!locales[locale]) {
      throw new Error(`Locale must be one of ${Object.keys(locales).join(', ')}`)
    }

    this.locale = {
      fromNumber: locales[locale],
      toNumber: this.invertLocale(locales[locale])
    }

    this.separator = separator
    this.numberRegex = new RegExp('^\\d+$')
  }

  invertLocale(locale) {
    return reduce(locale, (acc, translations, key) => {
      if (isObject(translations) && !Array.isArray(translations)) {
        acc[key] = invert(translations)
      } else {
        acc[key] = translations
      }

      return acc;
    }, {})
  }

  /**
   * Converts text with three or fewer digits to text
   * @param {String} text - text to translate
   * @param {Boolean} includeAnd - include "and" after the hundreds place
   */
  translateSegment(text, includeAnd) {
    if (!text.length) {
      throw new Error('input must have at least one digit')
    }

    let ret = ''

    if (text.length === 3) {
      if (text[0] !== '0') {
        ret = this.locale.fromNumber.hundreds[text[0]]
      }
      text = text.slice(1)

      if (ret && includeAnd && text) {
        ret = `${ret} and`
      }
    }

    if (this.locale.fromNumber.exceptions[text]) {
      ret = `${ret} ${this.locale.fromNumber.exceptions[text] }`
      return ret
    }

    if (text.length === 2) {
      if (text[0] !== '0') {
        ret = `${ret} ${this.locale.fromNumber.tens[text[0]] }`
      }
      text = text.slice(1)
    }

    if (text[0] !== '0') {
      ret = `${ret} ${this.locale.fromNumber.ones[text[0]]}`
    }

    return ret.trim()
  }

  /**
   * Translates number to text
   * @param {String} input - number as string, with separators
   * @return {String} translated number
   */
  fromNumber(input) {
    const segments = input.split(this.separator)

    let powerIndex = segments.length - 2

    return segments
      .map((segment) => {
        let text = this.translateSegment(segment, powerIndex >= 0)

        if (powerIndex >= 0 && text) {
          text = `${text} ${this.locale.fromNumber.powers[powerIndex]}`
        }

        powerIndex -= 1
        return text
      })
      .filter(item => item)
      .join(`, `)
      .trim()
  }

  // /**
  //  * Translates text to number
  //  * @param {String} input - translated text
  //  * @return {String} number, with separators
  //  */
  // toNumber(input) {
  //   const segments = input.split(', ')
  //   const

  //   return
  //     .map((segment) => {

  //     })

  // }
}

module.exports = Converter
