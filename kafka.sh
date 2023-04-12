wget -O kafka.tgz https://downloads.apache.org/kafka/3.4.0/kafka-3.4.0-src.tgz &&
mkdir kafka &&
tar zxvf kafka.tgz -C kafka &&
rm kafka.tgz &&
cd kafka &&
KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)" &&
bin/kafka-storage.sh format -t $KAFKA_CLUSTER_ID -c config/kraft/server.properties --ignore-formatted &&
bin/kafka-server-start.sh config/kraft/server.properties
