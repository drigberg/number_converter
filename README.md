# NumberConverter

Not complete! Just an exercise. Do not clone and expect the Spanish to be 100% grammatically correct (ex: uno mil vs. un mil)

### usage

Supports English (en) and Spanish (es):

```js
const englishConv = new Converter({ locale: 'en', separator: ',' })
enConv.fromNumber('1,234,111') // one million, two hundred thirty four thousand, one hundred eleven
enConv.toNumber('one hundred thousand, one hundred twenty three') // 100,123

const spanishConv = new Converter({ locale: 'es', separator: '.' })
enConv.fromNumber('10.000.001') // diez millones, uno
enConv.toNumber('novecientos noventa y nueve mil, novecientos noventa y nueve') // 999.999
```
