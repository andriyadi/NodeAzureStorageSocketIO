/**
 * Created by andri on 6/24/14.
 */
var azure = require('azure-storage');
var async = require('async');

module.exports = TaskList;

function TaskList(task) {
    this.task = task;
}

TaskList.prototype = {
    showTasks: function(req, res) {
        self = this;
        var q = new azure.TableQuery();
        q.where('completed eq ?', false);
        self.task.find(q, function(error, items) {
           res.render('index', {title: 'My To Do List', tasks: items});
        });
    },

    addTask: function(req,res) {
        var self = this
        var item = req.body.item;
        self.task.addItem(item, function(error) {
            if(error) {
                throw error;
            }
            res.redirect('/');
        });
    },

    completeTask: function(req,res) {
        var self = this;
        var completedTasks = Object.keys(req.body);
        async.forEach(completedTasks, function(completedTask, callback) {
            self.task.updateItem(completedTask, function itemsUpdated(error) {
                if(error){
                    callback(error);
                } else {
                    callback(null);
                }
            });
        }, function goHome(error){
            if(error) {
                throw error;
            } else {
                res.redirect('/');
            }
        });
    }
}
