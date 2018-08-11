const {
  isObject,
  invert,
  last,
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

    const {
      and,
      powers,
      ...translations
    } = locales[locale]

    this.locale = {
      fromNumber: translations,
      toNumber: this.invertTranslations(translations),
      and,
      powers,
    }

    this.separator = separator
    this.numberRegex = new RegExp('^\\d+$')
  }

  invertTranslations(locale) {
    return reduce(locale, (acc, translations, key) => {
      acc[key] = invert(translations)
      return acc;
    }, {})
  }

  /**
   * Converts text with three or fewer digits to text
   * @param {String} text - text to translate
   * @param {Boolean} includeAnd - include "and" after the hundreds place
   * @return {String} translated text
   */
  translateSegmentFromNumber(text, includeAnd) {
    if (!text.length) {
      throw new Error('input must have at least one digit')
    }

    let ret = []

    if (text.length === 3) { // eslint-disable-line max-args
      if (text[0] !== '0') {
        ret.push(this.locale.fromNumber.hundreds[text[0]])
      }
      text = text.slice(1)

      if (ret.length && includeAnd && text) {
        ret.push(this.locale.and)
      }
    }

    if (this.locale.fromNumber.exceptions[text]) {
      ret.push(this.locale.fromNumber.exceptions[text])
      return ret.join(' ')
    }

    if (text.length === 2) {
      if (text[0] !== '0') {
        ret.push(this.locale.fromNumber.tens[text[0]])
      }
      text = text.slice(1)
    }

    if (text[0] !== '0') {
      ret.push(this.locale.fromNumber.ones[text[0]])
    }

    return ret.join(' ')
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
        let text = this.translateSegmentFromNumber(segment, powerIndex >= 0)

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

  /**
   * Converts text to digits
   * @param {String} text - text to translate
   * @param {Boolean} [pad] - whether to pad zeroes
   * @return {String} digits
   */
  translateSegmentToNumber(text, pad = false) {
    if (!text.length) {
      throw new Error('input must have at least one word')
    }

    let ret = []
    let words = text.split(' ').filter(item => item !== this.locale.and)

    if (this.locale.toNumber.hundreds[words[0]]) {
      ret.push(this.locale.toNumber.hundreds[words[0]])
      words = words.slice(1)
    } else if (this.locale.toNumber.hundreds[`${words[0]} ${words[1]}`]) {
      ret.push(this.locale.toNumber.hundreds[`${words[0]} ${words[1]}`])
      words = words.slice(2)
    } else if (pad) {
      ret.push('0')
    }

    if (words.length && this.locale.toNumber.exceptions[words[0]]) {
      ret.push(this.locale.toNumber.exceptions[words[0]])
      return ret.join()
    }

    if (words.length && this.locale.toNumber.tens[words[0]]) {
      ret.push(this.locale.toNumber.tens[words[0]])
      words = words.slice(1)
    } else if (ret.length || pad) {
      ret.push('0')
    }

    if (words.length && this.locale.toNumber.ones[words[0]]) {
      ret.push(this.locale.toNumber.ones[words[0]])
    } else {
      ret.push('0')
    }

    return ret.join('')
  }

  /**
   * Translates text to number
   * @param {String} input - translated text
   * @return {String} number, with separators
   */
  toNumber(input) {
    const segments = input.split(', ')

    // the last word of the first segment determines the length of the array
    const highestPowerOfOneThousand = this.locale.powers.indexOf(last(segments[0].split(' '))) + 1

    if (highestPowerOfOneThousand === 0) {
      return this.translateSegmentToNumber(input, false)
    }

    const ret = Array(highestPowerOfOneThousand + 1).fill('000')

    for (let i = 0; i < segments.length; i++) {
      const pad = i === 0

      let position = ret.length - 1

      // if the segment ends with a word like "thousand", determine its
      // position and translate the rest
      if (this.locale.powers.includes(last(segment.split(' ')))) {
        position = ret.length - (this.locale.powers.indexOf(last(segment.split(' '))) + 2)

        // translate everything except the last word
        let toTranslate = segment.split(' ')
        toTranslate = toTranslate.slice(0, toTranslate.length - 2).join(' ')

        ret[position] = this.translateSegmentToNumber(toTranslate, pad)
        return
      }

      ret[position] = this.translateSegmentToNumber(segment, pad)
    }

    return ret.join(this.separator)
  }
}

module.exports = Converter
