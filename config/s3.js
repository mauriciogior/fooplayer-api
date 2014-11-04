var AWS = require('aws-sdk')
	, config = require('./config.js')
	, fs = require('fs');

var s3 = new AWS.S3();

exports.get = function(mbid, callback)
{
	var params = {
		Bucket: config.get('s3bucket'),
		Key: 'music/' + mbid
	};

	s3.getSignedUrl('getObject', params, function(err, url)
	{
		callback(err, url);
	});
}

exports.save = function(file, mbid, callback)
{
	var params = {
		Bucket: config.get('s3bucket'),
		Key: 'music/' + mbid,
		Body: fs.readFileSync(file)
	};

	s3.putObject(params, callback);
}
