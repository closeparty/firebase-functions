'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const methods = require('./methods');
admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true });


exports.onCreateUser = functions.auth.user().onCreate(methods.onCreateUser.exec);
exports.generateThumbnail = functions.storage.object('uploads/{imageId}').onFinalize(methods.generateThumbnail.exec);
exports.sendFollowerNotification = functions.database.ref('/followers/{followedUid}/{followerUid}').onWrite(methods.sendFollowerNotification.exec);
