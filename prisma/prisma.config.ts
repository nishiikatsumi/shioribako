import { defineDatasources } from '@prisma/client/config'

export default defineDatasources({
  db: {
    url: process.env.DATABASE_URL
  }
})
