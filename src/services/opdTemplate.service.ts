// src/services/opdTemplate.service.ts
import { hmsClient } from '@/lib/client';
import { buildQueryString } from '@/lib/apiConfig';
import {
  TemplateGroup,
  TemplateGroupsResponse,
  TemplateGroupsQueryParams,
  CreateTemplateGroupPayload,
  UpdateTemplateGroupPayload,
  Template,
  TemplatesResponse,
  TemplatesQueryParams,
  CreateTemplatePayload,
  UpdateTemplatePayload,
  TemplateField,
  TemplateFieldsResponse,
  TemplateFieldsQueryParams,
  CreateTemplateFieldPayload,
  UpdateTemplateFieldPayload,
  TemplateFieldOption,
  TemplateFieldOptionsResponse,
  TemplateFieldOptionsQueryParams,
  CreateTemplateFieldOptionPayload,
  UpdateTemplateFieldOptionPayload,
} from '@/types/opdTemplate.types';

class OPDTemplateService {
  private baseURL = '/api/opd';

  // ==================== TEMPLATE GROUPS ====================

  async getTemplateGroups(params?: TemplateGroupsQueryParams): Promise<TemplateGroupsResponse> {
    try {
      const queryString = buildQueryString(params);
      const response = await hmsClient.get<TemplateGroupsResponse>(
        `${this.baseURL}/template-groups/${queryString}`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to fetch template groups';
      throw new Error(message);
    }
  }

  async getTemplateGroup(id: number): Promise<TemplateGroup> {
    try {
      const response = await hmsClient.get<TemplateGroup>(
        `${this.baseURL}/template-groups/${id}/`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to fetch template group';
      throw new Error(message);
    }
  }

  async createTemplateGroup(data: CreateTemplateGroupPayload): Promise<TemplateGroup> {
    try {
      const response = await hmsClient.post<TemplateGroup>(
        `${this.baseURL}/template-groups/`,
        data
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to create template group';
      throw new Error(message);
    }
  }

  async updateTemplateGroup(id: number, data: UpdateTemplateGroupPayload): Promise<TemplateGroup> {
    try {
      const response = await hmsClient.patch<TemplateGroup>(
        `${this.baseURL}/template-groups/${id}/`,
        data
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to update template group';
      throw new Error(message);
    }
  }

  async deleteTemplateGroup(id: number): Promise<void> {
    try {
      await hmsClient.delete(`${this.baseURL}/template-groups/${id}/`);
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to delete template group';
      throw new Error(message);
    }
  }

  // ==================== TEMPLATES ====================

  async getTemplates(params?: TemplatesQueryParams): Promise<TemplatesResponse> {
    try {
      const queryString = buildQueryString(params);
      const response = await hmsClient.get<TemplatesResponse>(
        `${this.baseURL}/templates/${queryString}`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to fetch templates';
      throw new Error(message);
    }
  }

  async getTemplate(id: number): Promise<Template> {
    try {
      const response = await hmsClient.get<Template>(
        `${this.baseURL}/templates/${id}/`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to fetch template';
      throw new Error(message);
    }
  }

  async createTemplate(data: CreateTemplatePayload): Promise<Template> {
    try {
      const response = await hmsClient.post<Template>(
        `${this.baseURL}/templates/`,
        data
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to create template';
      throw new Error(message);
    }
  }

  async updateTemplate(id: number, data: UpdateTemplatePayload): Promise<Template> {
    try {
      const response = await hmsClient.patch<Template>(
        `${this.baseURL}/templates/${id}/`,
        data
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to update template';
      throw new Error(message);
    }
  }

  async deleteTemplate(id: number): Promise<void> {
    try {
      await hmsClient.delete(`${this.baseURL}/templates/${id}/`);
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to delete template';
      throw new Error(message);
    }
  }

  async duplicateTemplate(id: number): Promise<Template> {
    try {
      const response = await hmsClient.post<Template>(
        `${this.baseURL}/templates/${id}/duplicate/`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to duplicate template';
      throw new Error(message);
    }
  }

  // ==================== TEMPLATE FIELDS ====================

  async getTemplateFields(params?: TemplateFieldsQueryParams): Promise<TemplateFieldsResponse> {
    try {
      const queryString = buildQueryString(params);
      const response = await hmsClient.get<TemplateFieldsResponse>(
        `${this.baseURL}/template-fields/${queryString}`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to fetch template fields';
      throw new Error(message);
    }
  }

  async getTemplateField(id: number): Promise<TemplateField> {
    try {
      const response = await hmsClient.get<TemplateField>(
        `${this.baseURL}/template-fields/${id}/`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to fetch template field';
      throw new Error(message);
    }
  }

  async createTemplateField(data: CreateTemplateFieldPayload): Promise<TemplateField> {
    try {
      const response = await hmsClient.post<TemplateField>(
        `${this.baseURL}/template-fields/`,
        data
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to create template field';
      throw new Error(message);
    }
  }

  async updateTemplateField(id: number, data: UpdateTemplateFieldPayload): Promise<TemplateField> {
    try {
      const response = await hmsClient.patch<TemplateField>(
        `${this.baseURL}/template-fields/${id}/`,
        data
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to update template field';
      throw new Error(message);
    }
  }

  async deleteTemplateField(id: number): Promise<void> {
    try {
      await hmsClient.delete(`${this.baseURL}/template-fields/${id}/`);
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to delete template field';
      throw new Error(message);
    }
  }

  // ==================== TEMPLATE FIELD OPTIONS ====================

  async getTemplateFieldOptions(
    params?: TemplateFieldOptionsQueryParams
  ): Promise<TemplateFieldOptionsResponse> {
    try {
      const queryString = buildQueryString(params);
      const response = await hmsClient.get<TemplateFieldOptionsResponse>(
        `${this.baseURL}/template-field-options/${queryString}`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to fetch template field options';
      throw new Error(message);
    }
  }

  async getTemplateFieldOption(id: number): Promise<TemplateFieldOption> {
    try {
      const response = await hmsClient.get<TemplateFieldOption>(
        `${this.baseURL}/template-field-options/${id}/`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to fetch template field option';
      throw new Error(message);
    }
  }

  async createTemplateFieldOption(
    data: CreateTemplateFieldOptionPayload
  ): Promise<TemplateFieldOption> {
    try {
      const response = await hmsClient.post<TemplateFieldOption>(
        `${this.baseURL}/template-field-options/`,
        data
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to create template field option';
      throw new Error(message);
    }
  }

  async updateTemplateFieldOption(
    id: number,
    data: UpdateTemplateFieldOptionPayload
  ): Promise<TemplateFieldOption> {
    try {
      const response = await hmsClient.patch<TemplateFieldOption>(
        `${this.baseURL}/template-field-options/${id}/`,
        data
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to update template field option';
      throw new Error(message);
    }
  }

  async deleteTemplateFieldOption(id: number): Promise<void> {
    try {
      await hmsClient.delete(`${this.baseURL}/template-field-options/${id}/`);
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to delete template field option';
      throw new Error(message);
    }
  }
}

export const opdTemplateService = new OPDTemplateService();
