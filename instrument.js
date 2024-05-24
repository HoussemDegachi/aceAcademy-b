import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
    dsn: "https://3aad1c3df14485ba53b0eb0e76dc7585@o4507311681634304.ingest.de.sentry.io/4507312115220560",
    integrations: [
      nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.2, //  Capture 100% of the transactions
  
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });