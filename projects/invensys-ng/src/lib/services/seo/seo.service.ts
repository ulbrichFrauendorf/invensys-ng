import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

/**
 * Configuration interface for SEO meta tags
 */
export interface SeoConfig {
  /** Page title - will be set as the document title */
  title: string;
  /** Meta description - should be 150-160 characters for optimal SEO */
  description: string;
  /** Meta keywords - comma-separated list of keywords */
  keywords?: string;
  /** Canonical URL of the page */
  url?: string;
  /** Image URL for social sharing (og:image, twitter:image) */
  image?: string;
  /** Type of content (website, article, product, etc.) */
  type?: string;
  /** Site name for Open Graph */
  siteName?: string;
  /** Twitter card type (summary, summary_large_image, app, player) */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
}

/**
 * Service for managing SEO meta tags dynamically.
 *
 * This service provides methods to update page titles, meta descriptions,
 * Open Graph tags, Twitter Cards, and other SEO-related meta tags.
 *
 * @example
 * ```typescript
 * import { SeoService } from 'invensys-ng';
 *
 * export class MyComponent {
 *   constructor(private seoService: SeoService) {
 *     this.seoService.updateMetaTags({
 *       title: 'My Page Title | My Site',
 *       description: 'Description of my page for search engines.',
 *       keywords: 'keyword1, keyword2, keyword3',
 *       url: 'https://example.com/my-page',
 *       image: 'https://example.com/og-image.png'
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  /**
   * Updates all SEO-related meta tags based on the provided configuration.
   *
   * @param config - The SEO configuration object
   */
  updateMetaTags(config: SeoConfig): void {
    // Set document title
    this.title.setTitle(config.title);

    // Basic meta tags
    this.meta.updateTag({ name: 'description', content: config.description });

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({
      property: 'og:description',
      content: config.description,
    });
    this.meta.updateTag({
      property: 'og:type',
      content: config.type || 'website',
    });

    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
      // Also update canonical link
      this.updateCanonicalUrl(config.url);
    }

    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    }

    if (config.siteName) {
      this.meta.updateTag({
        property: 'og:site_name',
        content: config.siteName,
      });
    }

    // Twitter Card tags
    this.meta.updateTag({
      name: 'twitter:card',
      content: config.twitterCard || 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: config.description,
    });

    if (config.image) {
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }

    if (config.url) {
      this.meta.updateTag({ property: 'twitter:url', content: config.url });
    }
  }

  /**
   * Sets only the page title.
   *
   * @param title - The title to set
   */
  setTitle(title: string): void {
    this.title.setTitle(title);
  }

  /**
   * Gets the current page title.
   *
   * @returns The current document title
   */
  getTitle(): string {
    return this.title.getTitle();
  }

  /**
   * Sets only the meta description.
   *
   * @param description - The description to set (recommended: 150-160 characters)
   */
  setDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
  }

  /**
   * Sets robots meta tag directives.
   *
   * @param content - The robots directive (e.g., 'index, follow', 'noindex, nofollow')
   */
  setRobots(content: string): void {
    this.meta.updateTag({ name: 'robots', content });
  }

  /**
   * Updates or creates the canonical URL link element.
   *
   * @param url - The canonical URL
   */
  updateCanonicalUrl(url: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    let link: HTMLLinkElement | null =
      document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  /**
   * Removes a specific meta tag by name or property.
   *
   * @param attrSelector - The attribute selector (e.g., "name='description'" or "property='og:title'")
   */
  removeTag(attrSelector: string): void {
    this.meta.removeTag(attrSelector);
  }
}
