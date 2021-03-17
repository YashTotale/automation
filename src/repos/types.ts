// Externals
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export type Repo = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][number];
export type BaseRepoContent = RestEndpointMethodTypes["repos"]["getContent"]["response"]["data"];
export type BaseRepoArrContent = Extract<BaseRepoContent, Array<any>>;
