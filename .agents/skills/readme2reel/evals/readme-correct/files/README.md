# slugmint

Turn any string into a URL slug.

## Install

```bash
npm install slugmint
```

Requires Node.js 20 or newer.

## Usage

```js
import { slugify } from "slugmint";

slugify("Héllo, World!"); // "hello-world"
slugify("a b", { separator: "_" }); // "a_b"
```

## Test

```bash
npm test
```
