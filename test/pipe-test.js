const streamify   = require('..');
const assert      = require('assert');
const path        = require('path');
const fs          = require('fs');
const streamEqual = require('stream-equal');
const PassThrough = require('stream').PassThrough;


const input = path.join(__dirname, 'files', 'input1.txt');


describe('Pipe from a readable stream', () => {
  it('Stream `data` events equal to original stream', (done) => {
    var writeStream = new PassThrough();
    var readStream = fs.createReadStream(input, { bufferSize: 1024 });
    var stream = streamify();
    stream.pipe(writeStream);

    streamEqual(readStream, writeStream, (err, equal) => {
      if (err) return done(err);

      assert.ok(equal);
      done();
    });

    setTimeout(() => {
      var fileReadStream = fs.createReadStream(input, { bufferSize: 1024 });
      stream.resolve(fileReadStream);
    }, 10);
  });
});


describe('Pipe to a writable stream', () => {
  it('Everything written to final stream', (done) => {
    var readStream = fs.createReadStream(input, { bufferSize: 1024 });
    var writeStream = new PassThrough();
    var stream = streamify();
    fs.createReadStream(input, { bufferSize: 1024 }).pipe(stream);

    streamEqual(readStream, writeStream, (err, equal) => {
      if (err) return done(err);

      assert.ok(equal);
      done();
    });

    setTimeout(() => {
      stream.resolve(writeStream);
    }, 10);
  });
});


describe('Pipe to itself', () => {
  it('Everything from source stream written to dest stream', (done) => {
    var readStream = fs.createReadStream(input);
    var writeStream = new PassThrough();
    var stream = streamify();
    stream.pipe(stream);

    streamEqual(readStream, writeStream, (err, equal) => {
      if (err) return done(err);

      assert.ok(equal);
      done();
    });

    setTimeout(() => {
      stream.addSource(fs.createReadStream(input));
      stream.addDest(writeStream);
    }, 10);
  });
});
