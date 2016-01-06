var pushpackage = "deredactiebe.pushpackage.zip";

/////////////////////////////////////////////

var http = require('http');
var fs = require('fs');
var qs = require('querystring');

http.createServer(callBack).listen(process.env.PORT || 5000);

function callBack(req, res) {
    var commands = req.url.split("/");
    console.log(req.socket.remoteAddress + " : " + req.method + " " + req.url);

    if (commands[1] != 'v1') {
        res.writeHead(404);
        res.end();
        return;
    }

    var code = commands[2];

    // /v1/pushPackages/[websitePushID]
    if (code == "pushPackages") {
        var path = __dirname + "/" + pushpackage;
        if (fs.existsSync(path) == false) {
            res.writeHead(404);
            res.end();
            return;
        }

        fs.readFile(path, function (error, data) {
            res.writeHead(200, {'Content-Type': 'application/zip'});
            res.end(data);
        });

        return;
    }

    // /v1/log
    if (code == "log") {
        console.log(req.headers);
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            var POST = qs.parse(body);
            console.log(POST);

            res.writeHead(200);
            res.end();
        });
        return;
    }

    // /v1/devices/[deviceToken]/registrations/[websitePushID]
    if (code == "devices" && commands[4] == "registrations") {
        var deviceToken = commands[3],
            websitePushID = commands[5];

        if (req.method == 'POST') {

            var subscribeData = {
                deviceToken: deviceToken,
                websitePushID: websitePushID,
                platform: 'safari'
            };

            // Todo: add deviceToken into pushfarm database

        } else if (req.method == 'DELETE') {

            var subscribeData = {
                deviceToken: deviceToken,
                websitePushID: websitePushID,
                platform: 'safari'
            };

            // Todo: delete deviceToken from pushfarm database

        }

        res.writeHead(200);
        res.end();
        return;
    }

    res.writeHead(404);
    res.end();
}