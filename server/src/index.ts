import express from "express";
import { convert } from "./convert";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
  sendResult,
} from "graphql-helix";
import cors from "cors";
import { schema } from "./schema";
import { getCPI } from "./cpi";

const app = express();

const transactions = convert();
const cpi = getCPI();

app.use(express.json());

app.use("/graphiql", async (req, res) => {
  res.send(renderGraphiQL());
});

app.use(
  "/graphql",
  cors({
    origin: "*",
  }),
  async (req, res) => {
    // Create a generic Request object that can be consumed by Graphql Helix's API
    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };

    // Determine whether we should render GraphiQL instead of returning an API response
    if (shouldRenderGraphiQL(request)) {
      res.send(renderGraphiQL());
    } else {
      // Extract the Graphql parameters from the request
      const { operationName, query, variables } = getGraphQLParameters(request);

      // Validate and execute the query
      const result = await processRequest({
        operationName,
        query,
        variables,
        request,
        schema: schema(await transactions, await cpi),
      });

      // processRequest returns one of three types of results depending on how the server should respond
      // 1) RESPONSE: a regular JSON payload
      // 2) MULTIPART RESPONSE: a multipart response (when @stream or @defer directives are used)
      // 3) PUSH: a stream of events to push back down the client for a subscription
      // The "sendResult" is a NodeJS-only shortcut for handling all possible types of Graphql responses,
      // See "Advanced Usage" below for more details and customizations available on that layer.
      sendResult(result, res);
    }
  },
);

const port = process.env.PORT || 4000;

app.get("/transactions", async (req, res) => {
  res.json(transactions);
});

app.listen(port, () => {
  console.log(`GraphQL server is running on port ${port}.`);
});
