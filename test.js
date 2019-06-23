/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START speech_quickstart]
async function main() {
  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech').v1p1beta1;
  const fs = require('fs');

  // Creates a client
  const client = new speech.SpeechClient();

  // The name of the audio file to transcribe
  const fileName = './resources/recording-fl.flac';

  // Reads a local audio file and converts it to base64
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'FLAC',
    sampleRateHertz: 44100,
    audioChannelCount: 2,
    languageCode: 'en-US',
    enableWordConfidence: true,
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  const confidence = response.results
  .map(result => result.alternatives[0].confidence)
  .join(`\n`);
  console.log(`Transcription: ${transcription} \n Confidence: ${confidence}`);

  console.log(`Word-Level-Confidence:`);
  const words = response.results.map(result => result.alternatives[0]);
  words.forEach(w => {
    w.words.forEach(a => {
      console.log(` word: ${a.word}, confidence: ${a.confidence}`);
    });
  });
}
main().catch(console.error);
// [END speech_quickstart]