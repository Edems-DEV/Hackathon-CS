import { IAutomationLog } from "../types/IAutomationLog";
import { api_auth, api_url } from "../utils/env_vars";
import { IAutomationType } from "../types/IAutomationType";
import { IErrorMessage } from "../types/IErrorMessage";
import { IAutomation } from "../types/IAutomation";

export class AutomationModel {
  static async getAutomations(
    search?: string,
    limit?: number,
    page?: number,
    sort?: string,
    order?: string,
    filters?: Record<string, string>
  ): Promise<IAutomation[] | IErrorMessage> {
    const params = new URLSearchParams({
      id_like: search ?? "",
      limit: limit?.toString() ? limit!.toString() : "99999",
      page: page?.toString() ?? "1",
      sort: sort ?? "",
      order: order ?? "asc",
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, value);
      });
    }

    const response = await fetch(`${api_url}/automations?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${api_auth}`,
      },
    });

    return response.json();
  }

  static async getAutomationById(
    id: string
  ): Promise<IAutomation | IErrorMessage> {
    const response = await fetch(`${api_url}/automations/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${api_auth}`,
      },
    });

    return response.json();
  }

  static async getAutomationLogs(
    id: string
  ): Promise<IAutomationLog[] | IErrorMessage> {
    const response = await fetch(`${api_url}/automations/${id}/logs`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${api_auth}`,
      },
    });
    return response.json();
  }

  static async getAutomationTypes(
    search?: string,
    limit?: number,
    page?: number,
    sort?: string,
    order?: string,
    filters?: Record<string, string>
  ): Promise<IAutomationType[] | IErrorMessage> {
    const params = new URLSearchParams({
      search: search ?? "",
      limit: limit?.toString() ? limit!.toString() : "999999",
      page: page?.toString() ?? "1",
      sort: sort ?? "",
      order: order ?? "asc",
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, value);
      });
    }

    const response = await fetch(`${api_url}/automation-types?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${api_auth}`,
      },
    });

    return response.json();
  }

  static async getAutomationType(
    type: string
  ): Promise<IAutomationType | IErrorMessage> {
    const response = await fetch(`${api_url}/automation-types/${type}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${api_auth}`,
      },
    });

    return response.json();
  }
}
