module.exports = function( GLOBAL_APP_CONFIG,GLOBAL_METHODS,GLOBAL_VARS,GLOBAL_API){

const DB = { };

const promisify = function(prom){
  return {
    exec : function(){
      return prom;
    },
    then : function(fn){
      prom.then(fn);
      return {
        catch : function(fn){
          prom.catch(fn);
        }
      }
    }
  }
}

class Collection {
  constructor(col){
    this.ar = [];
    this._id = 1;
    this.modelName = col;
  }
  static _resolveUpdate(dt,fl){
    if(typeof fl === 'object' && fl !== null){
      const kys = Object.keys(fl);
      for(let ky of kys){
        switch(ky){
          case '$inc' :
            const ikys = Object.keys(fl[ky]);
            for(let iky of ikys){
              dt[iky] = (dt[iky] || 0) + fl[ky][iky];
            }
            break;
          default:
            dt[ky] = fl[ky];
        }
      }
    }
  }
  _findOne(fl,op){
    const prom = new Promise((res,rej) => {
      if(typeof fl !== 'object' || fl === null){
        return rej(new Error('invalid filter'));
      }
      const ln = this.ar.length, kys = Object.keys(fl);
      if(!kys.length) return res(this.ar[0]);
      for(let el of this.ar){
        for(let ky of kys){
          if(el[ky] !== fl[ky]) {
            continue;
          }
          return res(el);
        }
      }
      res();
    });
    return prom;
  }
  findOne(fl,op){
    return promisify(new Promise((res,rej)=>{
      this._findOne(fl,op).then(res).catch(rej);
    }));
  }
  create(dt){
    return promisify(new Promise((res,rej)=>{
      this._create(dt).then(res).catch(rej);
    }));
  }
  _create(dt){
    return new Promise((res,rej)=>{
      const tops = Object.assign({ _id: this._id },dt);
      this.ar.push(tops);
      res(tops);
      this._id++;
    });
  }
  findOneAndUpdate(fl,dt,op){
    return promisify(new Promise((res,rej) => {
      this._findOne(fl,op).then((dc)=>{
        if(dc){
          Collection._resolveUpdate(dc,dt);
          res(dc);
        } else if(op && op.upsert){
          dc = {};
          Collection._resolveUpdate(dc,dt);
          this._create(dc);
          res(dc);
        } else {
          res();
        }
      }).catch(rej);
    }));
  }
}

class Mongoose {
  constructor(){
    this.connection = new (require('events'))();
    this.Schema = function(){}
  }
  model(col){
    if(DB.hasOwnProperty(col)) return DB[col];
    DB[col] = new Collection(col);
    return DB[col];
  }
  connect(){
    this.connection.emit('open');
  }
}

const MAP = {
  mongoose : new Mongoose()
};

function func(str){
  if(MAP.hasOwnProperty(str)){
    return MAP[str];
  } else {
    return require(str);
  }
}

return func;

}
