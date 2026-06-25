import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { StructuredDataService } from './structured-data.service';

describe('StructuredDataService', () => {
  let service: StructuredDataService;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StructuredDataService],
    });

    service = TestBed.inject(StructuredDataService);
    document = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    // Clean up any scripts added during tests
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    scripts.forEach((script) => script.remove());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('insertSchema', () => {
    it('should insert a new schema script', () => {
      const schema = { '@context': 'https://schema.org', '@type': 'Thing' };
      service.insertSchema(schema, 'test-schema');

      const script = document.getElementById('test-schema') as HTMLScriptElement;
      expect(script).toBeTruthy();
      expect(script.type).toBe('application/ld+json');
      expect(JSON.parse(script.textContent || '')).toEqual(schema);
    });

    it('should update existing schema script', () => {
      const schema1 = { '@context': 'https://schema.org', '@type': 'Thing' };
      const schema2 = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
      };

      service.insertSchema(schema1, 'update-test');
      service.insertSchema(schema2, 'update-test');

      const scripts = document.querySelectorAll('#update-test');
      expect(scripts.length).toBe(1);

      const script = scripts[0] as HTMLScriptElement;
      expect(JSON.parse(script.textContent || '')).toEqual(schema2);
    });
  });

  describe('removeSchema', () => {
    it('should remove an existing schema script', () => {
      service.insertSchema({ '@type': 'Thing' }, 'remove-test');
      expect(document.getElementById('remove-test')).toBeTruthy();

      service.removeSchema('remove-test');
      expect(document.getElementById('remove-test')).toBeNull();
    });

    it('should not throw when removing non-existent schema', () => {
      expect(() => service.removeSchema('non-existent')).not.toThrow();
    });
  });

  describe('createOrganizationSchema', () => {
    it('should create basic organization schema', () => {
      const schema = service.createOrganizationSchema({
        name: 'Test Company',
        url: 'https://test.com',
      });

      expect(schema).toEqual({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Test Company',
        url: 'https://test.com',
      });
    });

    it('should include optional fields when provided', () => {
      const schema = service.createOrganizationSchema({
        name: 'Test Company',
        url: 'https://test.com',
        logo: 'https://test.com/logo.png',
        sameAs: ['https://twitter.com/test', 'https://facebook.com/test'],
        contactPoint: {
          telephone: '+1-234-567-8900',
          contactType: 'customer service',
          areaServed: 'US',
          availableLanguage: ['English', 'Spanish'],
        },
      }) as Record<string, unknown>;

      expect(schema['logo']).toBe('https://test.com/logo.png');
      expect(schema['sameAs']).toEqual([
        'https://twitter.com/test',
        'https://facebook.com/test',
      ]);
      expect(schema['contactPoint']).toEqual({
        '@type': 'ContactPoint',
        telephone: '+1-234-567-8900',
        contactType: 'customer service',
        areaServed: 'US',
        availableLanguage: ['English', 'Spanish'],
      });
    });
  });

  describe('createWebSiteSchema', () => {
    it('should create basic website schema', () => {
      const schema = service.createWebSiteSchema({
        name: 'Test Website',
        url: 'https://test.com',
      });

      expect(schema).toEqual({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Test Website',
        url: 'https://test.com',
      });
    });

    it('should include description when provided', () => {
      const schema = service.createWebSiteSchema({
        name: 'Test Website',
        url: 'https://test.com',
        description: 'A test website description',
      }) as Record<string, unknown>;

      expect(schema['description']).toBe('A test website description');
    });

    it('should include search action when provided', () => {
      const schema = service.createWebSiteSchema({
        name: 'Test Website',
        url: 'https://test.com',
        potentialAction: {
          queryInput: 'required name=search_term_string',
          target: 'https://test.com/search?q={search_term_string}',
        },
      }) as Record<string, unknown>;

      expect(schema['potentialAction']).toEqual({
        '@type': 'SearchAction',
        target: 'https://test.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      });
    });
  });

  describe('createBreadcrumbSchema', () => {
    it('should create breadcrumb schema with correct positions', () => {
      const schema = service.createBreadcrumbSchema([
        { name: 'Home', url: 'https://test.com' },
        { name: 'Products', url: 'https://test.com/products' },
        { name: 'Widget', url: 'https://test.com/products/widget' },
      ]) as Record<string, unknown>;

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');

      const items = schema['itemListElement'] as unknown[];
      expect(items.length).toBe(3);
      expect((items[0] as Record<string, unknown>)['position']).toBe(1);
      expect((items[1] as Record<string, unknown>)['position']).toBe(2);
      expect((items[2] as Record<string, unknown>)['position']).toBe(3);
    });
  });

  describe('createArticleSchema', () => {
    it('should create basic article schema', () => {
      const schema = service.createArticleSchema({
        headline: 'Test Article',
        description: 'Test description',
        datePublished: '2024-01-15',
        author: {
          name: 'Test Author',
        },
      }) as Record<string, unknown>;

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Article');
      expect(schema['headline']).toBe('Test Article');
      expect(schema['datePublished']).toBe('2024-01-15');
    });

    it('should include optional fields when provided', () => {
      const schema = service.createArticleSchema({
        headline: 'Test Article',
        description: 'Test description',
        datePublished: '2024-01-15',
        dateModified: '2024-01-20',
        image: 'https://test.com/image.png',
        author: {
          name: 'Test Author',
          url: 'https://test.com/author',
        },
      }) as Record<string, unknown>;

      expect(schema['image']).toBe('https://test.com/image.png');
      expect(schema['dateModified']).toBe('2024-01-20');
      expect((schema['author'] as Record<string, unknown>)['url']).toBe(
        'https://test.com/author'
      );
    });
  });

  describe('createSoftwareApplicationSchema', () => {
    it('should create basic software application schema', () => {
      const schema = service.createSoftwareApplicationSchema({
        name: 'Test App',
        description: 'A test application',
        applicationCategory: 'DeveloperTools',
      });

      expect(schema).toEqual({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Test App',
        description: 'A test application',
        applicationCategory: 'DeveloperTools',
      });
    });

    it('should include offers when provided', () => {
      const schema = service.createSoftwareApplicationSchema({
        name: 'Test App',
        description: 'A test application',
        applicationCategory: 'DeveloperTools',
        offers: {
          price: '0',
          priceCurrency: 'USD',
        },
      }) as Record<string, unknown>;

      expect(schema['offers']).toEqual({
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      });
    });
  });
});
