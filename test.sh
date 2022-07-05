#!/bin/bash
pushd backend >> /dev/null
STAGE=${2:-test}
sls invoke local --function backend --path test/$1.json -s $STAGE
popd >> /dev/null
