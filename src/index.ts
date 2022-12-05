import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { graphqlHTTP } from "express-graphql";
import { useServer } from "graphql-ws/lib/use/ws";
import path from "path";
import chalk from 'chalk';
import { schema } from "./server";

import OpenMCTApp from "./open-mct-app";

const app = express();
const port = process.env.PORT || 4000;
const wsEndpointPath = `/${process.env.ENDPOINT_PATH || "graphql"}`;

app.use(cors());
app.use("/", OpenMCTApp());
app.use(wsEndpointPath, graphqlHTTP({ schema }));

const server = app.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(
    "⚡️ Graphem is installed in NASA Open MCT visualization framework"
  );
  console.log(chalk.cyan(
    `🚀 Open MCT app hosted at: ${url}`
  ));
  console.log(chalk.greenBright(
    `✨ Server hosted at: ${url}${wsEndpointPath}`
  ));
  console.log(
    "Learn more about Graphem at: https://github.com/360macky/graphem"
  );

  const wsServer = new WebSocketServer({
    server,
    path: wsEndpointPath,
  });
  useServer({ schema }, wsServer);
});
