import { MysqlUrlRepository } from '../../src/infrastructure/repositories/mysql-url.repository';
import { generateId, toBase62 } from '../../src/usecases/url-shortener.usecase';
import { setupDatabase } from '../../src/infrastructure/database/setup';
import mysql from 'mysql2/promise';

describe('Adapters', () => {
  const connectionUri = 'mysql://test_user:1234@localhost:3306/url_shortener';
  let connection: mysql.Connection;

  beforeAll(async () => {
    try {
      await setupDatabase(connectionUri);
      connection = await mysql.createConnection(connectionUri);
    } catch (e) {
      console.warn("Could not connect to MySQL. Adapters test will fail.");
    }
  });

  afterAll(async () => {
    if (connection) {
      await connection.end();
    }
  });

  it('test_mysql_adapter', async () => {
    if (!connection) {
      console.warn("Skipping adapter test: MySQL not running.");
      return;
    }

    await connection.execute('DELETE FROM urls');

    const repo = new MysqlUrlRepository(connectionUri);
    const id = generateId();
    const longUrl = "https://en.wikipedia.org/wiki/Systems_design";
    const hash = toBase62(id);

    await repo.add(id, longUrl, hash);

    const list = await repo.list();
    expect(list.length).toBe(1);

    const fetchedHash = await repo.findByLongUrl(longUrl);
    expect(fetchedHash).toBe(hash);

    const fetchedUrl = await repo.getLongUrl(id);
    expect(fetchedUrl).toBe(longUrl);

    await connection.execute('DELETE FROM urls');
  });
});
