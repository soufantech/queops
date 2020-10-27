<div align="center">
  <img src="https://avatars2.githubusercontent.com/u/61063724?s=200&v=4" width="100px">
</div>

<br />

<div align="center">
  <h1>@soufantech/queops</h1>
  <p>Build flexible and generic search filters from query string parameters.</p>
</div>

<br />

<div align="center">

[![typescript-image]][typescript-url] [![jest-image]][jest-url] [![npm-image]][npm-url]

</div>

## Installation

⚠️ You'll need a valid SouFan NPM token to download the package from SouFan's NPM registry.


```shell
yarn add @soufantech/queops
```

or

```shell
npm install @soufantech/queops
```

## Basic usage

The example below demonstrates how filters can be set up for querying an "event" (like in the sense of a "show" or "festival").

Examples of possible queries that can go into the querystring URI are:

* `event_date=bet:2020..2020-11-15` - any event between 2020-01-01T00:00:00 and 2020-11-15T00:00:00. The operator `nbet` could be used in place of `bet` as well.
* `capacity=gt:1000` - any event with capacity greater than 1000. The operators `gte`, `lt`, `lte`, `ne` and `eq` could have been used in place of `gt` as well.
* `capacity=asc:1` - order the results by capacity in ascendant order. The operator `desc` could be used in place of `asc` as well.
* `genre=in:rock,folk,blues` - any event which genre is rock, folk or blues. The operator `nin` could have been used in place of `in` as well.
* `offset=3` - paginates the results.
* `limit=10` - limits the results.
* `name=spring` - brings any event that contains the substring "spring" in its title or description.
* `exclude=description,capacity` - excludes the "description" and "capacitity" properties from the returned result.

All the above queries MAY be put together in one single query to narrow down the results, obeying a disjunctive logic (AND): `event_date=bet:2020..2020-11-15&capacity=gt:1000&capacity=asc:1&genre=in:rock,folk,blues&offset=3&limit=10&name=spring&exclude=description,capacity`

Here is how it can be set up:

```js
// Set up a QuerySchema object somewhere in your project.
// (this must be done only once during the lifetime of your app).

import { QuerySchema, Q } from '@soufantech/queops';

// The schema describes the possible filters in your query string, how
// their values are parsed and constrained. The presence of a field in
// the schema only makes it aknowledgeable when que query is processed,
// it does not state that the field is in anyway required.
const schema = new QuerySchema({
  event_date: rangeDate({
    bindingName: 'eventDate',
  }),
  capacity: [logicalInt(), queryOrder()]
  genre: [stringElement(), queryOrder()],
  limit: queryLimit({
    max: 50,
    defaultValue: 25,
  }),
  offset: queryOffset(),
  populate: queryPopulate({
    acceptedElements(['location'])
  }),
  name: querySearch(),
  exclude: queryExclude({
    minElements: 1, // if present, must contain at least one element
    acceptedElements: ['description', 'capacity', 'genre'], // allow callers to exclude only the 'description', 'capacity', and 'genre' fields of the targeted resource
  })
});

// Set up a query builder object somewhere in your project
// (this must be done only once during the lifetime of your app).
import { createQueryBuilder } from '@soufantech/queops';

const queryBuilder = createQueryBuilder({
  populators: { // only needed if you're using `queryPopulate`
    location: () => {
      return {
        model: Address,
        as: 'location',
      };
    }
  },
  searches: { // only needed if you're using `queryPopulate`
    name: ['title', 'description']
  },
})


// Set 'query parser' to 'simple' on your express app configuration.
app.set('query parser', 'simple');

// In your request handler, process the querystring and pass
// the returned `action` to the query builder:

app.get('/promoters/:promoterId/events/', async (req, res) => {

  // `action` is a function to be passed to the builder.
  // `notices` is an array of `Notice` objects, that may
  // contain warnings of possible non-desirable behaviours
  // assumed by the processor, such as the use of a default
  // value or that a query will not be applied due
  // to some constraint.
  const { action, notices } = schema.process(req.query);

  // These are some fixed query parameters that will be
  // merged with the query built from que querystring.
  const baseFindOptions = {
    where: {
      promoterId: req.params.promoterId
    },
  };

  // baseFindOptions is optional
  const findOptions = queryBuilder.build(action, baseFindOptions);

  const events = await Event.findAll(findOptions);

  // return notices along with the data, if desirable.
  return res.json({ data: events, notices });
});
```

## Todo

- chore: set up semantic-release.

---

<div align="center">
  <sub>Built with ❤︎ by query string experts at<a href="http://soufan.com.br"> SouFan</a>
</div>

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"

[npm-image]: https://img.shields.io/npm/v/@soufantech/queops.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/@soufantech/queops "npm"

[jest-image]: https://img.shields.io/badge/tested_with-jest-99424f.svg?style=for-the-badge&logo=jest
[jest-url]: https://github.com/facebook/jest "jest"
