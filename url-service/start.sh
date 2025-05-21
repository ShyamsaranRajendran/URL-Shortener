#!/bin/sh

node app.js &  # Start main app in background
node services/jobs/syncClicks.js &  # Start worker in background

wait  # Wait for both to finish (keeps container alive)
