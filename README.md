# tree-sitter-ekon

EKON grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter)

[Ekon website](https://github.com/Himujjal/ekon)

# Get started


### Installation

```bash
git clone https://github.com/ekon-org/tree-sitter-ekon
cd tree-sitter-ekon
npm i  # pnpm i 
```

### To generate C parser files:

```bash
npm run build # pnpm build
```

### Development

If you are developing, use the excellent [nodemon](https://github.com/remy/nodemon).
In the root directory, simply:

```bash
nodemon
```
or
```bash
npm run start # pnpm start
```

### Testing

To create tests, create a `*.txt` file in test/corpus folder. Refer to
[tree-sitter test](https://tree-sitter.github.io/tree-sitter/creating-parsers#command-test)
to know how to write tests

_Highlighting tests_:


### Contribution

The grammar is easy to understand. Have a look at [creating-parsers](https://tree-sitter.github.io/tree-sitter/creating-parsers)
for more information.

Contribute on the master branch itself if you think this grammar doesn't support anything specific

## License

[MIT](./LICENSE)
