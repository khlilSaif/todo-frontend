import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storageSub = new BehaviorSubject<string|null>(null);

  constructor() { 
    // Listen to local storage changes
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === 'guest') {
          this.storageSub.next(String(event.newValue));
        }
      });
    }
  }

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
    this.storageSub.next(value); // Notify subscribers
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
    this.storageSub.next(null); // Notify subscribers
  }

  get storageChanges$() {
    return this.storageSub.asObservable();
  }
}