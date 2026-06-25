import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService, SeoConfig } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let metaService: Meta;
  let titleService: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeoService, Meta, Title],
    });

    service = TestBed.inject(SeoService);
    metaService = TestBed.inject(Meta);
    titleService = TestBed.inject(Title);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setTitle', () => {
    it('should set the page title', () => {
      const testTitle = 'Test Page Title';
      service.setTitle(testTitle);
      expect(titleService.getTitle()).toBe(testTitle);
    });
  });

  describe('getTitle', () => {
    it('should return the current page title', () => {
      const testTitle = 'Current Title';
      titleService.setTitle(testTitle);
      expect(service.getTitle()).toBe(testTitle);
    });
  });

  describe('setDescription', () => {
    it('should set the meta description', () => {
      const testDescription = 'This is a test description';
      service.setDescription(testDescription);
      const descriptionTag = metaService.getTag('name="description"');
      expect(descriptionTag?.content).toBe(testDescription);
    });
  });

  describe('setRobots', () => {
    it('should set the robots meta tag', () => {
      const robotsContent = 'noindex, nofollow';
      service.setRobots(robotsContent);
      const robotsTag = metaService.getTag('name="robots"');
      expect(robotsTag?.content).toBe(robotsContent);
    });
  });

  describe('updateMetaTags', () => {
    it('should update all basic meta tags', () => {
      const config: SeoConfig = {
        title: 'Test Title',
        description: 'Test description for the page',
        keywords: 'test, keywords, seo',
      };

      service.updateMetaTags(config);

      expect(titleService.getTitle()).toBe(config.title);
      expect(metaService.getTag('name="description"')?.content).toBe(
        config.description
      );
      expect(metaService.getTag('name="keywords"')?.content).toBe(
        config.keywords
      );
    });

    it('should update Open Graph tags', () => {
      const config: SeoConfig = {
        title: 'OG Test Title',
        description: 'OG Test description',
        url: 'https://example.com/test',
        image: 'https://example.com/image.png',
        siteName: 'Test Site',
      };

      service.updateMetaTags(config);

      expect(metaService.getTag('property="og:title"')?.content).toBe(
        config.title
      );
      expect(metaService.getTag('property="og:description"')?.content).toBe(
        config.description
      );
      expect(metaService.getTag('property="og:url"')?.content).toBe(config.url);
      expect(metaService.getTag('property="og:image"')?.content).toBe(
        config.image
      );
      expect(metaService.getTag('property="og:site_name"')?.content).toBe(
        config.siteName
      );
    });

    it('should update Twitter Card tags', () => {
      const config: SeoConfig = {
        title: 'Twitter Test Title',
        description: 'Twitter Test description',
        url: 'https://example.com/test',
        image: 'https://example.com/twitter-image.png',
        twitterCard: 'summary_large_image',
      };

      service.updateMetaTags(config);

      expect(metaService.getTag('name="twitter:card"')?.content).toBe(
        config.twitterCard
      );
      expect(metaService.getTag('name="twitter:title"')?.content).toBe(
        config.title
      );
      expect(metaService.getTag('name="twitter:description"')?.content).toBe(
        config.description
      );
      expect(metaService.getTag('name="twitter:image"')?.content).toBe(
        config.image
      );
    });

    it('should set default og:type to website', () => {
      const config: SeoConfig = {
        title: 'Test',
        description: 'Test description',
      };

      service.updateMetaTags(config);

      expect(metaService.getTag('property="og:type"')?.content).toBe('website');
    });

    it('should use custom og:type when provided', () => {
      const config: SeoConfig = {
        title: 'Article Test',
        description: 'Test description',
        type: 'article',
      };

      service.updateMetaTags(config);

      expect(metaService.getTag('property="og:type"')?.content).toBe('article');
    });
  });

  describe('removeTag', () => {
    it('should remove a meta tag by name', () => {
      service.setDescription('Test description');
      expect(metaService.getTag('name="description"')).toBeTruthy();

      service.removeTag('name="description"');
      expect(metaService.getTag('name="description"')).toBeNull();
    });
  });
});
