/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Passwords = require('machinepack-passwords');

module.exports = {
	'new': function(req, res){
        res.view('session/new');
    },
    
    create: function(req, res, next){
        
        if(!req.param('email') || !req.param('password')){
            
            var usernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message:'You must enter both username and password'}];
            
            req.session.flash = {
                err: usernamePasswordRequiredError
            }
            
            res.redirect('/session/new');
            return;
        }    
        User.findOne({email:req.param('email')}).exec(function(err, user){
            if(err) return next(err);
            
            if(!user){
                var noAccountError = [{name: 'noAccount', message: 'the email address: '+req.param('email')+' not found.'}];
                req.session.flash= {
                    err: noAccountError
                }
                res.redirect('/session/new');
                return;
            }
            
            Passwords.checkPassword({
                passwordAttempt: req.param('password'),
                encryptedPassword: user.password,
            }).exec({
                error: function (err){
                    return next(err);
                },
                incorrect: function (){
                    var noMatchPassword = [{name: 'noPassword', message: 'Password attempt does not match '}];
                    req.session.flash = {
                        err: noMatchPassword
                    }
                    res.redirect('/session/new');
                    return;
                },
                success: function (){
                    req.session.authenticated = true;
                    req.session.User = user;
                    res.redirect('/user/show/'+user.id);
                },

            }); 
        });
    },
    
    destroy: function(req, res, next) {

			// Wipe out the session (log out)
			req.session.destroy();

			// Redirect the browser to the sign-in screen
			res.redirect('/session/new');
			
	}
     
};

