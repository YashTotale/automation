// Externals
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export type Repo = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][number];
