/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {

  attributes: {
      
      schema: true,
      
      name: {
          type: 'string',
          required: true,
          size: 20
      },
      lastname: {
          type: 'string',
          required: true,
          size: 20
      },
      username: {
          type: 'string',
          required: true,
          size: 20,
          unique: true
      },
      email: {
          type: 'email',
          required: true,
          unique: true
      },
      password: {
          type: 'string',
          required: true,
      },
      roles: {
          type: 'string',
          enum: ['user','admin','teacher'],
          defaultsTo: 'user',
          required: true
      },
      job: {
          type: 'string',
      },
      about: {
          type: 'text'
      },
      
      toJSON: function(){
          var obj = this.toObject();
          delete obj.password;
          delete obj.confirmation;
          delete obj._csrf;
          return obj;
      }
     
  }
};

