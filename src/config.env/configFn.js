// Como en el archivo server le indicamos las variables de entorno segun el modo en que se ejecuto, estas variables van
// a tomar distintos valores segun como se ejecuto la aplicacion.

module.exports = () => ({
  db_user: process.env.DB_USER || '',
  db_host: process.env.DB_HOST || '',
  db_password: process.env.DB_PASSWORD || '',
  db_name: process.env.DB_NAME || '',
  persistence: process.env.PERSISTENCE || ''
})