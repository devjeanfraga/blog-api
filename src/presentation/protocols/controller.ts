import { HttpRequest, HttpResponse } from "./http";

export interface Controller {
  handle (httpReques: HttpRequest): Promise<HttpResponse> 
}