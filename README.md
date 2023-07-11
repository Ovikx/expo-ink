# DISCLAIMER: This is still in development!
For any SQLite features not supported by this package, use the `database` property of `ExpoORM` to access `expo-sqlite` directly.

# expo-ink
A lightweight, type-safe SQLite ORM for [`expo-sqlite`](https://www.npmjs.com/package/expo-sqlite). Leverages TypeScript to ensure rigid type safety throughout table definitions and queries. Supports automatic migrations.

## Installation

```sh
npm install expo-ink
```

## Basic usage

```js
import { multiply } from 'expo-ink';

// ...

const result = await multiply(3, 7);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

[MIT](https://en.wikipedia.org/wiki/MIT_License)