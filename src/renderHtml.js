const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const prettyMs = require('pretty-ms');
const propertiesReader = require('properties-reader');
const appRoot = require('app-root-path');
const propFile = appRoot + '/mocha-emailable.properties';

const render = (options, mergedResults) => {
  // Making sure that the tests are in the same order every time
  mergedResults.suites.suites.sort((a, b) => {
    //
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  for (const suite of mergedResults.suites.suites) {
    suite.tests.sort((a, b) => {
      //
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
  }

  const environment = nunjucks.configure(
    [path.join(__dirname, '../templates/')],
    {
      // set folders with templates
      autoescape: true,
    }
  );

  environment.addGlobal('addComments', function (context) {
    let comments = '';

    for (let i = 0; i < context.length; i++) {
      comments += context[i] + '<br/>';
    }

    if (comments !== '') {
      comments += '<br/>';
    }

    return comments;
  });

  environment.addGlobal('prettyMs', function (start, end) {
    return prettyMs(Date.parse(end) - Date.parse(start));
  });

  const customProp = readProperties();
  mergedResults.customProp = customProp;
  const htmlEmail = nunjucks.render('reportEmailBody.html', mergedResults);

  const jsonFile = options.reportFilename + '.json';
  const fileEmailName = options.reportFilename + '.html';
  const fileEmailPath = path.join(options.reportDir, fileEmailName);
  const fileJsonPath = path.join(options.reportDir, jsonFile);

  if (!fs.existsSync(options.reportDir)) {
    fs.mkdirSync(options.reportDir);
  }

  fs.writeFileSync(fileJsonPath, JSON.stringify(mergedResults));
  fs.writeFileSync(fileEmailPath, htmlEmail);
};

const renderHtml = (options, output) => {
  render(options, output);
};

function readProperties() {
  const customProp = {};

  if (fs.existsSync(propFile)) {
    const properties = propertiesReader(propFile);
    const regex = /\${[^\s]*}/g;

    for (const i of Object.keys(properties._properties)) {
      const match = properties._properties[i].match(regex);
      if (match && match.length) {
        for (const e of match) {
          const envValue = process.env[e.slice(2, -1)];
          if (envValue) {
            customProp[i] = properties._properties[i].replace(e, envValue);
          }
        }
      } else {
        customProp[i] = properties._properties[i];
      }
    }
  }

  return customProp;
}

module.exports = renderHtml;
