require('shelljs/global');

var config = require('./config/config.js');
var database = require('./config/database.js');
var s3 = require('./config/s3.js');
var express = require('express');
var app = express();
var fs = require('fs');

database.init();

app.get('/:mbid/:url', function(req, res) {
	var mbid = req.params.mbid;
	var url = req.params.url;

	database.loadTrack(mbid, function(err, finalUrl)
	{
		if(!err)
		{
			res.redirect(finalUrl);
		}
		else
		{
			if(exec('youtube-dl -f bestaudio -o "music/'+mbid+'.%(ext)s" --ignore-errors '+url+' --download-archive YYlog -f bestaudio -x --audio-format best').code !== 0)
			{
				res.send('null');
				exec('rm -rf YYlog');
			}
			else
			{
				exec('rm -rf YYlog');
				exec('mv music/'+mbid+'.* music/'+mbid);
				
				var file = config.get('uploadPath') + mbid;

				database.storeTrack(file, mbid, function(err)
				{
					if(!err)
					{
						database.loadTrack(mbid, function(err, finalUrl)
						{
							if(!err)
							{
								res.redirect(finalUrl);
							}
							else
							{
								res.send('null');
							}
						});
					}
					else
					{
						res.send('null');
					}

					exec('rm -rf music/'+mbid);
				});
			}
		}
	});
});

app.listen(3000);
console.log('Listening 3000...');