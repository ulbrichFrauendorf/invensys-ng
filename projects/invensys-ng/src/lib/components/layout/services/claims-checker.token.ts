import { InjectionToken, Provider } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Interface for claims checking service.
 * Consuming applications should implement this interface and provide it
 * using the CLAIMS_CHECKER injection token.
 */
export interface ClaimsChecker {
  /**
   * Checks if the current user has the specified claim.
   * @param claim The claim to check
   * @returns Observable<boolean> indicating if the user has the claim
   */
  hasClaim(claim: string): Observable<boolean>;
}

/**
 * Injection token for providing a claims checking service.
 * Applications using claims-based menu filtering should provide
 * an implementation of ClaimsChecker using this token.
 * 
 * @example
 * // In your app.config.ts or module:
 * providers: [
 *   {
 *     provide: CLAIMS_CHECKER,
 *     useExisting: ClaimsClient // Your claims service
 *   }
 * ]
 */
export const CLAIMS_CHECKER = new InjectionToken<ClaimsChecker>('ClaimsChecker');

/**
 * Provides a claims checker service for menu item filtering.
 * This is the recommended way to configure claims-based access control in your application.
 * 
 * @param claimsService The claims service instance that implements the ClaimsChecker interface
 * @returns Provider configuration for dependency injection
 * 
 * @example
 * // In your app.config.ts:
 * import { provideMenuClaimsChecker } from 'invensys-ng';
 * import { ClaimsService } from './services/claims.service';
 * 
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideMenuClaimsChecker(ClaimsService),
 *     // ... other providers
 *   ]
 * };
 * 
 * @example
 * // Or provide an existing service instance:
 * providers: [
 *   ClaimsService,
 *   provideMenuClaimsChecker(ClaimsService)
 * ]
 */
export function provideMenuClaimsChecker(claimsService: any): Provider {
  return {
    provide: CLAIMS_CHECKER,
    useExisting: claimsService,
  };
}
