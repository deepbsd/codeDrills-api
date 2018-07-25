exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      //'mongodb://localhost/codeDrills';
                      'mongodb://deepbsd:2D33p4m3!@ds115758.mlab.com:15758/codedrills';
exports.TEST_DATABASE_URL = (
   process.env.TEST_DATABASE_URL ||
   //'mongodb://localhost/testapi');
    'mongodb://deepbsd:2D33p4m3!@ds253871.mlab.com:53871/testapi';


exports.PORT = process.env.PORT || 4000;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
