# AgWe Tessel Adapters

Exposes data via websocket server for AgWe controller.

Will show basic web interface at http://yourtesselsname.local whenever you are connected to the same wireless network or your tessel's enabled wireless access point.

![AgWe Tessel Web UI] (https://raw.githubusercontent.com/AgWe-Project/AgWe/gh-pages/AgWe%20Tessel%20Web%20UI.png)

### Initialize Tessel

Follow the instuctions at http://tessel.io/start to intialize your tessel to your wireless network.


### Clone and install

```
git clone git@github.com:AgWe-Project/agwe-tessel.git
cd agwe-tessel
npm install
t2 push socket-climate.js
```

