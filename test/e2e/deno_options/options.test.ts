import {
  assertEquals,
  assertStrContains,
  join,
  resolve,
  stripColor,
} from "../../../dev_deps.ts";
import { testDenoXRun } from "../../utils/denox-run.ts";
import { exists } from "../../../src/utils/file.ts";

Deno.test("permissions are applied", async () => {
  await testDenoXRun(
    "permissions",
    "test/fixture/deno_options",
    async ({ output, code }) => {
      assertEquals(code, 0);

      output = stripColor(output);
      assertStrContains(
        output,
        'allow-env: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-hrtime: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-net: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-plugin: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-read: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-run: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-write: PermissionStatus { state: "granted" }',
      );
    },
  );
});

Deno.test("allow-all permissions are applied", async () => {
  await testDenoXRun(
    "all-permissions",
    "test/fixture/deno_options",
    async ({ output, code }) => {
      assertEquals(code, 0);

      output = stripColor(output);
      assertStrContains(
        output,
        'allow-env: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-hrtime: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-net: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-plugin: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-read: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-run: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-write: PermissionStatus { state: "granted" }',
      );
    },
  );
});

Deno.test("false permissions are applied", async () => {
  await testDenoXRun(
    "false-permissions",
    "test/fixture/deno_options",
    async ({ output, code }) => {
      assertEquals(code, 0);

      output = stripColor(output);
      assertStrContains(
        output,
        'allow-env: PermissionStatus { state: "prompt" }',
      );
      assertStrContains(
        output,
        'allow-hrtime: PermissionStatus { state: "prompt" }',
      );
      assertStrContains(
        output,
        'allow-net: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-plugin: PermissionStatus { state: "prompt" }',
      );
      assertStrContains(
        output,
        'allow-read: PermissionStatus { state: "granted" }',
      );
      assertStrContains(
        output,
        'allow-run: PermissionStatus { state: "prompt" }',
      );
      assertStrContains(
        output,
        'allow-write: PermissionStatus { state: "granted" }',
      );
    },
  );
});

Deno.test("seed option is applied", async () => {
  await testDenoXRun(
    "seed",
    "test/fixture/deno_options",
    async ({ output, code }) => {
      assertEquals(code, 0);
      output = stripColor(output);
      assertStrContains(output, "seed: 0.147205063401058");
    },
  );
});

Deno.test("quiet option is applied", async () => {
  await testDenoXRun(
    "quiet",
    "test/fixture/deno_options",
    async ({ output, code }) => {
      assertEquals(code, 0);
      output = stripColor(output);
      assertStrContains(output, "Only console.log\n");
    },
  );
});

Deno.test("lock option is applied", async () => {
  await testDenoXRun("lock", "test/fixture/deno_options", async ({ code }) => {
    const lockFilePath = resolve("../../fixture/deno_options/files/lock.json");
    const isLockFilePresent = await exists(lockFilePath);

    assertEquals(code, 0);
    assertEquals(isLockFilePresent, true);

    await Deno.remove(lockFilePath);
  });
});

Deno.test("log-level option is applied", async () => {
  await testDenoXRun(
    "log-level",
    "test/fixture/deno_options",
    async ({ code, output }) => {
      assertEquals(code, 0);
      output = stripColor(output);
      assertStrContains(output, "DEBUG JS");
    },
  );
});

Deno.test("config option is applied", async () => {
  await testDenoXRun(
    "config",
    "test/fixture/deno_options",
    async ({ code, output }) => {
      assertEquals(code, 0);
      output = stripColor(output);
      assertStrContains(output, "tsconfig.json");
    },
  );
});

Deno.test("import map option is applied", async () => {
  await testDenoXRun(
    "import-map",
    "test/fixture/deno_options",
    async ({ code, errOutput }) => {
      assertEquals(code, 0);
      errOutput = stripColor(errOutput);
      assertStrContains(
        errOutput,
        'ModuleSpecifier("https://deno.land/std/http/"',
      );
    },
  );
});

Deno.test("v8-flags, cached-only, cert, no-remote, reload options do not crash", async () => {
  await testDenoXRun(
    "rest-options",
    "test/fixture/deno_options",
    async ({ code }) => {
      assertEquals(code, 0);
    },
  );
});
