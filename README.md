NodeAzureStorageSocketIO
========================

Show case of development of Node.js app accessing Azure Table Storage, implementing socket.io for realtime data, and deployed to Windows Azure web site. 
I used this code to deliver a talk about development and deployment of Node.js app on Windows Azure. 

Here's the [keynote](http://www.slideshare.net/andri_yadi/develop-deploy-nodejs-app-on-windows-azure). 

What it covers?

-  Use latest Express module.
-  Work with Azure Table storage. Query, insert, and update "task" object on Azure "task" table.
-  Implement realtime data using latest Socket.io (1.0.6). Remember, most sample still uses 0.9.x. I find quite hard to find 1.x sample, and struggling myself :)
 
# Try for youself
## Preparation
Download all files. Make sure to run command `npm update` on root directory. And edit `config.json` with your own Azure account:

```
{
    "STORAGE_NAME": "your_storage_name", 
    "STORAGE_KEY": "your_storage_key", 
    "PARTITION_KEY": "mytasks", 
    "TABLE_NAME": "tasks"
}
```

## Run
Type `npm start` command on root directory

## Open in browser
Open `http://localhost:3000` for listing the tasks

Open `http://localhost:3000/realtime` for similar demo, but this time leveraging socket.io

#Deploying on Azure
Refer to [my slide](http://www.slideshare.net/andri_yadi/develop-deploy-nodejs-app-on-windows-azure).
Or related articles and documents on [Windows Azure](http://azure.microsoft.com/en-us/develop/nodejs/) 

Good luck and enjoy!
