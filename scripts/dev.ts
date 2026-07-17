type Managed = {
  name: string;
  proc: Bun.Subprocess;
};

const spawn = (name: string, cmd: string[]): Managed => ({
  name,
  proc: Bun.spawn(cmd, { stdout: "inherit", stderr: "inherit" }),
});

const managed = [
  spawn("server", ["bun", "run", "packages/server/src/index.ts"]),
  spawn("web", ["bun", "--filter", "@motherbase/web", "dev"]),
];

const settled = (entry: Managed) =>
  entry.proc.exited.then((code) => ({ entry, code }));

const first = await Promise.race(managed.map(settled));

for (const { proc } of managed) {
  proc.kill();
}
await Promise.all(managed.map(({ proc }) => proc.exited));

console.error(`${first.entry.name} exited with code ${first.code}`);
process.exit(first.code);
