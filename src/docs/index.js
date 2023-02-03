
const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const collections = require('./collections');

module.exports = {
    ...basicInfo,
    ...servers,
    ...components,
    ...tags,
    ...collections
};