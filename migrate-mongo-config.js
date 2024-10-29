import currentConfig from 'config'

const config = {
  mongodb: {
    url: currentConfig.mongo.url,
    databaseName: currentConfig.mongo.db,
    options: {},
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
}

export default config
