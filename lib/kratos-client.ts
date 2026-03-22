import {
  FrontendApi,
  IdentityApi,
  Configuration
} from '@ory/kratos-client';

const kratosPublicUrl = process.env.KRATOS_PUBLIC_URL || 'http://localhost:4433';
const kratosAdminUrl = process.env.KRATOS_ADMIN_URL || 'http://localhost:4434';

const publicConfig = new Configuration({
    basePath: kratosPublicUrl,
    baseOptions: {
        timeout: 5000,
        withCredentials: true,
    }
});

// Note: This API should NEVER be exposed to the public internet.
const adminConfig = new Configuration({
    basePath: kratosAdminUrl,
    baseOptions: {
        timeout: 5000,
        withCredentials: true,
    }
});

export const ory = new FrontendApi(publicConfig);
export const oryAdmin = new IdentityApi(adminConfig);