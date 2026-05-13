import {Err, type IResult, Ok} from '@luolapeikko/result-option';
import type {StandardSchemaV1, StandardTypedV1} from '@standard-schema/spec';
import {SchemaError} from '@standard-schema/utils';

export class Std {
	/**
	 * Standard schmea validation as a result type.
	 * @example
	 * const email = Std.Result(zod.email(), 'some@email.com'); // Ok('some@email.com')
	 * const invalidEmail = Std.Result(zod.email(), 'not-an-email'); // Err(SchemaError)
	 * @param schema The schema to validate against.
	 * @param data The data to validate.
	 * @returns An IResult containing either the validated data or SchemaError error.
	 */
	public static Result<T extends StandardSchemaV1>(schema: T, data: unknown): IResult<StandardTypedV1.InferOutput<T>, SchemaError> {
		const res = schema['~standard'].validate(data);
		if (res instanceof Promise || typeof (res as {then?: unknown})?.then === 'function') {
			return Err(
				new SchemaError([
					{
						message: 'Std.ResultAsync/ResultAsyncFn should be used for async schemas',
					},
				]),
			);
		}
		if (res.issues) {
			return Err(new SchemaError(res.issues));
		} else {
			return Ok(res.value);
		}
	}

	/**
	 * Standard schmea validation as a result type function.
	 * @example
	 * const validateEmail = Std.ResultFn(zod.email());
	 * const email = validateEmail('some@email.com'); // Ok('some@email.com')
	 * const invalidEmail = validateEmail('not-an-email'); // Err(SchemaError)
	 * @param schema The schema to validate against.
	 * @returns A function that takes a value and returns an IResult containing either the validated data or SchemaError error.
	 */
	public static ResultFn<T extends StandardSchemaV1>(schema: T): (value: unknown) => IResult<StandardTypedV1.InferOutput<T>, SchemaError> {
		return (value: unknown) => Std.Result(schema, value);
	}

	/**
	 * Standard schmea validation as a result type for async schemas.
	 * @example
	 * const email = await Std.ResultAsync(zod.email(), 'some@email.com'); // Ok('some@email.com')
	 * const invalidEmail = await Std.ResultAsync(zod.email(), 'not-an-email'); // Err(SchemaError)
	 * @param schema The schema to validate against.
	 * @param data The data to validate.
	 * @returns A promise that resolves to an IResult containing either the validated data or SchemaError error.
	 */
	public static async ResultAsync<T extends StandardSchemaV1>(schema: T, data: unknown): Promise<IResult<StandardTypedV1.InferOutput<T>, SchemaError>> {
		const res = await schema['~standard'].validate(data);
		if (res.issues) {
			return Err(new SchemaError(res.issues));
		} else {
			return Ok(res.value);
		}
	}

	/**
	 * Standard schmea validation as a result type function for async schemas.
	 * @example
	 * const validateEmail = Std.ResultAsyncFn(zod.email());
	 * const email = await validateEmail('some@email.com'); // Ok('some@email.com')
	 * const invalidEmail = await validateEmail('not-an-email'); // Err(SchemaError)
	 * @param schema The schema to validate against.
	 * @returns A function that takes a value and returns a promise that resolves to an IResult containing either the validated data or SchemaError error.
	 */
	public static ResultAsyncFn<T extends StandardSchemaV1>(schema: T): (value: unknown) => Promise<IResult<StandardTypedV1.InferOutput<T>, SchemaError>> {
		return async (value: unknown) => Std.ResultAsync(schema, value);
	}
}
