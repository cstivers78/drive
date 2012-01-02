const _ = require('underscore');
const fs = require('fs');
const path = require('path');

module.exports = fs;

readdirRec = module.exports.readdirRec = function(directory, files) {
  files = files || [];

  const rr = function(dir) {
    const filenames = fs.readdirSync(dir);
    filenames.forEach(function(filename){
      const file = path.resolve(dir, filename);
      const stat = fs.statSync(file);
      if ( stat.isFile() ) {
        files.push(file.substring(directory.length + 1));
      }
      else {
        rr(file,files);
      }
    });
    return files;
  };

  return rr(directory);
};

findExistingParent = function(directory,callback) {
  fs.stat(directory,function(err,stat){
    if ( err ) {
      if ( err.code == 'ENOENT' ) {
        findExistingParent(path.resolve(directory,'..'),callback);
      }
      else {
        callback(err);
      }
    }
    else {
      if ( stat.isDirectory() ) {
        callback(null, directory); 
      }
      else {
        callback("name conflict");
      }
    }
  });
}


mkdirRec = module.exports.mkdirRec = function(directory,fn) {
  findExistingParent(directory,function(err,parent){
    if ( parent == directory ) {
      fn();
    }
    else if ( err ) {
      fn(err)
    }
    else {
      const children = directory.substring(parent.length+1).split('/');
      createChildDirectory(parent,children);
    }
  });

  const createChildDirectory = function(parent,children) {
    if ( children.length <= 0 ) {
      fn()
    }
    else {
      const dirpath = path.resolve(parent,children.shift());
      fs.mkdir(dirpath,function(err){
        if ( err ) {
          fn(err)
        } 
        else {
          createChildDirectory(dirpath,children)
        }
      });
    }
  }
};