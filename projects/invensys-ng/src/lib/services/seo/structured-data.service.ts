import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Organization schema configuration
 */
export interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    telephone: string;
    contactType: string;
    areaServed?: string;
    availableLanguage?: string[];
  };
}

/**
 * WebSite schema configuration
 */
export interface WebSiteSchema {
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    queryInput: string;
    target: string;
  };
}

/**
 * BreadcrumbList item configuration
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Article schema configuration
 */
export interface ArticleSchema {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
}

/**
 * Service for managing structured data (JSON-LD) for SEO.
 *
 * This service provides methods to insert and manage schema.org
 * structured data in the document head for improved search engine
 * visibility and rich search results.
 *
 * @example
 * ```typescript
 * import { StructuredDataService } from 'invensys-ng';
 *
 * export class AppComponent {
 *   constructor(private structuredDataService: StructuredDataService) {
 *     // Insert organization schema
 *     const orgSchema = this.structuredDataService.createOrganizationSchema({
 *       name: 'My Company',
 *       url: 'https://example.com',
 *       logo: 'https://example.com/logo.png'
 *     });
 *     this.structuredDataService.insertSchema(orgSchema, 'organization-schema');
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class StructuredDataService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Inserts or updates a JSON-LD schema script in the document head.
   *
   * @param schema - The schema object to insert
   * @param id - Unique identifier for the script element (default: 'structured-data')
   */
  insertSchema(schema: object, id: string = 'structured-data'): void {
    if (typeof this.document === 'undefined') {
      return;
    }

    let script = this.document.getElementById(id) as HTMLScriptElement | null;

    if (!script) {
      script = this.document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
  }

  /**
   * Removes a schema script from the document.
   *
   * @param id - The identifier of the script element to remove
   */
  removeSchema(id: string): void {
    if (typeof this.document === 'undefined') {
      return;
    }

    const script = this.document.getElementById(id);
    if (script) {
      script.remove();
    }
  }

  /**
   * Creates an Organization schema object.
   *
   * @param config - Organization configuration
   * @returns A schema.org Organization object
   */
  createOrganizationSchema(config: OrganizationSchema): object {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: config.name,
      url: config.url,
    };

    if (config.logo) {
      schema['logo'] = config.logo;
    }

    if (config.sameAs && config.sameAs.length > 0) {
      schema['sameAs'] = config.sameAs;
    }

    if (config.contactPoint) {
      schema['contactPoint'] = {
        '@type': 'ContactPoint',
        telephone: config.contactPoint.telephone,
        contactType: config.contactPoint.contactType,
        ...(config.contactPoint.areaServed && {
          areaServed: config.contactPoint.areaServed,
        }),
        ...(config.contactPoint.availableLanguage && {
          availableLanguage: config.contactPoint.availableLanguage,
        }),
      };
    }

    return schema;
  }

  /**
   * Creates a WebSite schema object.
   *
   * @param config - WebSite configuration
   * @returns A schema.org WebSite object
   */
  createWebSiteSchema(config: WebSiteSchema): object {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: config.name,
      url: config.url,
    };

    if (config.description) {
      schema['description'] = config.description;
    }

    if (config.potentialAction) {
      schema['potentialAction'] = {
        '@type': 'SearchAction',
        target: config.potentialAction.target,
        'query-input': config.potentialAction.queryInput,
      };
    }

    return schema;
  }

  /**
   * Creates a BreadcrumbList schema object.
   *
   * @param items - Array of breadcrumb items
   * @returns A schema.org BreadcrumbList object
   */
  createBreadcrumbSchema(items: BreadcrumbItem[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  /**
   * Creates an Article schema object.
   *
   * @param config - Article configuration
   * @returns A schema.org Article object
   */
  createArticleSchema(config: ArticleSchema): object {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: config.headline,
      description: config.description,
      datePublished: config.datePublished,
      author: {
        '@type': 'Person',
        name: config.author.name,
        ...(config.author.url && { url: config.author.url }),
      },
    };

    if (config.image) {
      schema['image'] = config.image;
    }

    if (config.dateModified) {
      schema['dateModified'] = config.dateModified;
    }

    return schema;
  }

  /**
   * Creates a SoftwareApplication schema object for the library.
   *
   * @param config - Application configuration
   * @returns A schema.org SoftwareApplication object
   */
  createSoftwareApplicationSchema(config: {
    name: string;
    description: string;
    applicationCategory: string;
    operatingSystem?: string;
    offers?: {
      price: string;
      priceCurrency: string;
    };
  }): object {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: config.name,
      description: config.description,
      applicationCategory: config.applicationCategory,
    };

    if (config.operatingSystem) {
      schema['operatingSystem'] = config.operatingSystem;
    }

    if (config.offers) {
      schema['offers'] = {
        '@type': 'Offer',
        price: config.offers.price,
        priceCurrency: config.offers.priceCurrency,
      };
    }

    return schema;
  }
}
