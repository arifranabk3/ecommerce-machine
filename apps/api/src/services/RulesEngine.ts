import { IAutomationRule } from '@sellzy/shared';

export class RulesEngine {
  public static evaluate(rules: IAutomationRule[], data: Record<string, any>): boolean {
    if (!rules || rules.length === 0) return true;

    for (const rule of rules) {
      const match = this.evaluateSingleRule(rule, data);
      if (!match) return false; // Default AND logic between root array items
    }
    return true;
  }

  public static evaluateSingleRule(rule: IAutomationRule, data: Record<string, any>): boolean {
    if (rule.rules && rule.rules.length > 0) {
      const isOr = rule.logic === 'OR';
      let result = !isOr;
      for (const child of rule.rules) {
        const childRes = this.evaluateSingleRule(child, data);
        if (isOr) {
          if (childRes) { result = true; break; }
        } else {
          if (!childRes) { result = false; break; }
        }
      }
      return rule.not ? !result : result;
    }

    const value = this.getValueByPath(data, rule.field);
    let matched = false;

    switch (rule.operator) {
      case 'equals':
        matched = value === rule.value;
        break;
      case 'notEquals':
        matched = value !== rule.value;
        break;
      case 'greaterThan':
        matched = typeof value === 'number' && typeof rule.value === 'number' && value > rule.value;
        break;
      case 'greaterThanOrEqual':
        matched = typeof value === 'number' && typeof rule.value === 'number' && value >= rule.value;
        break;
      case 'lessThan':
        matched = typeof value === 'number' && typeof rule.value === 'number' && value < rule.value;
        break;
      case 'lessThanOrEqual':
        matched = typeof value === 'number' && typeof rule.value === 'number' && value <= rule.value;
        break;
      case 'in':
        matched = Array.isArray(rule.value) && rule.value.includes(value);
        break;
      case 'notIn':
        matched = Array.isArray(rule.value) && !rule.value.includes(value);
        break;
      case 'contains':
        if (typeof value === 'string' && typeof rule.value === 'string') {
          matched = value.includes(rule.value);
        } else if (Array.isArray(value)) {
          matched = value.includes(rule.value);
        }
        break;
      case 'exists':
        matched = rule.value ? value !== undefined && value !== null : value === undefined || value === null;
        break;
      case 'between':
        if (Array.isArray(rule.value) && rule.value.length === 2 && typeof value === 'number') {
          matched = value >= rule.value[0] && value <= rule.value[1];
        }
        break;
      default:
        throw new Error(`Unsupported rule operator: ${rule.operator}`);
    }

    return rule.not ? !matched : matched;
  }

  private static getValueByPath(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    return current;
  }
}
