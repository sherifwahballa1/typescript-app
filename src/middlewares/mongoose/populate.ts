import { Document } from "mongoose";

export function populateInstance<T extends Document>(
	instance: T,
	field: string
): Promise<T> {
	return new Promise((res, rej) => {
		instance.populate(field, (err, response) => {
			if (err) {
				rej(err);
			} else {
				res(response);
			}
		});
	});
}


/**  
 *  -----------     Example    --------------
 * 
 * 
	resp.map(async (result) => {
		if (result.total !== 0) {
			const order = await populateInstance(result, "products.product");
		}
	});
 * 
*/
