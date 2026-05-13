import {SchemaError} from '@standard-schema/utils';
import {describe, expect, it} from 'vitest';
import {z} from 'zod';
import {Std} from '../src/index';

describe('Std', () => {
	describe('Result', () => {
		it('should return Ok for valid data', () => {
			const res = Std.Result(z.string(), 'valid string');
			expect(res.isOk).toBe(true);
			expect(res.unwrap()).toBe('valid string');
		});

		it('should return Err for invalid data', () => {
			const res = Std.Result(z.string(), 123);
			expect(res.isErr).toBe(true);
			expect(res.err()).toBeInstanceOf(SchemaError);
			expect(() => res.unwrap()).toThrow(SchemaError);
		});

		it('should return Err when an async schema is used with Result', () => {
			const asyncSchema = z.string().refine(async (value) => value.length > 0, {
				message: 'must not be empty',
			});

			const res = Std.Result(asyncSchema, 'value');
			const err = res.err();

			expect(res.isErr).toBe(true);
			expect(err).toBeInstanceOf(SchemaError);
			expect(err?.issues[0]?.message).toContain('Std.ResultAsync/ResultAsyncFn should be used for async schemas');
		});
	});

	describe('ResultFn', () => {
		it('should validate values using a generated function', () => {
			const validate = Std.ResultFn(z.number());

			const ok = validate(42);
			const err = validate('42');

			expect(ok.isOk).toBe(true);
			expect(ok.unwrap()).toBe(42);
			expect(err.isErr).toBe(true);
			expect(err.err()).toBeInstanceOf(SchemaError);
		});
	});

	describe('ResultAsync', () => {
		it('should return Ok for valid data', async () => {
			const res = await Std.ResultAsync(z.string(), 'valid string');
			expect(res.isOk).toBe(true);
			expect(res.unwrap()).toBe('valid string');
		});

		it('should return Err for invalid data', async () => {
			const res = await Std.ResultAsync(z.string(), 123);
			expect(res.isErr).toBe(true);
			expect(res.err()).toBeInstanceOf(SchemaError);
			expect(() => res.unwrap()).toThrow(SchemaError);
		});

		it('should support async schemas', async () => {
			const asyncSchema = z.string().refine(async (value) => value === 'allowed', {
				message: 'must equal allowed',
			});

			const ok = await Std.ResultAsync(asyncSchema, 'allowed');
			const err = await Std.ResultAsync(asyncSchema, 'denied');

			expect(ok.isOk).toBe(true);
			expect(ok.unwrap()).toBe('allowed');
			expect(err.isErr).toBe(true);
			expect(err.err()).toBeInstanceOf(SchemaError);
		});
	});

	describe('ResultAsyncFn', () => {
		it('should validate values using a generated async function', async () => {
			const validate = Std.ResultAsyncFn(z.number().int());

			const ok = await validate(42);
			const err = await validate(42.5);

			expect(ok.isOk).toBe(true);
			expect(ok.unwrap()).toBe(42);
			expect(err.isErr).toBe(true);
			expect(err.err()).toBeInstanceOf(SchemaError);
		});
	});
});
