export class GenerateUrl {
  public generate ( route: string, token: string): string {
    const baseURL = 'http://localhost:3838'
    return `${baseURL}${route}${token}`
  }
}