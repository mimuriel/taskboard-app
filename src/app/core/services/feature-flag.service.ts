import { Injectable } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getValue } from '@angular/fire/remote-config';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {

  constructor(private remoteConfig: RemoteConfig) {
    this.remoteConfig.settings.minimumFetchIntervalMillis = 0;
    this.remoteConfig.defaultConfig = {
      enable_categories: true
    };
  }

  async isCategoriesEnabled(): Promise<boolean> {
    await fetchAndActivate(this.remoteConfig);
    return getValue(this.remoteConfig, 'enable_categories').asBoolean();
  }
}