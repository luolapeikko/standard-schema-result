# @luolapeikko/standard-schema-result

[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![npm version](https://badge.fury.io/js/@luolapeikko%2Fstandard-schema-result.svg)](https://badge.fury.io/js/@luolapeikko%2Fstandard-schema-result)
[![Maintainability](https://qlty.sh/gh/luolapeikko/projects/standard-schema-result/maintainability.svg)](https://qlty.sh/gh/luolapeikko/projects/standard-schema-result)
[![Code Coverage](https://qlty.sh/gh/luolapeikko/projects/standard-schema-result/coverage.svg)](https://qlty.sh/gh/luolapeikko/projects/standard-schema-result)
[![CI/CD](https://github.com/luolapeikko/standard-schema-result/actions/workflows/main.yml/badge.svg)](https://github.com/luolapeikko/standard-schema-result/actions/workflows/main.yml)

Use standard schema validation with result types. This package provides utility functions to validate data against schemas and return results in a consistent format, making error handling easier and more predictable.
Supports both synchronous and asynchronous validation, and is compatible with popular schema validation libraries like ArkType , Zod and Valibot.

## Install

```bash
npm i @luolapeikko/standard-schema-result @standard-schema/spec @standard-schema/utils @luolapeikko/result-option --save

```

## Usage

```typescript
import { Std } from "@luolapeikko/standard-schema-result";

const email = Std.Result(zod.email(), "some@email.com"); // Ok('some@email.com')
const invalidEmail = Std.Result(zod.email(), "not-an-email"); // Err(SchemaError)
```

```typescript
import { Std } from "@luolapeikko/standard-schema-result";

const validateEmail = Std.ResultFn(zod.email());
const email = validateEmail("some@email.com"); // Ok('some@email.com')
const invalidEmail = validateEmail("not-an-email"); // Err(SchemaError)
```

```typescript
import { Std } from "@luolapeikko/standard-schema-result";

const email = await Std.ResultAsync(zod.email(), "some@email.com"); // Ok('some@email.com')
const invalidEmail = await Std.ResultAsync(zod.email(), "not-an-email"); // Err(SchemaError)
```

```typescript
import { Std } from "@luolapeikko/standard-schema-result";

const validateEmail = Std.ResultAsyncFn(zod.email());
const email = await validateEmail("some@email.com"); // Ok('some@email.com')
const invalidEmail = await validateEmail("not-an-email"); // Err(SchemaError)
```
