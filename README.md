# fotolog-downloader-js
Download your Fotolog photos using JS.

## What?
This program will download all your photos from Fotolog to a directory `download` at the root of the project dir.

# Install
```
git clone https://github.com/sebas5384/fotolog-downloader-js.git
cd fotolog-downloader-js
```

# Use
```
node bin/download.js [INSERT YOUR USER NAME]
```

# Example
```
node bin/download.js crazyusername
```

All the photos will be at the download directory:
```
$ cd fotolog-downloader-js
$ tree -d --filelimit 10
.
├── bin
├── download    <------ here! :)
├── lib
└── node_modules

4 directories
```
