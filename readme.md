<p align="center">
    <img src="https://cdn.arnellebalane.com/github/mdi-cli/icon.png" alt="mdi-cli icon">
</p>

# mdi-cli

Generate material design icons from the command line.

All icons are based on the [@mdi/svg][1] package, which is what [materialdesignicons.com][2] uses.

## Installation

`mdi-cli` can be installed using `npm` by running:

```bash
$ npm install -g mdi-cli
```


## Usage

Installing this package globally will give you the `mdi` command. The GIF below shows how to use it interactively:

![Usage Example](https://cdn.arnellebalane.com/github/mdi-cli/)

You may also use `mdi` non-interactively, by providing flags and arguments when you run it:

```bash
$ mdi --help

  Generate material design icons from the command line

  Usage:
    $ mdi [options] <icon-name>, <icon-name>, ...

  Options:
    --size, -s         Set the icon size. Defaults to 24px.
    --padding, -p      Set the icon padding. Defaults to 0px.
    --radius, -r       Set the icon border radius. Defaults to 0px.
    --foreground, -f   Set the icon foreground color. Defaults to #333.
    --background, -b   Set the icon background color. Defaults to transparent.
    --output, -o       Write icons to this directory. Defaults to the current directory.

  Examples:
    $ mdi -s 32 -p 4 -r 5 -f yellow -b black google youtube twitter
```


## Why did I build this?

[materialdesignicons.com][2] is cool, I like using it because

1. I can see what the actual icons look like
2. I can easily resize and set padding of the icon and see the results

However, I usually get several icons with the same styles at the same time, and doing so always takes so much time.

This tool allows:

1. Generating multiple icons with the same style
2. Generating icons even when you're offline

However, this also comes with its own limitations:

1. No icon preview while generating, so you kinda have to know the names of the icons that you need


## Related Projects

- [mdi-core][3]: Node module for generating Material Design icons.


## License

MIT License


[1]: https://github.com/Templarian/MaterialDesign-SVG
[2]: https://materialdesignicons.com/
[3]: https://github.com/arnellebalane/mdi-core
