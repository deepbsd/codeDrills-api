exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      //'mongodb://localhost/codeDrills';
                      //'mongodb://deepbsd:WRSt7MVDsSTN!fM@codedrills.zm5qb.mongodb.net/codeDrills?retryWrites=true&w=majority';
                      //'mongodb+srv://deepbsd:WRSt7MVDsSTN!fM@codedrills.zm5qb.mongodb.net/codeDrills?retryWrites=true&w=majority';
                      'mongodb+srv://deepbsd:25EAz7msb+D5UJ#@codedrills.zm5qb.mongodb.net/codeDrills?retryWrites=true&w=majority';
exports.TEST_DATABASE_URL = (
   process.env.TEST_DATABASE_URL ||
   //'mongodb://localhost/testapi');
   //'mongodb://deepbsd:WRSt7MVDsSTN!fM@codedrills.zm5qb.mongodb.net/testapi');
   'mongodb+srv://deepbsd:25EAz7msb+D5UJ#@codedrills.zm5qb.mongodb.net/testapi');


exports.PORT = process.env.PORT || 4000;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
