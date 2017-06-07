module.exports = function( GLOBAL_APP_CONFIG,GLOBAL_METHODS,GLOBAL_VARS,GLOBAL_API){

var HTML = '';//READ_FROM_FILE,index.html

function func(vars,methods,req,res,next){
  next(HTML);
}

return func;

}
