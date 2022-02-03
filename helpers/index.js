const dbValidators = require('../helpers/db-validators');
const googleVerify = require('../helpers/google-verify');
const jwtGenerator = require('../helpers/jwt-generator');
const swagger = require('../helpers/swagger');
const uploadFile = require('../helpers/upload-file');

module.exports = {
    ...dbValidators,
    ...googleVerify,
    ...jwtGenerator,
    ...swagger,
    ...uploadFile
}