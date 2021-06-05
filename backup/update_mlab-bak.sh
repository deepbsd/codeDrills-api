#!/usr/bin/env bash

# For the codeDrills project this script creates a JSON duplicate of the
# local Mongo DB collection being used and updates the remote (formerly
# mlab) Atlas! DB collection so it is in sync with the local database.


user='deepbsd'
pass='WRSt7MVDsSTN!fM'

#local_host='localhost:8080'
#local_host='localhost:27017'
local_file='users.json'
#local_file='questions.json'
#local_file='users.json'
# (formerly mlab) Atlas!
#remote_host='ds115758.mlab.com'
#remote_host='mongodb+srv://codedrills.zm5qb.mongodb.net/codeDrills'
remote_host="mongodb+srv://$user:$pass@codedrills.zm5qb.mongodb.net/codeDrills"
#remote_port=15758
#remote_port=15758
db='codeDrills'
#collection='userdatas'
#collection='questions'
collection='users'
# export from localdatabase first
#mongoexport --db $db --collection $collection -o $local_file

# import into (formerly mlab) Atlas! database
#mongoimport -h $remote_host:$remote_port -d $db -c $collection -u $user -p $pass --drop --file $local_file
mongoimport --uri $remote_host --collection $collection --type json --file $local_file
#mongoimport -h $local_host -d $db -c $collection  --drop --file $local_file


