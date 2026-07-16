type AnalyticsValue = string | number | boolean;

type GtagWindow = Window & {
  gtag?: (command: "event", name: string, parameters?: Record<string, AnalyticsValue>) => void;
};

export function trackEvent(name: string, parameters: Record<string, AnalyticsValue> = {}): void {
  const gtag = (window as GtagWindow).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name, { ...parameters, transport_type: "beacon" });
}
