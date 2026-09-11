import { describe, expect, test } from "bun:test";
import { Scenario } from "../harness/scenario";

describe("POST /sessions/:id/permissions/:requestId", () => {
  test("a live request accepts its reply with 204 and saves the outcome", async () => {
    const scenario = new Scenario();
    scenario.withPermissions();
    const requested = scenario.waitFor("permission-requested");
    const authorized = scenario.permissions.authorize("read", {
      verb: "read",
      path: "/tmp/project/a.txt",
    });
    const { request } = await requested;

    const response = await scenario.replyToPermission(request.id, {
      decision: "once",
    });
    await authorized;

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(scenario.messages).toEqual([
      { kind: "permission-request", request },
      {
        kind: "permission-reply",
        requestId: request.id,
        outcome: { decision: "once", granted: null },
      },
    ]);
  });

  test("an unknown request is rejected with 409", async () => {
    const scenario = new Scenario();
    scenario.withPermissions();

    const response = await scenario.replyToPermission(crypto.randomUUID(), {
      decision: "once",
    });

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: "This permission request is no longer active.",
    });
    expect(scenario.messages).toEqual([]);
  });

  test("an already answered request is rejected with 409", async () => {
    const scenario = new Scenario();
    scenario.withPermissions();
    const requested = scenario.waitFor("permission-requested");
    const authorized = scenario.permissions.authorize("read", {
      verb: "read",
      path: "/tmp/project/a.txt",
    });
    const { request } = await requested;
    await scenario.replyToPermission(request.id, { decision: "once" });
    await authorized;

    const response = await scenario.replyToPermission(request.id, {
      decision: "once",
    });

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: "This permission request is no longer active.",
    });
    expect(scenario.messages).toEqual([
      { kind: "permission-request", request },
      {
        kind: "permission-reply",
        requestId: request.id,
        outcome: { decision: "once", granted: null },
      },
    ]);
  });
});
