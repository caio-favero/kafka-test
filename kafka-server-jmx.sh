# **********************************************************************
# ********************** Creates variables *****************************
# **********************************************************************
KAFKA_DIR="/home/caiofavero/to-install" # /home/kafka
PROMETHEUS_DIR="/home/caiofavero/to-prometheus" # /home/prometheus
DOWNLOAD_DIR="/home/caiofavero/to-download" # /home/tmp
$SERVICE_PATH="/home/caiofavero" # /etc/systemd/system

# **********************************************************************
# ******************** Creates all directories *************************
# **********************************************************************
# rm -rf $KAFKA_DIR
mkdir -p $KAFKA_DIR
mkdir -p $DOWNLOAD_DIR
mkdir -p $PROMETHEUS_DIR

# **********************************************************************
# ************************ Download Kafka ******************************
# **********************************************************************
if [ ! -f $DOWNLOAD_DIR/kafka.tgz ]
then
    wget -O $DOWNLOAD_DIR/kafka.tgz https://downloads.apache.org/kafka/3.4.0/kafka_2.13-3.4.0.tgz
fi

# **********************************************************************
# ************************* Download JMX *******************************
# **********************************************************************
if [ ! -f $PROMETHEUS_DIR/jmx.jar ]
then
    wget -O $PROMETHEUS_DIR/jmx.jar https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.18.0/jmx_prometheus_javaagent-0.18.0.jar
fi

# **********************************************************************
# ******************* Download JMX -> Kafka config *********************
# **********************************************************************
if [ ! -f $PROMETHEUS_DIR/kafka.yml ]
then
    wget -O $PROMETHEUS_DIR/kafka.yml https://raw.githubusercontent.com/prometheus/jmx_exporter/master/example_configs/kafka-0-8-2.yml
fi

# **********************************************************************
# ********* Move Kafka installation to the desired directory ***********
# **********************************************************************
tar zxvf $DOWNLOAD_DIR/kafka.tgz -C $DOWNLOAD_DIR
mv $DOWNLOAD_DIR/kafka_2.13-3.4.0/* $KAFKA_DIR
# rm -rf $DOWNLOAD_DIR

# **********************************************************************
# ******** Creates service files for both ZooKeeper and Kafka **********
# **********************************************************************
cat <<EOF > $SERVICE_PATH/zookeeper.service
[Unit]
Requires=network.target remote-fs.target
After=network.target remote-fs.target

[Service]
Type=simple
User=kafka
ExecStart=$KAFKA_DIR/bin/zookeeper-server-start.sh $KAFKA_DIR/config/zookeeper.properties
ExecStop=$KAFKA_DIR/bin/zookeeper-server-stop.sh
Restart=on-abnormal

[Install]
WantedBy=multi-user.target
EOF

cat <<EOF > $SERVICE_PATH/kafka.service
[Unit]
Requires=zookeeper.service
After=zookeeper.service

[Service]
Type=simple
User=kafka
Environment="KAFKA_OPTS=-javaagent:$PROMETHEUS_DIR/jmx.jar=8080:$PROMETHEUS_DIR/kafka.yaml"
ExecStart=/bin/sh -c '$KAFKA_DIR/bin/kafka-server-start.sh $KAFKA_DIR/config/server.properties > $KAFKA_DIR/kafka.log 2>&1'
ExecStop=$KAFKA_DIR/bin/kafka-server-stop.sh
Restart=on-abnormal
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
EOF

# **********************************************************************
# ***** Restarts service daemon and enables Kafka and ZooKeeper ********
# **********************************************************************

# sudo systemctl enable zookeeper
# sudo systemctl enable kafka

# sudo systemctl daemon-reload

# sudo systemctl start zookeeper
# sudo systemctl start kafka

echo "sudo systemctl enable zookeeper"
echo "sudo systemctl enable kafka"
echo "sudo systemctl daemon-reload"
echo "sudo systemctl start zookeeper"
echo "sudo systemctl start kafka"
