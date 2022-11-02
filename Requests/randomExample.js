var assert = require('chai').assert;


assert.include({ "foo": 'bar', hello: 'universe' }, { foo: 'bar' }, 'object contains property');
