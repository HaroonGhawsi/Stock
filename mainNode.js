/**
 * Created by oracle on 12/2/15.
 */
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var bodyParser=require('body-parser');
var express = require('express');
var app = express();

app.get('/fonts.css',function(request,response){
    response.sendfile('fonts.css',{root:__dirname+'/Style/'});
});

app.get('/Common.css',function(request,response){
    response.sendfile('Common.css',{root:__dirname+'/Style/'});
});

app.get('/global.css',function(request,response){
    response.sendfile('global.css',{root:__dirname+'/Style/'});
});

app.get('/style.css',function(request,response){
    response.sendfile('style.css',{root:__dirname+'/Style/'});
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.post('/signIn',function(request,response){

    var username = request.body.username;
    var pass = request.body.password;
    var validity = 0;
    oracledb.getConnection(
        {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString
        },
        function(err, connection)
        {
            if (err) {
                console.error(err.message);
                return;
            }
                connection.execute(
                    "begin :res := app_user_security.valid_user(:u,:p); end;",
                    {
                        res:{dir:oracledb.BIND_OUT,type:oracledb.NUMBER},
                        u:username,
                        p:pass,
                    },
                    function(err, result)
                    {
                        console.log(result);
                        if (err) {
                            console.error(err.message);
                            doRelease(connection);
                        }

                        doRelease(connection);
                        if (result.outBinds.res){
                            response.sendfile('index.html',{root:__dirname});
                        }
                        else
                            console.log('Invalid Username/Password!!!!');
                        //console.log(result);
                    }); // end connection


        });

    function doRelease(connection)
    {
        connection.release(
            function(err) {
                if (err) {
                    console.error(err.message);
                }
            });
    }
});

//first show loign page
app.get('/',function(request,response){
    response.sendfile('Login.html',{root:__dirname});
});


//signUp page
app.get('/signUp',function(request,response){
    response.sendfile('Register.html',{root:__dirname});
});

//signUp page
app.get('/Rules',function(request,response){
    response.sendfile('Rules.html',{root:__dirname});
});

function getMainChartJson(){
    return(
    "[ " +
    " [1228867200000, 14.03]," +
    " [1228953600000, 13.57]," +
    "[1229040000000, 14.04]," +
    " [1229299200000, 13.54]," +
    "  [1229385600000, 13.63]," +
    " [1229472000000, 12.74]," +
    " [1229558400000, 12.78]," +
    " [1229644800000, 12.86]," +
    " [1229904000000, 12.25]," +
    " [1229990400000, 12.34]," +
    " [1230076800000, 12.15]," +
    " [1230249600000, 12.26]," +
    "[1230508800000, 12.37]," +
    "[1230595200000, 12.33]," +
    " [1230681600000, 12.19]" +
    " ]");

}

// write data for create chart
app.get('/Chart',function(request,response){

    response.writeHeader(200, {"Content-Type": "application/json"});
    response.write(getMainChartJson());
    response.end();
});





app.listen(8000,function(){console.log('Listening port 8000');});