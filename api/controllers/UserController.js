/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Passwords = require('machinepack-passwords');
var Gravatar = require('machinepack-gravatar');
module.exports = {
	new:function (req, res){
        res.view();
    },
    
    create: function (req, res, next) {

        delete req.param('roles');
        // Encrypt a string using the BCrypt algorithm.

        Passwords.encryptPassword({
            password: req.param('password'),
            difficulty: 10
        }).exec({
            error: function (err){
                return next(err);
            },

            success: function (encryptedPassword){
                Gravatar.getImageUrl({
                    emailAddress: req.param('email'),
                }).exec({
                    error: function(err){
                        return next(err);
                    },
                    success: function(gravatarUrl){
                        User.create( {name: req.param('name'),
                              lastname: req.param('lastname'),
                              username: req.param('username'),
                              email: req.param('email'),
                              _csrf: req.param('_csrf'),
                              password: encryptedPassword,
                              gravatarUrl: gravatarUrl
                              }, function userCreated (err, user) {

                            if (err) {

                                req.session.flash = {
                                    err: err
                                }
                                return res.redirect('/user/new');
                            }
                            
                            req.session.authenticated = true;
                            req.session.User = user;
                            
                            res.redirect('/user/show/'+user.id); 
                        });                        
                     }
                });    
            },

        }); 
	 
	},
    
    show: function (req, res, next){
        User.findOne(req.param('id'), function foundUser(err, user){
            
            if (err) return next(err);
            
            if(!user) return next();
            
            res.view({
                user: user
            });
        });
    },
    
    index: function (req, res, next){
       
        User.find(function foundUsers(err, users){
            if (err) return next(err);
            
            res.view({
                users:users
            });
        });
    },
    
    edit: function (req, res, next){
        if(req.param('id') === req.session.User.id || req.session.User.roles === 'admin'){
            User.findOne(req.param('id'), function foundUser(err, user){
                
                if (err) return next(err);
                
                if(!user) return next();
                
                res.view({
                    user: user
                });
            });
        }else{
            return res.forbidden('You are not permitted to perform this action.');
        }
    },
    
    update: function (req, res, next){
        if(req.param('id') === req.session.User.id || req.session.User.roles === 'admin'){
            var userData = req.params.all();
            if(req.session.User.roles !== 'admin'){
                delete userData.roles;
            }
            User.update(req.param('id'), req.params.all(), function(err){
                if (err) {
                    return res.redirect('/user/edit/' + req.param('id'));
                }
                
                res.redirect('/user/show/' + req.param('id'));
            });
         }else{
            return res.forbidden('You are not permitted to perform this action.');
        }
    },
    
    destroy: function (req, res, next){
        User.findOne(req.param('id'), function foundUser(err, user){
            if (err) return next(err);
            
            if(!user) return next('User doesnt exist');
            
            User.destroy(req.param('id'), function userDestroyed(err){
                if(err) return next(err);
            });
            
            res.redirect('/user');
        });
    }
};

