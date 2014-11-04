var mongoose = require('mongoose')
	, s3 = require('./s3')
	, Schema = mongoose.Schema;

var mongoUri = process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/fooplayer';

/**
 * Initializes the mongoose instance and...
 * set the mongoDB URI.
 */
exports.init = function()
{
	mongoose.connect(mongoUri);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, '\n[ERROR!] Do you started mongod?\nTry this: $ mongod --dbpath ~/mongo\n\nError description:'));

	db.once('open', function callback()
	{
		console.log('Mongoose loaded!');
	});
};

var TrackSchema = mongoose.Schema(
{
	mbid: String
});

var Track = mongoose.model('Track', TrackSchema);

exports.loadTrack = function(mbid, callback)
{
	Track
	.findOne({ mbid : mbid })
	.exec(function(err, retData)
	{
		if(err || retData == null)
		{
			callback(true, null);
		}
		else
		{
			s3.get(mbid, callback);
		}
	});
};

exports.storeTrack = function(file, mbid, callback)
{
	s3.save(file, mbid, function(err, data)
	{
		if(!err)
		{
			var track = new Track({
				mbid : mbid
			});

			track.save(function(err, retData)
			{
				callback(err);

				if(err) console.log(err);
			});
		}
		else
		{
			console.log(err);
			callback(err);
		}
	});
};
