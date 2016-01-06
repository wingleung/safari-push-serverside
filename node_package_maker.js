var websiteName = "DeRedactie.be",
    websiteFolder = "deredactiebe",
    websitePushID = "web.be.vrt.deredactie",
    allowedDomains = [
        "http://vrt-cc.s3-website-eu-west-1.amazonaws.com"
    ],
    webServiceURL = "https://wingsafariendpoint.herokuapp.com",
    urlFormatString = "http://deredactie.be/permalink/%@",
    certP12 = "[CERTIFICATE.p12]",
    certPasswd = "[CERTIFICATEPASS]]"; //p12 password

/////////////////////////////////////////////

var fs = require('fs'),
    crypto = require('crypto'),
    child_process = require('child_process'),
    rimraf = require('rimraf');

var raw_files = [
    'icon.iconset/icon_16x16.png',
    'icon.iconset/icon_16x16@2x.png',
    'icon.iconset/icon_32x32.png',
    'icon.iconset/icon_32x32@2x.png',
    'icon.iconset/icon_128x128.png',
    'icon.iconset/icon_128x128@2x.png'
];

var website = {
    "websiteName": websiteName,
    "websitePushID": websitePushID,
    "allowedDomains": allowedDomains,
    "urlFormatString": urlFormatString,
    "authenticationToken": "51c799bcbf18289ee31ff2cbfe4afcd53f71f909", //any token to auth user
    "webServiceURL": webServiceURL
};

var manifest = {},
    path = __dirname + '/' + websiteFolder + '.pushpackage';

if (fs.existsSync(path)) {
    rimraf.sync(path);
}

fs.mkdirSync(path);
fs.mkdirSync(path + "/icon.iconset");

for (var i in raw_files) {
	console.log(raw_files[i]);
    child_process.execSync("cp '" + __dirname + '/' + raw_files[i] + "' '" + path + '/' + raw_files[i] + "'");
}

console.log("website.json");
fs.writeFileSync(path + '/website.json', JSON.stringify(website));

console.log("manifest.json");
raw_files.push("website.json");
for (var i in raw_files) {
    var file = raw_files[i];
    var sha1 = crypto.createHash('sha1');
    sha1.update(fs.readFileSync(path + '/' + file), 'binary');
    manifest[file] = sha1.digest('hex');
}

fs.writeFileSync(path + '/manifest.json', JSON.stringify(manifest));

child_process.execSync("openssl pkcs12 -in '" + certP12 + "' -nocerts -out 'private.pem' -passin pass:" + certPasswd + " -passout pass:" + certPasswd);
child_process.execSync("openssl pkcs12 -in '" + certP12 + "' -clcerts -nokeys -out 'cert.pem' -passin pass:" + certPasswd);

child_process.execSync("openssl smime -binary -sign -certfile AppleWWDRCA.pem -signer cert.pem -inkey private.pem -in '" + path + "/manifest.json' -out '" + path + "/signature' -outform DER -passin pass:" + certPasswd);

raw_files.push("manifest.json");
raw_files.push("signature");

if (fs.existsSync(path + ".zip")) {
    fs.unlink(path + ".zip");
}

var archiver = require('archiver'),
        output = fs.createWriteStream(path + ".zip"),
        archive = archiver('zip');

archive.pipe(output);

console.log("building Package");
for (var i in raw_files) {
    var file = raw_files[i];
    archive.append(fs.createReadStream(path + "/" + file), {name: file});
}

archive.finalize(function (err, bytes) {
    if (err)
        throw err;

    console.log(bytes + ' total bytes');

    fs.unlink("cert.pem");
    fs.unlink("private.pem");
    rimraf.sync(path);
});
