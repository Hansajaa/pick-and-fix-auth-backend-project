import {Repository} from "typeorm";

export function processPaginationData(response: any) {
    const {page, itemsPerPage, totalItems, data} = response[0][0];

    return {
        page: page,
        itemsPerPage: itemsPerPage,
        totalItems: totalItems,
        data: JSON.parse(data)
    }
}

export function processData(response: any, index: number) {
    return index == 0 ? response[0] : response[0][0]
}

export async function executeProcedure<T>(
    repository: Repository<T>,
    procedureName: string,
    params?: any | any[]
) {
    try {
        const formattedParams = Array.isArray(params)
            ? params
            : Object.values(params);

        const placeholders = formattedParams
            .map(() => '?')
            .join(', ');

        return await repository.query(
            `CALL ${procedureName}(${placeholders})`,
            formattedParams
        );
    } catch (error) {

        return {
            success: false,
            message: `Error executing stored procedure: ${error.message}`,
            error,
        };
    }
}
