const gcs = require('@google-cloud/storage');
const sharp = require('sharp')
const _ = require('lodash');
const path = require('path');

const THUMB_MAX_WIDTH = 200;
const THUMB_MAX_HEIGHT = 200;

exports.exec = function (object) {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
        console.log('This is not an image.');
        return null;
    }
    // Get the file name.
    const fileName = path.basename(filePath);
    // Exit if the image is already a thumbnail.
    if (fileName.startsWith('thumb_')) {
        console.log('Already a Thumbnail.');
        return null;
    }
    // Download file from bucket.
    const bucket = gcs().bucket(fileBucket);
    const metadata = { contentType: contentType };
    // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
    const thumbFileName = `thumb_${fileName}`;
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
    // Create write stream for uploading thumbnail
    const thumbnailUploadStream = bucket.file(thumbFilePath).createWriteStream({ metadata });
    // Create Sharp pipeline for resizing the image and use pipe to read from bucket read stream
    const pipeline = sharp();
    pipeline.resize(THUMB_MAX_WIDTH, THUMB_MAX_HEIGHT).max().pipe(thumbnailUploadStream);
    bucket.file(filePath).createReadStream().pipe(pipeline);
    return new Promise((resolve, reject) => thumbnailUploadStream.on('finish', resolve).on('error', reject));
}