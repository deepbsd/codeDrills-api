exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      // 'mongodb://localhost/codeDrills';
                      'mongodb://deepbsd:2D33p4m3!@ds115758.mlab.com:15758/codedrills';
exports.TEST_DATABASE_URL = (
   process.env.TEST_DATABASE_URL ||
   'mongodb://localhost/testapi');

exports.PORT = process.env.PORT || 4000;
