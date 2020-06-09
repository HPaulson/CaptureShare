module.exports = {
    Uploads:
        require('mongoose').model('uploads',
		require('mongoose').Schema({
			_id: String,
			uploadedAt: Date,
			user: String,
			fileType: String,
			fileSize: Number
		})
	)
};
