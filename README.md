# mocha-emailable

Generates test results in the a single page emailable HTML. Cloned from [mochawesome](https://github.com/adamgruber/mochawesome), this is pretty much a clone with the exception of generating a single page HTML report instead of merged json file.

## Usage

1. Add to your project:

`npm install --save-dev mocha-emailable`

2. Tell mocha to use the mocha-emailable reporter:

`mocha testfile.js --reporter mocha-emailable`

1. If using programatically:

```js
var mocha = new Mocha({
  reporter: 'mocha-emailable',
});
```

### Parallel Mode

Since `mocha@8` test files can be run in parallel using the `--parallel` flag. In order for mocha-emailable to work properly it needs to be registered as a hook.

`mocha tests --reporter mocha-emailable --require mocha-emailable/register`

The two main files to be aware of are:

**result.html** - The rendered report file

**result.json** - The raw json output used to render the report

## Custom variable

Custom variable can be included in the result html by creating `mocha-emailable.properties` file in the project root. Additionally, environment variable can also be used in real time.

```
// Set environment variable
export BASE_URL=http://www.test.com

// Properties file
NAME=Test
BASE_URL=${BASE_URL}
```

### Options

Options can be passed to the reporter in two ways.

#### Mocha reporter-options

You can pass comma-separated options to the reporter via mocha's `--reporter-options` flag. Options passed this way will take precedence over environment variables.

```bash
mocha test.js --reporter mocha-emailable --reporter-options reportDir=customReportDir,reportFilename=customReportFilename
```

Alternately, `reporter-options` can be passed in programatically:

```js
var mocha = new Mocha({
  reporter: 'mocha-emailable',
  reporterOptions: {
    reportFilename: 'customReportFilename',
    reportDir: './here',
  },
});
```

### `addContext(testObj, context)`

| param   | type           | description                         |
| :------ | :------------- | :---------------------------------- |
| testObj | object         | The test object                     |
| context | string | The context to be added to the test |

#### Example

Be sure to use ES5 functions and not ES6 arrow functions when using `addContext` to ensure `this` references the test object.

```js
import * as addContext from 'mocha-emailable/addContext';

describe('test suite', function () {
  it('should add context', function () {
    // context can be a simple string
    addContext(this, 'simple string');
  });
});
```

## License

mocha-emailable is [MIT licensed][license].

[license]: LICENSE.md
