import assert from "node:assert/strict";
import test from "node:test";
import { authenticate } from "./auth";

test("rejects admin authentication when no password is configured", () => {
  const previousPassword = process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_PASSWORD;

  try {
    assert.deepEqual(authenticate(""), { ok: false, cookie: null });
  } finally {
    if (previousPassword === undefined) {
      delete process.env.ADMIN_PASSWORD;
    } else {
      process.env.ADMIN_PASSWORD = previousPassword;
    }
  }
});

test("accepts only the configured admin password", () => {
  const previousPassword = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_PASSWORD = "test-admin-password";

  try {
    assert.equal(authenticate("test-admin-password").ok, true);
    assert.deepEqual(authenticate(""), { ok: false, cookie: null });
  } finally {
    if (previousPassword === undefined) {
      delete process.env.ADMIN_PASSWORD;
    } else {
      process.env.ADMIN_PASSWORD = previousPassword;
    }
  }
});
