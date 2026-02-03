export type PolicyEffect = 'allow' | 'deny';
export const PolicyEffect = {
    ALLOW: 'allow' as PolicyEffect,
    DENY: 'deny' as PolicyEffect,
};

export interface Policy {
    _id: string;
    name: string;
    description?: string;
    resources: string[];
    actions: string[];
    roles: string[];
    effect: PolicyEffect;
    conditions?: Record<string, any>;
    isActive: boolean;
}

export interface CreatePolicyInput {
    name: string;
    description?: string;
    resources: string[];
    actions: string[];
    roles: string[];
    effect: PolicyEffect;
    conditions?: Record<string, any>;
}

export interface CheckAccessInput {
    resource: string;
    action: string;
    role?: string;
}

export interface AccessCheckResult {
    granted: boolean;
}
