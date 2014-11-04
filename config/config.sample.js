var configs = {
	uploadPath: '/home/ubuntu/fooplayer-api/music/',
	s3bucket: 'fooplayer',
	s3region: 'us-west-1'
}

exports.get = function(arg) {
	return configs[arg];
}
