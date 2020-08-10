import {
  QuerystrModel,
  QueryBuilder,
  ParsedKeyValue,
  ObjectFinder,
  EachDispatcher,
  stringParser,
  floatParser,
  unescapedListParser,
  operatorParser,
} from '../index';
import { inspect } from 'util';
import { dateParser, integerParser } from '../querystr-model';

const Op = {
  in: 'Op.in',
  nin: 'Op.notIn',
  eq: 'Op.eq',
  ne: 'Op.ne',
  gte: 'Op.gte',
  lte: 'Op.lte',
  lt: 'Op.lt',
  gt: 'Op.gt',
};

type OpKey = keyof typeof Op;

const Order = {
  asc: 'ASC',
  desc: 'DESC',
};

type OrderKey = keyof typeof Order;

type SequelizeCriteria = {
  where: Record<string, unknown>;
  limit?: number;
  offset?: number;
  order?: [string, string][];
  [idx: string]: unknown;
};

const SET_OPCODES = ['in', 'nin'];
const COMPARABLE_OPCODES = ['gte', 'lte', 'gt', 'lt', 'eq', 'ne'];
const FULLCOMPARE_OPCODES = COMPARABLE_OPCODES.concat(SET_OPCODES);
const ORDERABLE_OPCODES = ['asc', 'desc'];

const pagination = {
  offset: floatParser(),
  limit: floatParser(),
};

const queryModel = new QuerystrModel({
  city: stringParser(),
  published_at: operatorParser(COMPARABLE_OPCODES, dateParser()),
  stars: operatorParser(COMPARABLE_OPCODES, integerParser()),
  category: operatorParser('in', unescapedListParser(stringParser())),
  order: operatorParser(ORDERABLE_OPCODES, stringParser()),
  tags: operatorParser(SET_OPCODES, unescapedListParser(stringParser())),
  ...pagination,
});

const QUERY = `\
category=in:food,drinks&\
stars=gt:5&\
city=Juiz%20de%20Fora&\
published_at=gte:2020-01-20&\
published_at=lte:2020-03-20&\
tags=nin:kids,pets&\
limit=100&\
order=asc:stars&\
order=asc:name&\
order=desc:published_at&\
offset=20`;

const fields = ['city'];

test('QueryBuilder works as expected.', () => {
  const fieldsDispatcher = new EachDispatcher<
    ParsedKeyValue,
    SequelizeCriteria
  >(new ObjectFinder({ key: fields, opcode: null }), ({ key, value }, ctx) => {
    ctx.where[key] = value;
  });

  const opcodeDispatcher = new EachDispatcher<
    ParsedKeyValue,
    SequelizeCriteria
  >(
    new ObjectFinder({ opcode: FULLCOMPARE_OPCODES }),
    ({ opcode, key, value }, ctx) => {
      ctx.where[key] = ctx.where[key] ?? {};
      (ctx.where[key] as Record<string, unknown>)[opcode as OpKey] = value;
    },
  );

  const orderDispatcher = new EachDispatcher<ParsedKeyValue, SequelizeCriteria>(
    new ObjectFinder({ key: 'order', opcode: ORDERABLE_OPCODES }),
    ({ value, opcode }, ctx) => {
      if (!Array.isArray(ctx.order)) ctx.order = [];

      ctx.order.push([value as string, Order[opcode as OrderKey]]);
    },
  );

  const paginationDispatcher = new EachDispatcher<
    ParsedKeyValue,
    SequelizeCriteria
  >(new ObjectFinder({ key: ['offset', 'limit'] }), ({ value, key }, ctx) => {
    ctx[key as 'offset' | 'limit'] = value as number;
  });

  const parsedQuery = queryModel.parse(QUERY);

  console.log('>>>PARSED_QUERY>>>', inspect(parsedQuery, false, 20));
  const criteria = { where: {}, order: [] };

  new QueryBuilder<ParsedKeyValue, SequelizeCriteria>()
    .register(opcodeDispatcher)
    .register(fieldsDispatcher)
    .register(orderDispatcher)
    .register(paginationDispatcher)
    .build(parsedQuery, criteria);

  console.log('>>>BUILD_QUERY>>>', inspect(criteria, false, 40));
});
