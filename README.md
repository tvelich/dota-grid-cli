## DotA Grid CLI

![CI](https://github.com/tvelich/dota-grid-cli/workflows/CI/badge.svg)

### Overview

This is a tool for easily sorting your DotA grid config file by win rate, pick rate, or a mixed combination using the
[OpenDota](https://www.opendota.com/) API. It will go through each group in your grid layouts and order the heroes
by the rate you specify.

### Install

You'll need to install npm to use this tool. You can find the download for your platform
[here](https://nodejs.org/en/download/).

After you install, open your command prompt/terminal on your system and type:

```
npm i -g dota-grid-cli
```

After this you should be all set to use it!

### Config File

This file can be found in various locations depending on your OS and install method, but the common locations are found
below:

#### Windows

```
C:\Program Files\Steam\userdata\<steam user id>\570\remote\cfg\hero_grid_config.json
```

#### macOS

```
/Users/<your user>/Library/Application Support/Steam/userdata/<steam user id>/570/remote/cfg/hero_grid_config.json
```

#### Linux

```
/home/<your user>/.steam/steam/userdata/<steam user id>/570/remote/cfg/hero_grid_config.json
```

### Usage

Once installed, you can invoke the cli to output your sorted file as text using:

```
dota-grid-cli <path to file>
```

If you wish to overwrite your file, simply add a `--writeSortedFile` or `-w`:

```
dota-grid-cli <path to file> --writeSortedFile
```

You can use the `--sortBy or -s` flag to change the sorting method. The supported sort options are win rate, pick rate,
and mixed. The default is mixed which sorts by a combination of win rate and pick rate:

```
dota-grid-cli <path to file> --sortBy mixed
```

```
dota-grid-cli <path to file> --sortBy win-rate
```

```
dota-grid-cli <path to file> --sortBy pick-rate
```

### Support

If you find a need to revert your config to what it was before running the command, you can find the backup at
`hero_grid_config_backup.json`. Simply replace this file with your main one to restore.

If you need help or a reminder on the commands, you can type `dota-grid-cli --help` at any time:

```
Usage: dota-grid-cli [options] <grid-config-file-path>

Options:
  -V, --version          output the version number
  -w, --writeSortedFile  Overwrite the file specified with the sorted result (default: false)
  -s, --sortBy <method>  The method used to sort each grid group (mixed, win-rate, or pick-rate) (default: "mixed")
  -h, --help             display help for command
```

For additional help or to request a new feature, please open an issue under the "Issues" tab.
