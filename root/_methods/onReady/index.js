module.exports = function( GLOBAL_APP_CONFIG,GLOBAL_METHODS,GLOBAL_VARS,GLOBAL_API){

function func(vars,methods,req,res){
  GLOBAL_APP_CONFIG.appReady = true;
  GLOBAL_APP_CONFIG.postman.emit('app:ready');
}

return func;

}
