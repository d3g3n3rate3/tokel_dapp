<div align="center">
  <img src="assets/tokel-header.png" width="100%" />
</div>

## About

Tokel Platform is Komodo ecosystem's token platform.
It consists of :

- TOKEL coin wallet - release 1
- Token wallet
- NFT marketplace
- DEX

At the moment the app is in development of release 1.

For more information about the project please join our [Discord](https://discord.gg/QzWaDNd4N5) or check out [tokel web](https://tokel.io)

## Install

```bash
yarn
```

The application is using [libnspv](https://github.com/KomodoPlatform/libnspv).

Install the following dependencies for `libnspv` to work. Eventually it will be included and packaged with the app.

### Mac OS

```
# Install brew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
# Install Xcode, opens a pop-up window to install CLT without installing the entire Xcode package
xcode-select --install
# Update brew and install dependencies
brew update
brew upgrade
brew install libsodium libevent automake libtool git wget
```

### Linux

```
sudo apt-get -y install build-essential pkg-config libc6-dev m4 autoconf \
libtool unzip git wget automake
```

## Starting Development

Start the app in the `dev` environment:

```bash
yarn dev
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

## Docs

## License

MIT ©
