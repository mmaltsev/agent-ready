import * as SwaggerParser from "@apidevtools/swagger-parser";

export async function parseOpenApi(path: string): Promise<any> {
    return SwaggerParser.parse(path);
}