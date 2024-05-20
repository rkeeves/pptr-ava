export default {
  "files": [
    "test/**/*",
  ],
  // "match": [],
  "concurrency": 4,
  "failFast": true,
  "failWithoutAssertions": true,
  "environmentVariables": {},
  "verbose": true,
  "require": [

  ],
  "nodeArguments": [
    "--trace-deprecation",
    "--napi-modules"
  ]
}
