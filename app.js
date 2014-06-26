var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

//Azure-related
var azure = require('azure-storage');
var nconf = require('nconf');
nconf.env()
    .file({ file: 'config.json'});

//Get Azure-related setting from config.json
var tableName = nconf.get("TABLE_NAME")
var partitionKey = nconf.get("PARTITION_KEY")
var accountName = nconf.get("STORAGE_NAME")
var accountKey = nconf.get("STORAGE_KEY");

var app = express();

var http = require('http');
var server = http.createServer(app);
var sio = require('socket.io')(server);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Task
var Task = require('./models/task');
var task = new Task(azure.createTableService(accountName, accountKey), tableName, partitionKey);

/*
//TaskList routes
var TaskList = require('./routes/tasklist');
var taskList = new TaskList(task);

app.get('/', taskList.showTasks.bind(taskList));
app.post('/addtask', taskList.addTask.bind(taskList));
app.post('/completetask', taskList.completeTask.bind(taskList));
*/

//Realtime Tasklist routes
sio.on('connection', function (socket) {
    console.log("Connected");
    /*
    var q = new azure.TableQuery();
    q.where('completed eq ?', false);
    task.find(q, function(error, items) {
        socket.emit('alltasks', {
            tasks: items
        });
    });*/
});

var RTTaskList = require('./routes/rttasklist');
var rtTaskList = new RTTaskList(task, sio);

app.get('/realtime', rtTaskList.showTasks.bind(rtTaskList));
app.post('/realtime/addtask', rtTaskList.addTask.bind(rtTaskList));
app.post('/realtime/completetask', rtTaskList.completeTask.bind(rtTaskList));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = server;//app;
