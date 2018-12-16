const port = 3000; 
const express = require('express');
const app = express();

const root_path = __dirname + '/';
const router_server = require(root_path + 'server/routes/router');
const router_api = require(root_path + 'api/routes/router');

app.use(express.static(root_path));

app.use('/', router_server);
app.use('/api/v1', router_api);

app.listen(port, function() {
    console.log("Server running at: http://localhost:" + port)
});