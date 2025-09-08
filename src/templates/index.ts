// Template Components Export
export { EcommerceStore } from './ecommerce/EcommerceStore';
export { BlogPlatform } from './blog/BlogPlatform';  
export { AnalyticsDashboard } from './dashboard/AnalyticsDashboard';
export { SocialPlatform } from './social/SocialPlatform';

// Template Metadata
export const TEMPLATE_COMPONENTS = {
  EcommerceStore: () => import('./ecommerce/EcommerceStore').then(m => m.EcommerceStore),
  BlogPlatform: () => import('./blog/BlogPlatform').then(m => m.BlogPlatform),
  AnalyticsDashboard: () => import('./dashboard/AnalyticsDashboard').then(m => m.AnalyticsDashboard),
  SocialPlatform: () => import('./social/SocialPlatform').then(m => m.SocialPlatform),
};

export type TemplateComponentName = keyof typeof TEMPLATE_COMPONENTS;