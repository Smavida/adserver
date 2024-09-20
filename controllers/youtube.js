const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const { Storage } = require('@google-cloud/storage');

const RuntimeConfig = require('../models/runtime-config.js');
require('dotenv').config({});

// Google Cloud Storage initialisieren
const storage = new Storage();
const bucketName = process.env.BUCKETNAME; // Name deines Buckets
const fileName = '1e86cade0d8f614b4c480561bafafe20e3c4690062c0565ed921aea07a377049.mp4'; // Name der Datei im Bucket

async function authorize() {
    const oauth2Client = new OAuth2(process.env.OAUTH_CLIENTID, process.env.OAUTH_CLIENTSECRET, process.env.OAUTH_REDIRECTURI);

    const envVariable = await RuntimeConfig.findOne({ key: 'youTubeAccessToken', envLabel: 'default', scope: 'environment' });

    // Prüfe, ob wir bereits ein Token gespeichert haben
    if (envVariable?.value) {
        const token = envVariable.value;
        oauth2Client.setCredentials(JSON.parse(token));
        // Automatische Token-Erneuerung aktivieren
        oauth2Client.on('tokens', (tokens) => {
            console.log(tokens);
            if (tokens.refresh_token) {
                // Speichere den neuen Refresh Token, wenn er ausgegeben wird
                console.log('Neuer Refresh Token:', tokens.refresh_token);
                RuntimeConfig.findOneAndUpdate({ key: 'youTubeAccessToken', envLabel: 'default', scope: 'environment' }, { value: JSON.stringify(tokens), updatedAt: new Date(), group: 'youtube', reboot: false, readonly: false, default: '' }, { upsert: true, new: true })
                    .then((updatedToken) => console.log('Neuer Token gespeichert:', updatedToken))
                    .catch((err) => console.log('Could not update token in DB', err));
            }
            console.log('Neuer Access Token:', tokens.access_token);
        });
        return Promise.resolve(oauth2Client);
    } else {
        return getAccessToken(oauth2Client);
    }
}

function getAccessToken(oauth2Client) {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/youtube.upload'],
    });

    console.log('Authorisierungs-URL:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve, reject) => {
        rl.question('Gib den Autorisierungscode ein: ', (code) => {
            rl.close();
            oauth2Client.getToken(code, (err, token) => {
                if (err) return reject('Error retrieving access token: ' + err);
                oauth2Client.setCredentials(token);

                // Speichere das Token, um es für spätere Anfragen zu verwenden
                RuntimeConfig.findOneAndUpdate({ key: 'youTubeAccessToken', envLabel: 'default', scope: 'environment' }, { value: JSON.stringify(token), updatedAt: new Date(), group: 'youtube', reboot: false, readonly: false, default: '' }, { upsert: true, new: true })
                    .then((updatedToken) => console.log('Neuer Token gespeichert:', updatedToken))
                    .catch((err) => console.log('Could not update token in DB', err));
                resolve(oauth2Client);
            });
        });
    });
}

async function uploadVideo(auth) {
    const youtube = google.youtube({ version: 'v3', auth });

    const fileStream = storage.bucket(bucketName).file(fileName).createReadStream();

    youtube.videos.insert(
        {
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: 'Test Video',
                    description: 'Beschreibung des Videos',
                    tags: ['Tag1', 'Tag2'],
                    categoryId: '22', // Kategorie-ID für "People & Blogs"
                },
                status: {
                    privacyStatus: 'public', // oder 'private' oder 'unlisted'
                },
            },
            media: {
                body: fileStream,
            },
        },
        (err, res) => {
            if (err) {
                console.error('Das Video konnte nicht hochgeladen werden:', err);
                return;
            }
            console.log('Video erfolgreich hochgeladen:', res.data);
        }
    );
}

exports.youtubeUpload = async (req, res) => {
    res.end('ok');
    authorize().then(uploadVideo).catch(console.error);
};
