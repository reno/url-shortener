import { UrlRepository } from '../../domain/repositories/url.repository';
import { MysqlUrlRepository } from '../../infrastructure/repositories/mysql-url.repository';
import { InMemoryUrlRepository } from '../../infrastructure/repositories/in-memory-url.repository';

const inMemoryRepo = new InMemoryUrlRepository();
let mysqlRepo: MysqlUrlRepository | null = null;

export function makeRepo(): UrlRepository {
  const useMysql = process.env.USE_MYSQL === 'true';
  if (useMysql) {
    if (!mysqlRepo) {
      const connectionUri = process.env.MYSQL_URI;
      if (!connectionUri) {
        throw new Error("MYSQL_URI environment variable is required when USE_MYSQL is true.");
      }
      mysqlRepo = new MysqlUrlRepository(connectionUri);
    }
    return mysqlRepo;
  }
  return inMemoryRepo;
}
