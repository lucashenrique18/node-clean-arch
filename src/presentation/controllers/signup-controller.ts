import { Controller } from "../protocols/controller";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../errors";

export class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return { statusCode: 400, body: new MissingParamError("name") };
  }
}
