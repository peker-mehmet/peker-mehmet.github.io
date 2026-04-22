declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}

function sendEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag || process.env.NODE_ENV !== 'production') return;
  window.gtag('event', name, params);
}

export function trackDownload(fileName: string, fileType: string, page: string) {
  sendEvent('file_download', { file_name: fileName, file_extension: fileType, page_location: page });
}

export function trackCitationCopy(sourceName: string) {
  sendEvent('citation_copy', { source_name: sourceName });
}

export function trackLanguageSwitch(fromLang: string, toLang: string) {
  sendEvent('language_switch', { from_language: fromLang, to_language: toLang });
}

export function trackInterestClick(interestName: string) {
  sendEvent('interest_click', { interest_name: interestName });
}
