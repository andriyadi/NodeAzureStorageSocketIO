/**
 * Created by andri on 6/24/14.
 */
var azure = require('azure-storage');
var uuid = require('node-uuid');
var entityGen = azure.TableUtilities.entityGenerator;

module.exports = Task;

function Task(storageClient, tableName, partitionKey) {
    this.storageClient = storageClient;
    this.tableName = tableName;
    this.partitionKey = partitionKey;
    this.storageClient.createTableIfNotExists(tableName, function tableCreated(error) {
        if(error) {
            throw error;
        }
    });
};

Task.prototype = {
    find: function(query, callback) {
        self = this;
        self.storageClient.queryEntities(self.tableName, query, null, function entitiesQueried(error, result) {
            if(error) {
                callback(error);
            } else {
                callback(null, result.entries);
            }
        });
    },

    addItem: function(item, callback) {
        self = this;
        // use entityGenerator to set types
        // NOTE: RowKey must be a string type, even though
        // it contains a GUID in this example.
        var itemDescriptor = {
            PartitionKey: entityGen.String(self.partitionKey),
            RowKey: entityGen.String(uuid()),
            name: entityGen.String(item.name),
            category: entityGen.String(item.category),
            completed: entityGen.Boolean(false)
        };
        self.storageClient.insertEntity(self.tableName, itemDescriptor, function entityInserted(error) {
            if(error){
                callback(error);
            }
            callback(null, itemDescriptor);
        });
    },

    updateItem: function(rKey, callback) {
        self = this;
        self.storageClient.retrieveEntity(self.tableName, self.partitionKey, rKey, function entityQueried(error, entity) {
            if(error) {
                callback(error);
            }
            entity.completed._ = true;
            self.storageClient.updateEntity(self.tableName, entity, function entityUpdated(error) {
                if(error) {
                    callback(error);
                }
                callback(null);
            });
        });
    },

    removeTable: function(callback) {
        self = this;
        self.storageClient.deleteTable(self.tableName, function(error, resp) {
            if (error) {
                callback(error);
            }
            else {
                callback(null, resp);
            }
        })
    }
}