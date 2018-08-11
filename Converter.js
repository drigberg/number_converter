const {
  isNumber,
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
    powers: [
      'thousand',
      'million',
      'billion',
      'trillion',
      'quadrillion',
      'quintillion',
      'sextillion'
    ],
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
    }
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

    this.locale = locales[locale]
    this.separator = separator
    this.numberRegex = new RegExp('^\\d+$')
  }

  /**
   * Parses string into sets of three characters from the right
   * @param {String} text - string to parse
   * @return {Array[String]} - array of three characters each, plus leftover
   */
  toThrees(text) {
    function recurse(text, segments) {
      if (text.length >= 3) {
        segments.unshift(text.slice(text.length - 3))
        return recurse(text.slice(0, text.length - 3), segments)
      }

      if (text.length) {
        segments.unshift(text)
      }

      return segments
    }

    return recurse(text, [])
  }

  /**
   * Converts text with three or fewer digits to text
   * @param {String} text
   */
  partFromNumber(text) {
    if (!text.length) {
      throw new Error('input must have at least one digit')
    }

    let ret = ''

    if (text.length === 3) {
      if (text[0] !== '0') {
        ret += this.locale.hundreds[text[0]]
      }
      text = text.slice(1)
    }

    if (this.locale.exceptions[text]) {
      ret = `${ret} ${this.locale.exceptions[text] }`
      return ret
    }

    if (text.length === 2) {
      if (text[0] !== '0') {
        ret = `${ret} ${this.locale.tens[text[0]] }`
      }
      text = text.slice(1)
    }

    if (text[0] !== '0') {
      ret = `${ret} ${this.locale.ones[text[0]]}`
    }

    return ret.trim()
  }

  /**
   *
   * @param {String} number - number
   */
  fromNumber(input) {
    if (!this.numberRegex.test(input)) {
      throw new Error('Input must be a string containing only digits and separators')
    }

    const segments = this.toThrees(String(number))

    let powerIndex = segments.length - 2

    return segments
      .map((segment) => {
        let text = this.partFromNumber(segment)

        if (powerIndex >= 0 && text) {
          text = `${text} ${this.locale.powers[powerIndex]}`
        }

        powerIndex -= 1
        return text
      })
      .filter(item => item)
      .join(`, `)
      .trim()
  }


  toNumber(text) {

  }
}

module.exports = Converter
