#!/bin/bash
pushd backend >> /dev/null
sls invoke local --function backend --path test/$1.json
popd >> /dev/null
