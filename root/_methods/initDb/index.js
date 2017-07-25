module.exports = function( GLOBAL_APP_CONFIG,GLOBAL_METHODS,GLOBAL_VARS,GLOBAL_API){

const CONN_URL = GLOBAL_METHODS.lastValue(GLOBAL_APP_CONFIG,'dbConfig','url');
if(!CONN_URL) return;

const mongoose = GLOBAL_API.root._methods.import('mongoose');
mongoose.Promise = global.Promise;

var DB = mongoose.connection;
mongoose.connect(CONN_URL);

function func(vars,methods,req,res){
  GLOBAL_APP_CONFIG.dbReady = true;
  GLOBAL_APP_CONFIG.postman.emit('db:ready');
}

DB.on('error', console.log.bind(console,'DB_ERROR:'));
DB.once('open', func);
func();

return func;

}
