import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageDto } from '../dtos/page.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  Model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PageDto, Model),
    ApiOkResponse({
      description: `Successfully received ${Model.name} list`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(Model) },
              },
            },
          },
        ],
      },
    }),
  );
};
