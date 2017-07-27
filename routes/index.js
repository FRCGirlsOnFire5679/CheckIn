// Again we are importing the libraries we are going to use
var express = require('express');
var https = require('https');
var qs = require("querystring");
var moment = require("moment");
var db = require('./bookshelf');

var router = express.Router();

let Attendee = db.Model.extend({
         tableName: 'Attendees',
         events: function() {
             return this.hasMany(AttnEvent);
         }
     });

 let AttnEvent = db.Model.extend({
    tableName: 'AttendanceEvent',
    attendee: function() {
        return this.belongsTo(Attendee);
    }
 });

/*
 * GET home page
 */
 
 router.get('/', function(req, res, next) { 
    res.render('index', { title: 'Girls On Fire 5679 Attendance' });
 }); 
 router.post('/', function(req, res, next) {
    console.log('Post action');
    req.checkBody('userid', 'User ID is required.').notEmpty();

    req.sanitize('userid').escape();
    req.sanitize('userid').trim();
    
    var errors = req.validationErrors();
    
    if(errors)
    {
        res.render('index', { title: 'Girls On Fire 5679 Attendance', errors: errors });
    }
    else
    {
        new Attendee({'PersonalId': req.body.userid})
        .fetch()
        .then(function(model) {
            console.log(model.attributes.FirstName + ' ' + model.attributes.LastName);
            res.render('index', { title: 'Girls On Fire 5679 Attendance', person: {'FirstName': model.attributes.FirstName, 'LastName': model.attributes.LastName}});
        })
        .catch(function(err) {
            console.log(err);
        });
    }
 });

 router.get('/members', function(req, res, next) {
     Attendee.fetchAll().then(function (list) {
        var attendee_list = new Array();
        for(var item in list.models) {
            if(item) {
                var person = {
                    id: list.models[item].attributes.AttendeeId,
                    first_name: list.models[item].attributes.FirstName,
                    middle_initial: list.models[item].attributes.MiddleInitial,
                    last_name: list.models[item].attributes.LastName,
                    personal_id: list.models[item].attributes.PersonalId,
                    birth_date: list.models[item].attributes.Birthdate,
                    phone: list.models[item].attributes.Phone,
                    address_line1: list.models[item].attributes.AddressLine1,
                    address_line2: list.models[item].attributes.AddressLine2,
                    city: list.models[item].attributes.City,
                    state: list.models[item].attributes.State,
                    zip_code: list.models[item].attributes.ZipCode,
                    email: list.models[item].attributes.Email
                };
                attendee_list.push(person); 
            }
            //console.log(attendee_list);
        }
        res.render('members', { title: 'Girls On Fire 5679 Member Management', member_list: attendee_list});
     });
     
 });
 
 router.post('/member/edit', function(req, res, next) {
	 res.redirect('/members');
 });
 
 router.get('/member/add', function(req, res, next) {
     res.render('addMember', { title: 'GoF 5679 New Member' });
 });
 
 router.post('/member/add', function(req, res, next) {
     
     new Attendee({
         FirstName: 'Mike', 
         MiddleInitial: 'W', 
         LastName: 'Moser', 
         PersonalId: '8301930', 
         Birthdate: '01-10-1974', 
         Phone: '336-407-8072', 
         AddressLine1: '296 Cedar Ridge Circle', 
         City: 'Winston-Salem',
         State: 'NC',
         ZipCode: '27127',
         Email: 'mmoser1@triad.rr.com'})
         .save()
         .then(function(model) {
            console.log(model) ;
         });
         var errors = null;
     res.render('addMember', { title: 'GoF 5679 New Member', errors: errors });
 });
 
 router.get('/member/:id', function(req, res, next) {
     new Attendee({AttendeeId: req.params.id})
     .fetch()
     .then(function(model) {
         console.log(model);
         var member = {
            id: model.attributes.AttendeeId,
            first_name: model.attributes.FirstName,
            middle_initial: model.attributes.MiddleInitial,
            last_name: model.attributes.LastName,
            personal_id: model.attributes.PersonalId,
            birth_date: model.attributes.Birthdate,
            phone: model.attributes.Phone,
            address_line1: model.attributes.AddressLine1,
            address_line2: model.attributes.AddressLine2,
            city: model.attributes.City,
            state: model.attributes.State,
            zip_code: model.attributes.ZipCode,
            email: model.attributes.Email
         }
         res.render('editMember', { title: 'Edit GoF Member', member: member });
     });
 });
 
 router.get('/reports', function(req, res, next) {
     res.render('reports', { title: 'Girls On Fire 5679 Attendance Reports'});
 });
 
 module.exports = router;