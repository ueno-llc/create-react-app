#!/bin/sh
cleanup() {
  kill $YPID
  exit 1
}

trap cleanup 0

yarn build
yarn start &

YPID=$!
PORT=${PORT:-3000}

sleep 2

wget --tries=2 --timeout=2 -P ./static -mpc -E -q  http://localhost:$PORT

for filepath in `find ./static | sort`; do
  filename=`basename $filepath`
  if [[ "$filepath" =~ ".html"$ ]] && [ $filename != "index.html" ]; then
    folder=${filepath%*.html}
    mkdir -p $folder
    mv $filepath "$folder/index.html"
  fi
done

if mv "./static/localhost:$PORT" "./static_tmp" ; then
  rm -rf "./static"
  mv "./static_tmp" "./static"
  cp -r "./build/"* "./static/".
  cp -r "./public/"* "./static/".
fi

kill $YPID
