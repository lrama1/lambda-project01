const fs = require('fs');
const archiver = require('archiver');

const output = fs.createWriteStream(__dirname + '/lambda-project01.zip');
const archive = archiver('zip', {
  zlib: { level: 5 } // Sets the compression level.
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('warning', function(err) {
  if (err.code !== 'ENOENT') {
    throw err;
  }
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Append files from a sub-directory, putting its contents at the root of archive
archive.directory(__dirname, false);

archive.finalize();
