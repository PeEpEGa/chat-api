export interface IHttpRequest {
  params: Record<string, any>;
  query: Record<string, any>;
  body: Record<string, any>;
  user?: {
    userId: string;
  };
}
