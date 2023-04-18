cd kafka/kafka_2.13-3.4.0 &&
KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)" &&
bin/kafka-storage.sh format -t $KAFKA_CLUSTER_ID -c config/kraft/server.properties --ignore-formatted &&
bin/kafka-server-start.sh config/kraft/server.properties
