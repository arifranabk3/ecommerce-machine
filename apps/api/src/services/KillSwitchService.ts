export class KillSwitchService {
  private static globalDisabled = false;
  private static disabledTenants: Set<string> = new Set();
  private static disabledWorkflows: Set<string> = new Set();
  private static disabledActions: Set<string> = new Set();

  public static setGlobalKillSwitch(disabled: boolean): void {
    this.globalDisabled = disabled;
  }

  public static isGlobalDisabled(): boolean {
    return this.globalDisabled;
  }

  public static setTenantKillSwitch(tenantId: string, disabled: boolean): void {
    if (disabled) {
      this.disabledTenants.add(tenantId);
    } else {
      this.disabledTenants.delete(tenantId);
    }
  }

  public static isTenantDisabled(tenantId: string): boolean {
    return this.disabledTenants.has(tenantId);
  }

  public static setWorkflowKillSwitch(workflowId: string, disabled: boolean): void {
    if (disabled) {
      this.disabledWorkflows.add(workflowId);
    } else {
      this.disabledWorkflows.delete(workflowId);
    }
  }

  public static isWorkflowDisabled(workflowId: string): boolean {
    return this.disabledWorkflows.has(workflowId);
  }

  public static setActionKillSwitch(actionType: string, disabled: boolean): void {
    if (disabled) {
      this.disabledActions.add(actionType);
    } else {
      this.disabledActions.delete(actionType);
    }
  }

  public static isActionDisabled(actionType: string): boolean {
    return this.disabledActions.has(actionType);
  }

  public static isExecutionAllowed(tenantId: string, workflowId?: string, actionType?: string): { allowed: boolean; reason?: string } {
    if (this.globalDisabled) {
      return { allowed: false, reason: 'Global automation kill switch is ACTIVE' };
    }
    if (this.disabledTenants.has(tenantId)) {
      return { allowed: false, reason: `Tenant automation kill switch is ACTIVE for tenant ${tenantId}` };
    }
    if (workflowId && this.disabledWorkflows.has(workflowId)) {
      return { allowed: false, reason: `Workflow kill switch is ACTIVE for workflow ${workflowId}` };
    }
    if (actionType && this.disabledActions.has(actionType)) {
      return { allowed: false, reason: `Action kill switch is ACTIVE for action ${actionType}` };
    }
    return { allowed: true };
  }

  public static resetAll(): void {
    this.globalDisabled = false;
    this.disabledTenants.clear();
    this.disabledWorkflows.clear();
    this.disabledActions.clear();
  }
}
