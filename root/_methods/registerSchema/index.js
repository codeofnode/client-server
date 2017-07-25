module.exports = function( GLOBAL_APP_CONFIG,GLOBAL_METHODS,GLOBAL_VARS,GLOBAL_API){

if(!GLOBAL_APP_CONFIG.dbReady){
  return function(){};
}
const dbPrefix = GLOBAL_METHODS.lastValue(GLOBAL_APP_CONFIG,'dbConfig','dbPrefix') || 'col_';
const mongoose = GLOBAL_API.root._methods.import('mongoose');
const Schema = mongoose.Schema;

function func(name,schema,schemaOptions,func){
  schemaOptions = Object.assign({
    versionKey : false
  },schemaOptions);
  schema = new Schema(schema,schemaOptions);
  if(typeof func === 'function') func(schema);
  mongoose.model(name, schema, dbPrefix+name);
}

return func;

}
