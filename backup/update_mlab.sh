#!/usr/bin/env bash

# For the GunBase project this script creates a JSON duplicate of the local
# Mongo DB collection being used and updates the remote MLab DB collection so it
# is in sync with the local database.

#local_host='localhost:8080'
local_host='localhost:27017'
#local_file='users.json'
local_file='questions.json'
#local_file='users.json'
remote_host='ds115758.mlab.com'
remote_port=15758
db='codeDrills'
#collection='userdatas'
collection='questions'
#collection='users'

user='deepbsd'
pass='2D33p4m3!'

# export from localdatabase first
#mongoexport --db $db --collection $collection -o $local_file

# import into mlab database
#mongoimport -h $remote_host:$remote_port -d $db -c $collection -u $user -p $pass --drop --file $local_file
mongoimport -h $local_host -d $db -c $collection  --drop --file $local_file


