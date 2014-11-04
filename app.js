require('shelljs/global');

var express = require('express');
var app = express();
var fs = require('fs');

app.get('/:mbid/:url', function(req, res) {
	var mbid = req.params.mbid;
	var url = req.params.url;

	fs.exists('/home/ubuntu/fooplayer-server/music/'+ mbid +'.audio', function(exists) {
		if (exists) {
   			res.set('Content-Type', 'audio/m4a');
			res.sendFile('/home/ubuntu/fooplayer-server/music/'+ mbid +'.audio');
		} else {
	if(exec('youtube-dl -f bestaudio -o "music/'+mbid+'.%(ext)s" --ignore-errors '+url+' --download-archive YYlog -f bestaudio -x --audio-format best').code !== 0) {
		res.send('FAIL');
		exec('rm -rf YYlog');
	} else {
		exec('rm -rf YYlog');
		exec('mv music/'+mbid+'.* music/'+mbid+'.audio');
		res.set('Content-Type', 'audio/m4a');
		res.sendFile('/home/ubuntu/fooplayer-server/music/'+ mbid +'.audio');
	}

		}
	});
});

app.listen(3000);
console.log('Listening 3000...');