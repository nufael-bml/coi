import { GRPC as Cerbos } from "@cerbos/grpc";

const cerbosURL = process.env.CERBOS_GRPC_API_URL || "localhost:3593";

export const cerbos = new Cerbos(cerbosURL, { tls: false });
