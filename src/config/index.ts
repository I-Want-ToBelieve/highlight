class Config {
  // The backend address
  public baseUrl = 'http://localhost:3000'
  public apiVersion = '/v1'
  // TODO This value should be fetched from the back end, but the back end doesn't seem to be implemented yet
  public expiresIn = 0 // ms
}

const config = new Config()

export default config
