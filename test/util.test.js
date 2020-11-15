const assert = require('assert')
const util = require('./../lib/util')

describe('test util', function () {
  it('should return [object String] for string variable', function () {
    assert.strictEqual(util.typeNameOf(''), '[object String]')
  })

  it('should capitalized input word', function () {
    const inputWord = 'userName'
    const expectedCapitalizedWord = 'UserName'
    assert.strictEqual(util.firstCappedWord(inputWord), expectedCapitalizedWord)
  })
})
