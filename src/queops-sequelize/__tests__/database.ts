import { Sequelize, DataTypes, Model } from 'sequelize';

const enableLogging = process.env.ENABLE_SEQUELIZE_LOGS === 'true';

const sequelize = new Sequelize('sqlite::memory:', {
  logging: enableLogging,
});

export const database = sequelize;

export class Bar extends Model {}

Bar.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stars: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      allowNull: false,
    },
    abp: {
      type: DataTypes.INTEGER,
    },
    parking: {
      type: DataTypes.BOOLEAN,
    },
  },
  { sequelize, modelName: 'restaurant' },
);

export class Review extends Model {}

Review.init(
  {
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize, modelName: 'review', timestamps: false },
);

Bar.hasMany(Review);
Review.belongsTo(Bar);

export function sync(): Promise<Sequelize> {
  return sequelize.sync({ force: true });
}

export function populate(): Promise<Bar[]> {
  return Bar.bulkCreate(
    [
      {
        // 1
        name: 'Comeu Morreu',
        stars: 0,
        city: 'Parnamirim',
        region: 'norte',
        abp: 620,
      },
      {
        // 2
        name: 'Bar do Chorume',
        stars: 1,
        city: 'São Gonçalo',
        region: 'sul',
        apb: 620,
        reviews: [
          {
            comment: 'Melhor torresmo da região.',
            author: 'Antônio',
            postedAt: '2017-01-14T19:55:25Z',
          },
        ],
      },
      {
        // 3
        name: 'Bar do Suvaco',
        stars: 2,
        city: 'Juiz de Fora',
        region: 'oeste',
        category: 'bar',
        meal: true,
        abp: 700,
      },
      {
        // 4
        name: 'Leila Bistrô',
        stars: 7,
        city: 'Rio de Janeiro',
        region: 'leste',
        parking: true,
        abp: 1090,
        reviews: [
          {
            comment: 'Unha, cabelo e cerveja!',
            author: 'Leila',
            postedAt: '2020-03-01T14:30:00Z',
          },
        ],
      },
      {
        // 5
        name: 'Cosmopolitan Pub',
        stars: 8,
        city: 'Juiz de Fora',
        region: 'sul',
        parking: true,
        reviews: [
          {
            comment: 'Tudo muuuuito caro!',
            author: 'Maria',
            postedAt: '2018-09-13T12:35:03Z',
          },
        ],
      },
      {
        // 6
        name: "Muhammed's",
        stars: 6,
        city: 'São Paulo',
        region: 'oeste',
        parking: true,
        reviews: [
          {
            comment: 'A melhor comida árabe da cidade.',
            author: 'Fátima',
            postedAt: '2017-07-12T17:42:12Z',
          },
          {
            comment: "Pior que o Habib's",
            author: 'Alan',
            postedAt: '2019-08-13T15:22:15Z',
          },
        ],
      },
      {
        // 7
        name: 'Beer and Beard Barbershop',
        stars: 4,
        city: 'São Paulo',
        region: 'sul',
        reviews: [
          {
            comment: 'Muito higiênico.',
            author: 'Ailton',
            postedAt: '2019-01-25T11:21:35Z',
          },
          {
            comment: 'Só parceiro.',
            author: 'Lucas',
            postedAt: '2019-02-01T00:21:35Z',
          },
          {
            comment: 'O corte tá na faixa, mas a cerveja tá muito cara',
            author: 'Alan',
            postedAt: '2020-08-10T07:34:11Z',
          },
        ],
      },
    ],
    { include: { model: Review, as: 'reviews' }, returning: true },
  );
}
