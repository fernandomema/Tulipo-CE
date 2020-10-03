# Kill node process
ps aux | grep bin/dev.js  | grep -v grep | while read -r line ; do
    pid=$(echo $line | awk '{print $2}')
    kill -9 $pid
done
