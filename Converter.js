/*
 * Module dependencies
 */

const {
  isObject,
  invert,
  last,
  reduce,
} = require('lodash')

const fs = require('fs')
const path = require('path')

/*
 * Module
 */
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
    this.locale = this.getLocale(locale)
    this.separator = separator
  }

  /**
   * Parses json file for given logale
   * @param {String} locale
   * @return {Object} object containing translations for locale
   */
  getLocale(locale) {
    const locales = fs.readdirSync(path.join(__dirname, 'translations'))
      .filter(item => path.extname(item) === '.json')
      .map(item => path.basename(item, '.json'))

    if (!locales.includes(locale)) {
      throw new Error(`Locale must be one of ${locales.join(', ')}`)
    }

    const data = fs.readFileSync(path.join(__dirname, 'translations', `${locale}.json`), 'utf8')

    const {
      and,
      powers,
      ...translations
    } = JSON.parse(data)

    return {
      fromNumber: translations,
      toNumber: this.invertTranslations(translations),
      and,
      powers,
      invertedPluralPowers: invert(powers.plural),
      pluralPowers: Object.values(powers.plural)
    }
  }

  /**
   * Inverts children of object
   * @param {Object} translations - object with translations to invert
   * @return {Object} object with inverted children
   */
  invertTranslations(translations) {
    return reduce(translations, (acc, values, key) => {
      acc[key] = invert(values)
      return acc;
    }, {})
  }

  /**
   * Converts text with three or fewer digits to text
   * @param {String} text - text to translate
   * @return {String} translated text
   */
  translateSegmentFromNumber(text) {
    if (!text.length) {
      throw new Error('input must have at least one digit')
    }

    let ret = []

    // check for three-digit exceptions
    if (this.locale.fromNumber.exceptions[text]) {
      return this.locale.fromNumber.exceptions[text]
    }

    // hundreds
    if (text.length === 3) { // eslint-disable-line max-args
      if (text[0] !== '0') {
        ret.push(this.locale.fromNumber.hundreds[text[0]])
      }
      text = text.slice(1)

      if (ret.length && text && this.locale.and.position === 'hundreds') {
        ret.push(this.locale.and.text)
      }
    }

    // check for two-digit exceptions
    if (this.locale.fromNumber.exceptions[text]) {
      ret.push(this.locale.fromNumber.exceptions[text])
      return ret.join(' ')
    }

    // tens
    if (text.length === 2) {
      if (text[0] !== '0') {
        ret.push(this.locale.fromNumber.tens[text[0]])
      }
      text = text.slice(1)

      if (ret.length && text && text !== '0' && this.locale.and.position === 'tens') {
        ret.push(this.locale.and.text)
      }
    }

    // ones
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

    // start at highest power of one thousand and work towards the ones
    let powerIndex = segments.length - 2

    return segments
      .map((segment) => {
        let text = this.translateSegmentFromNumber(segment)

        // add power of one thousand -- may be plural in some languages
        if (powerIndex >= 0 && text) {
          const powerText = this.locale.powers.singular[powerIndex]

          if (text !== this.locale.fromNumber.ones['1'] && this.locale.powers.plural[powerText]) {
            text = `${text} ${this.locale.powers.plural[powerText]}`
          } else {
            text = `${text} ${powerText}`
          }
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
    let words = text.split(' ').filter(item => item !== this.locale.and.text)

    // check for three-digit exceptions
    if (this.locale.toNumber.exceptions[words[0]]) {
      return this.locale.toNumber.exceptions[words[0]]
    }

    // hundreds
    if (this.locale.toNumber.hundreds[words[0]]) {
      ret.push(this.locale.toNumber.hundreds[words[0]])
      words = words.slice(1)
    } else if (this.locale.toNumber.hundreds[`${words[0]} ${words[1]}`]) {
      ret.push(this.locale.toNumber.hundreds[`${words[0]} ${words[1]}`])
      words = words.slice(2)
    } else if (pad) {
      ret.push('0')
    }

    // check for two-digit exceptions
    if (words.length && this.locale.toNumber.exceptions[words[0]]) {
      ret.push(this.locale.toNumber.exceptions[words[0]])
      return ret.join()
    }

    // tens
    if (words.length && this.locale.toNumber.tens[words[0]]) {
      ret.push(this.locale.toNumber.tens[words[0]])
      words = words.slice(1)
    } else if (ret.length || pad) {
      ret.push('0')
    }

    // ones
    if (words.length && this.locale.toNumber.ones[words[0]]) {
      ret.push(this.locale.toNumber.ones[words[0]])
    } else {
      ret.push('0')
    }

    return ret.join('')
  }

  /**
   * Determines power of one thousand represented by segment
   * @param {String} segment - segment of text number
   * @return {Number} power of one thousand
   */
  getPowerFromSegment(segment) {
    const word = last(segment.split(' '))

    // highest power word may be singular or plural
    if (this.locale.powers.singular.includes(word)) {
      return this.locale.powers.singular.indexOf(word) + 1
    } else if (this.locale.pluralPowers.includes(word)) {
      return this.locale.powers.singular.indexOf(this.locale.invertedPluralPowers[word]) + 1
    }

    return 0
  }

  /**
   * Translates text to number
   * @param {String} input - translated text
   * @return {String} number, with separators
   */
  toNumber(input) {
    const segments = input.split(', ')

    // cache powers for later
    // the last word of the first segment determines the length of the array
    let highestPowerOfOneThousand = this.getPowerFromSegment(segments[0])

    // intialize array
    const ret = Array(highestPowerOfOneThousand + 1).fill('000')

    for (let i = 0; i < segments.length; i++) {
      // pad after first segment
      const pad = Boolean(i)
      const segment = segments[i]

      // if the segment ends with a word like "thousand", determine its
      // position in the array, remove it, and translate the other text
      const powerIndex = this.getPowerFromSegment(segment)


      // if in final segment below one thousand, return as last element
      // NOTE: this is not the same as checking for the last segment
      // of the input
      if (powerIndex === 0) {
        ret[ret.length - 1] = this.translateSegmentToNumber(segment, pad)
        continue
      }

      // translate everything except the last word
      let toTranslate = segment.split(' ')
      toTranslate = toTranslate.slice(0, toTranslate.length - 1).join(' ')
      ret[ret.length - (powerIndex + 1)] = this.translateSegmentToNumber(toTranslate, pad)
    }

    return ret.join(this.separator)
  }
}

/*
 * Module exports
 */

module.exports = Converter
