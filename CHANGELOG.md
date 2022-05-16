
## Harmony Explorer 1.1.0 (May 13, 2022)

1) Fixed Explorer API memory consumption
   In-memory cache causing OOM error and unexpected API instance restarts. Cache was limited for all API endpoints, restarts stopped.
   ([PR #58](https://github.com/harmony-one/explorer-v2-backend/pull/58))

2) Removed heavy 1wallet stats recalculation on every API startup, which produced a lot of I/O operations. Explorer API RDS I/O cost was reduced by more than 10 times.
   ([PR #56](https://github.com/harmony-one/explorer-v2-backend/pull/56))

3) Added Prometheus metrics to Explorer API endpoints;
   ([PR #42](https://github.com/harmony-one/explorer-v2-backend/pull/42))

4) Fixed issue with indexing HRC contracts with null characters in contract name;
   ([PR #53](https://github.com/harmony-one/explorer-v2-backend/pull/53))

5) Fixed issue with duplicated HRC20 transfers in history;
   ([PR #28](https://github.com/harmony-one/explorer-v2-backend/pull/28))

6) Fixed UI issue with overlapping charts on iPad;
   ([PR #177](https://github.com/harmony-one/explorer-v2-frontend/pull/177))

7) Improved CSV transactions export format;
   ([Commit](https://github.com/harmony-one/explorer-v2-frontend/commit/e21175729f233384bfeed4a2d5e819303b417af1))

8) ETH-style addresses shows with injected checksum;
   ([PR #176](https://github.com/harmony-one/explorer-v2-frontend/pull/176))

9) Main page charts integration with Metrics DAO;
   ([PR #35](https://github.com/harmony-one/explorer-v2-backend/pull/35))

10) Improved main page charts colors for dark theme
    ([PR #179](https://github.com/harmony-one/explorer-v2-frontend/pull/179))
