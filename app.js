
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var os = require("os");
var hostname = os.hostname();


//load customers route
var customers = require('./routes/customers'); 
var app = express();
var app1 = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

// all environments
app1.set('port', 9012);
app.set('port', process.env.PORT || 9011);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/

app.use(
    
    connection(mysql,{
        
        host: '<alicloud mysql instance intranet address>',
        user: 'root',
        password : '<your password>',
        port : 3306, //port mysql
        database:'nodejs'

    },'pool') //or single

);


app.get('/',function(req,res){
   res.sendfile(path.join(__dirname+'/index.html'));
});

app.get('/customers', customers.list);
app.get('/customers/add', customers.add);
app.post('/customers/add', customers.save);
app.get('/customers/delete/:id', customers.delete_customer);
app.get('/customers/edit/:id', customers.edit);
app.post('/customers/edit/:id',customers.save_edit);


app.use(app.router);

app1.get('/service1',function(req,res){
    res.send('service 1 is listening at port ' + app1.get('port') + ' on server ' + hostname);
}
);

app1.use(app1.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
http.createServer(app1).listen(app1.get('port'), function(){
  console.log('Express server listening on port ' + app1.get('port'));
});

