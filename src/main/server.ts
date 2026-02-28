import { createApp } from './app';
import { setupDatabase } from '../infrastructure/database/setup';

const PORT = process.env.PORT || 3333;
const useMysql = process.env.USE_MYSQL === 'true';

async function bootstrap() {
  if (useMysql) {
    const connectionUri = process.env.MYSQL_URI;
    if (!connectionUri) {
      throw new Error("MYSQL_URI environment variable is required when USE_MYSQL is true.");
    }
    await setupDatabase(connectionUri);
  }

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch(console.error);
